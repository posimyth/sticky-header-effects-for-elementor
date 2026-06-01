<?php
/**
 * Header Replace on Scroll Module.
 *
 * Lets the user pick a second Elementor template that replaces the
 * original header when it enters its sticky state. Original fades/slides
 * out; alternate fades/slides in.
 *
 * Architecture:
 *  - `before_render` tags the original section's wrapper with
 *    `data-she-replace-pair-id="<element_id>"` so JS can locate its pair.
 *  - `after_render` echoes the alternate template's HTML inside a
 *    `<div class="she-header-alternate" data-she-alternate-for="<id>">`
 *    immediately after the original. Template rendered via the official
 *    `Frontend::get_builder_content_for_display()` API (which also
 *    enqueues the template's CSS once per page load).
 *  - A vanilla-JS MutationObserver watches the original section's class
 *    attribute. When Free toggles `.she-header`, it flips the active /
 *    swapped-out classes on the pair.
 *
 * Editor preview: alternate is NOT rendered while editing — keeps the
 * Elementor UI clean. Users see the swap on the live frontend only.
 *
 * Phase 2 ready: `is_active()` filterable via `she_is_pro_feature_active`.
 *
 * @package she-header
 * @since   2.2.0
 */

namespace SheHeader\Modules\HeaderReplace;

use Elementor;
use Elementor\Controls_Manager;
use Elementor\Controls_Stack;
use SheHeader\Base\Module_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Module.
 */
class Module extends Module_Base {

	/**
	 * Pending alternate-template renders, collected during the page's
	 * Elementor render passes and flushed in `wp_footer`.
	 *
	 * We do NOT render the alternate template inside Elementor's own
	 * `after_render` hook because:
	 *   - That hook fires inside Elementor's render pipeline.
	 *   - Calling `get_builder_content_for_display` from there triggers
	 *     a nested render pass that Elementor's render manager / global
	 *     state machine doesn't reliably handle across versions and can
	 *     cause `wp_footer` to never fire or PHP to hang.
	 *   - Even with a recursion guard, certain Theme Builder + Pro
	 *     combinations would still cause page hangs.
	 *
	 * Solution: in `before_render` we just queue the work + tag the
	 * wrapper for pairing. After Elementor finishes everything, we
	 * render each pending alternate in `wp_footer` and echo the
	 * wrapper at the end of the page. CSS uses `position: fixed`
	 * so DOM position doesn't matter — JS pairs via data attributes.
	 *
	 * @var array<int, array{element_id:string, template_id:int, transition:string, z_index:int}>
	 */
	private static $pending_alternates = array();

	/**
	 * Recursion guard kept as a safety net for the wp_footer pass —
	 * even though we render outside Elementor's hooks, a template that
	 * itself contains a sticky+replace section could still loop.
	 *
	 * @var int[]
	 */
	private static $rendering_template_ids = array();

	/**
	 * Hot flag set true while we're in the middle of rendering an
	 * alternate template inside `render_pending_alternates()`.
	 *
	 * Why: `get_builder_content_for_display()` fires Elementor's full
	 * render pipeline for the template, which means every section /
	 * container inside the template triggers `before_render` again →
	 * our `tag_section_for_pairing` gets called once per nested element.
	 * On a 20-section template that's 20+ redundant setting-evaluations
	 * per page load (~18 seconds in the worst case).
	 *
	 * When this flag is true, `tag_section_for_pairing` bails immediately
	 * so nested element renders cost nothing. The flag is scoped to one
	 * alternate render at a time (set true, render, set false).
	 *
	 * @var bool
	 */
	private static $is_rendering_alternate = false;

	/**
	 * Constructor.
	 */
	public function __construct() {
		parent::__construct();

		$this->add_actions();
	}

	/**
	 * Module name (used by autoloader / module manager).
	 *
	 * @return string
	 */
	public function get_name() {
		return 'header-replace';
	}

	/**
	 * Whether this module should load.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return (bool) apply_filters( 'she_is_pro_feature_active', true, 'header-replace' );
	}

	/**
	 * Register controls inside Free's existing Sticky Header Effects panel.
	 *
	 * @param Controls_Stack $element Elementor section or container.
	 * @return void
	 */
	public function register_controls( Controls_Stack $element ) {

		$element->add_control(
			'she_replace_heading',
			array(
				'label'     => __( 'Header Replace on Scroll', 'she-header' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_replace_enable',
			array(
				'label'        => __( 'Enable Header Replace', 'she-header' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'On', 'she-header' ),
				'label_off'    => __( 'Off', 'she-header' ),
				'return_value' => 'yes',
				'default'      => '',
				'description'  => __( 'Swap to a different Elementor template when the header becomes sticky.', 'she-header' ),
				'condition'    => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_replace_template_id',
			array(
				'label'       => __( 'Replacement Template', 'she-header' ),
				'type'        => Controls_Manager::SELECT,
				'label_block' => true,
				'default'     => '',
				'options'     => $this->get_templates_options(),
				'description' => __( 'Pick the Elementor template to render when sticky activates. Manage templates in Templates → Saved Templates.', 'she-header' ),
				'condition'   => array(
					'transparent!'        => '',
					'she_replace_enable'  => 'yes',
				),
			)
		);

		$element->add_control(
			'she_replace_transition',
			array(
				'label'     => __( 'Transition', 'she-header' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'fade',
				'options'   => array(
					'fade'       => __( 'Fade', 'she-header' ),
					'slide-down' => __( 'Slide Down', 'she-header' ),
					'slide-up'   => __( 'Slide Up', 'she-header' ),
					'none'       => __( 'None (Instant)', 'she-header' ),
				),
				'condition' => array(
					'transparent!'        => '',
					'she_replace_enable'  => 'yes',
				),
			)
		);

		$element->add_control(
			'she_replace_duration',
			array(
				'label'      => __( 'Transition Duration', 'she-header' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 's', 'ms' ),
				'range'      => array(
					's'  => array(
						'min'  => 0,
						'max'  => 3,
						'step' => 0.1,
					),
					'ms' => array(
						'min'  => 0,
						'max'  => 3000,
						'step' => 50,
					),
				),
				'default'    => array(
					'unit' => 's',
					'size' => 0.3,
				),
				'selectors'  => array(
					'.she-header-alternate[data-she-alternate-for="{{ID}}"], [data-she-replace-pair-id="{{ID}}"]' => 'transition-duration: {{SIZE}}{{UNIT}};',
				),
				'condition'  => array(
					'transparent!'        => '',
					'she_replace_enable'  => 'yes',
				),
			)
		);

		$element->add_control(
			'she_replace_z_index',
			array(
				'label'      => __( 'Z-Index', 'she-header' ),
				'type'       => Controls_Manager::NUMBER,
				'default'    => 9999,
				'min'        => 0,
				'max'        => 999999,
				'step'       => 1,
				'description' => __( 'Stacking order of the replacement template. Increase if it gets covered by other fixed elements.', 'she-header' ),
				'condition'  => array(
					'transparent!'        => '',
					'she_replace_enable'  => 'yes',
				),
			)
		);

		$element->add_control(
			'she_replace_notice',
			array(
				'raw'             => __( 'The replacement template renders only on the frontend (not while editing). Save and view the page to test the swap. The replacement\'s CSS is loaded automatically.', 'she-header' ),
				'type'            => Controls_Manager::RAW_HTML,
				'content_classes' => 'elementor-descriptor',
				'condition'       => array(
					'transparent!'       => '',
					'she_replace_enable' => 'yes',
				),
			)
		);
	}

	/**
	 * Build the SELECT options list for the Replacement Template.
	 *
	 * Includes ALL Elementor library templates (header / section /
	 * container types) so users can use any saved template as a sticky
	 * replacement, not just header-typed ones. Type is shown in the label.
	 *
	 * Capped at 200 entries.
	 *
	 * @return array<string, string>
	 */
	private function get_templates_options() {
		$options = array( '' => __( '— Select a template —', 'she-header' ) );

		$templates = get_posts(
			array(
				'post_type'        => 'elementor_library',
				'post_status'      => 'publish',
				'posts_per_page'   => 200,
				'orderby'          => 'title',
				'order'            => 'ASC',
				'suppress_filters' => true,
			)
		);

		foreach ( $templates as $template ) {
			$type    = get_post_meta( $template->ID, '_elementor_template_type', true );
			$label   = $template->post_title !== '' ? $template->post_title : '(no title)';
			$label   = $type ? sprintf( '%s (%s)', $label, $type ) : $label;
			$options[ (string) $template->ID ] = $label;
		}

		return $options;
	}

	/**
	 * Runs at `before_render` for each section/container. Two jobs:
	 *  1) Tag the wrapper with `data-she-replace-pair-id` so the JS can
	 *     pair it with its alternate later.
	 *  2) Queue this section for alternate-template rendering at
	 *     `wp_footer` time (outside Elementor's render pipeline).
	 *
	 * @param \Elementor\Element_Base $element
	 * @return void
	 */
	public function tag_section_for_pairing( $element ) {
		// Hot path: bail before doing ANY work if we're inside a nested
		// alternate template render. See the doc on $is_rendering_alternate
		// for why this matters for performance.
		if ( self::$is_rendering_alternate ) {
			return;
		}

		if ( $this->is_editor_or_preview() ) {
			return;
		}
		if ( ! $this->is_replace_enabled( $element ) ) {
			return;
		}

		$settings    = $element->get_settings_for_display();
		$template_id = isset( $settings['she_replace_template_id'] ) ? (int) $settings['she_replace_template_id'] : 0;
		if ( $template_id <= 0 ) {
			return;
		}

		// Self-reference guard — picked the same post being viewed.
		$current_post_id = (int) get_the_ID();
		if ( $current_post_id > 0 && $template_id === $current_post_id ) {
			return;
		}

		// Skip if already queued (e.g. element re-rendered for some reason).
		foreach ( self::$pending_alternates as $entry ) {
			if ( $entry['element_id'] === $element->get_id() ) {
				return;
			}
		}

		$transition = isset( $settings['she_replace_transition'] ) ? (string) $settings['she_replace_transition'] : 'fade';
		$z_index    = isset( $settings['she_replace_z_index'] ) ? (int) $settings['she_replace_z_index'] : 9999;

		// Whitelist transition value to known modifiers.
		$allowed_transitions = array( 'fade', 'slide-down', 'slide-up', 'none' );
		if ( ! in_array( $transition, $allowed_transitions, true ) ) {
			$transition = 'fade';
		}

		$element->add_render_attribute( '_wrapper', 'data-she-replace-pair-id', $element->get_id() );

		self::$pending_alternates[] = array(
			'element_id'  => $element->get_id(),
			'template_id' => $template_id,
			'transition'  => $transition,
			'z_index'     => $z_index,
		);
	}

	/**
	 * Render all queued alternate templates after Elementor has finished
	 * all its own renders. Hooked to `wp_footer`.
	 *
	 * Each rendered alternate is wrapped in a div with
	 * `data-she-alternate-for="<element_id>"` so the JS pair watcher
	 * can locate it. CSS uses `position: fixed` so DOM position is
	 * irrelevant — output at end of `<body>` is fine.
	 *
	 * @return void
	 */
	public function render_pending_alternates() {
		if ( empty( self::$pending_alternates ) ) {
			return;
		}
		if ( $this->is_editor_or_preview() ) {
			return;
		}
		if ( ! class_exists( '\Elementor\Plugin' )
			|| ! isset( Elementor\Plugin::instance()->frontend )
			|| ! method_exists( Elementor\Plugin::instance()->frontend, 'get_builder_content_for_display' ) ) {
			return;
		}

		foreach ( self::$pending_alternates as $entry ) {
			$template_id = (int) $entry['template_id'];

			// Recursion guard — defense in depth.
			if ( in_array( $template_id, self::$rendering_template_ids, true ) ) {
				continue;
			}

			$template = get_post( $template_id );
			if ( ! $template || 'publish' !== $template->post_status ) {
				continue;
			}

			// ----------- TRANSIENT CACHE
			//
			// `get_builder_content_for_display` fires `elementor/frontend/
			// the_content` and a CSS regeneration pass. On sites with
			// content/CSS optimization plugins active (WP Compress, etc.)
			// or a stack of Elementor extensions, that single call can take
			// many seconds. We cache the rendered HTML keyed by template id
			// + the template's modified time, so:
			//   - First page load: renders once and caches.
			//   - Subsequent loads: serves from transient (~sub-ms).
			//   - When the user edits the template, post_modified changes
			//     → new cache key → automatic invalidation.
			//
			// Caveat: dynamic content inside the template (per-user ACF
			// values, current-post tags) will reflect whichever post was
			// active at first render. Header templates are typically static
			// content (logo + menu) so this is acceptable for v1.

			$mod_time = get_post_modified_time( 'U', false, $template_id );
			if ( ! $mod_time ) {
				$mod_time = 0;
			}
			$cache_key = 'she_hr_alt_' . $template_id . '_' . $mod_time;

			$content = get_transient( $cache_key );

			if ( false === $content ) {
				self::$rendering_template_ids[] = $template_id;
				self::$is_rendering_alternate   = true;

				$content = '';
				try {
					$content = Elementor\Plugin::instance()->frontend->get_builder_content_for_display( $template_id, true );
				} catch ( \Throwable $e ) {
					$content = '';
				}

				self::$is_rendering_alternate = false;

				$idx = array_search( $template_id, self::$rendering_template_ids, true );
				if ( false !== $idx ) {
					array_splice( self::$rendering_template_ids, $idx, 1 );
				}

				// Cache for 1 hour. Modified-time keying makes the actual
				// effective lifetime "until next edit".
				set_transient( $cache_key, (string) $content, HOUR_IN_SECONDS );
			} else {
				// Cached HTML doesn't carry CSS enqueue side-effects, so
				// ensure the template's CSS is on the page either way.
				// `Post_CSS::create()->enqueue()` is idempotent — Elementor
				// short-circuits if already enqueued this request.
				if ( class_exists( '\Elementor\Core\Files\CSS\Post' ) ) {
					try {
						\Elementor\Core\Files\CSS\Post::create( $template_id )->enqueue();
					} catch ( \Throwable $e ) {
						// Non-fatal — alternate still renders, just without its CSS.
					}
				}
			}

			if ( '' === trim( (string) $content ) ) {
				continue;
			}

			printf(
				'<div class="she-header-alternate she-header-alternate--%1$s" data-she-alternate-for="%2$s" style="z-index:%3$d;" aria-hidden="true">%4$s</div>',
				esc_attr( $entry['transition'] ),
				esc_attr( $entry['element_id'] ),
				(int) $entry['z_index'],
				$content // already-rendered Elementor HTML; do NOT escape.
			);
		}

		// Clear the queue so a second wp_footer call (rare, but possible
		// in some themes) doesn't double-emit.
		self::$pending_alternates = array();
	}

	/**
	 * Is Header Replace enabled and configured on this element?
	 *
	 * @param \Elementor\Element_Base $element
	 * @return bool
	 */
	private function is_replace_enabled( $element ) {
		$settings = $element->get_settings_for_display();

		if ( empty( $settings['transparent'] ) || 'yes' !== $settings['transparent'] ) {
			return false;
		}
		if ( empty( $settings['she_replace_enable'] ) || 'yes' !== $settings['she_replace_enable'] ) {
			return false;
		}
		if ( empty( $settings['she_replace_template_id'] ) ) {
			return false;
		}
		return true;
	}

	/**
	 * Detect Elementor editor or preview context.
	 *
	 * @return bool
	 */
	private function is_editor_or_preview() {
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return false;
		}
		$ep = Elementor\Plugin::instance();

		if ( isset( $ep->editor ) && $ep->editor->is_edit_mode() ) {
			return true;
		}
		if ( isset( $ep->preview ) && method_exists( $ep->preview, 'is_preview_mode' ) && $ep->preview->is_preview_mode() ) {
			return true;
		}
		return false;
	}

	/**
	 * Enqueue CSS for hidden/visible states + transition variants, and
	 * the vanilla-JS pair-watcher.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		wp_enqueue_style(
			'she-header-replace',
			SHE_HEADER_URL . 'modules/header-replace/assets/css/header-replace.css',
			array(),
			SHE_HEADER_VERSION
		);
		wp_enqueue_script(
			'she-header-replace',
			SHE_HEADER_URL . 'modules/header-replace/assets/js/header-replace.js',
			array(),
			SHE_HEADER_VERSION,
			true
		);
	}

	/**
	 * Hook everything.
	 *
	 * @return void
	 */
	private function add_actions() {
		if ( ! function_exists( 'is_plugin_active' ) ) {
			include_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		if ( ! is_plugin_active( 'elementor/elementor.php' ) ) {
			return;
		}

		// Inject controls into Free's existing panel section.
		add_action(
			'elementor/element/section/section_sticky_header_effect/before_section_end',
			array( $this, 'register_controls' )
		);
		add_action(
			'elementor/element/container/section_sticky_header_effect/before_section_end',
			array( $this, 'register_controls' )
		);

		// Tag + queue at before_render time for both Section and Container.
		// Actual alternate-template rendering is deferred to wp_footer
		// (see render_pending_alternates() and the @var doc on
		// $pending_alternates for why).
		add_action(
			'elementor/frontend/section/before_render',
			array( $this, 'tag_section_for_pairing' )
		);
		add_action(
			'elementor/frontend/container/before_render',
			array( $this, 'tag_section_for_pairing' )
		);

		// Flush the alternate-template render queue at the very end of
		// the page, AFTER all Elementor renders are done. Priority 5
		// puts us before most third-party wp_footer hooks but still in
		// the footer phase.
		add_action( 'wp_footer', array( $this, 'render_pending_alternates' ), 5 );

		// Frontend assets — skip editor.
		if ( ! $this->is_editor_or_preview() ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		}
	}
}
