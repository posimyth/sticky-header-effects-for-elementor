<?php
/**
 * Multi-Sticky Support Module — REBUILT from scratch.
 *
 * Two modes:
 *   - STACK: all enabled sticky containers visible at top simultaneously,
 *     each positioned below the cumulative height of those above.
 *   - SEQUENTIAL: only one container visible at any moment; as the user
 *     scrolls, the next container takes over the top spot from the
 *     previous one (baton-pass pattern).
 *
 * Architecture (different from the previous build):
 *   - `position: fixed` (not sticky) — bypasses the Theme Builder
 *     `<header>` wrapper scroll-range constraint that broke v1.
 *   - Placeholder spacers preserve layout when containers go fixed.
 *   - JS coordinator measures natural positions, manages active state
 *     per mode, and recomputes on scroll/resize/load.
 *   - Self-contained: no dependency on Free's `Enable` toggle, no
 *     dependency on Elementor's Motion Effects → Sticky. Toggling
 *     Multi-Sticky Mode on a section is the only thing required.
 *
 * Capped at 5 containers per page. The JS keeps the first 5 sorted
 * by priority; anything beyond is ignored (with a console warning).
 *
 * Phase 2 ready: `is_active()` filterable via `she_is_pro_feature_active`.
 *
 * @package she-header
 * @since   2.2.2
 */

namespace SheHeader\Modules\MultiSticky;

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
	 * Maximum number of containers that can participate in coordination
	 * per page. Enforced both in UI (notice) and at runtime in JS.
	 */
	const MAX_CONTAINERS = 5;

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
		return 'multi-sticky';
	}

	/**
	 * Whether this module should load.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return (bool) apply_filters( 'she_is_pro_feature_active', true, 'multi-sticky' );
	}

	/**
	 * Register Multi-Sticky controls inside Free's existing Sticky
	 * Header Effects panel section.
	 *
	 * Controls are NOT gated behind Free's Enable — Multi-Sticky is
	 * a fully self-contained Pro feature.
	 *
	 * @param Controls_Stack $element Elementor section or container.
	 * @return void
	 */
	public function register_controls( Controls_Stack $element ) {

		// All Multi-Sticky controls are gated behind Free's main `Enable`
		// (transparent != ''). Multi-Sticky is a sub-feature of the
		// Sticky Header Effects panel — it doesn't make sense without
		// the main switcher being on.
		$element->add_control(
			'she_multi_heading',
			array(
				'label'     => __( 'Multi-Sticky Coordination', 'she-header' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_multi_enable',
			array(
				'label'        => __( 'Enable Multi-Sticky Mode', 'she-header' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'On', 'she-header' ),
				'label_off'    => __( 'Off', 'she-header' ),
				'return_value' => 'yes',
				'default'      => '',
				'description'  => __( 'Coordinates this sticky section with other sticky sections on the page. Requires Free\'s main "Enable Sticky Header Effects" toggle above to be on.', 'she-header' ),
				'condition'    => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_multi_mode',
			array(
				'label'       => __( 'Behavior', 'she-header' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => 'stack',
				'options'     => array(
					'stack'      => __( 'Stack (Both / All Visible)', 'she-header' ),
					'sequential' => __( 'Sequential (Swap on Scroll)', 'she-header' ),
				),
				'description' => __( '<strong>Stack:</strong> all sticky containers visible at top, stacked below one another.<br><strong>Sequential:</strong> only one visible at a time. When the next container reaches the top, the current one disappears and the next takes over.', 'she-header' ),
				'condition'   => array(
					'transparent!'    => '',
					'she_multi_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_multi_priority',
			array(
				'label'       => __( 'Order / Priority', 'she-header' ),
				'type'        => Controls_Manager::NUMBER,
				'default'     => 0,
				'min'         => 0,
				'max'         => 100,
				'step'        => 1,
				'description' => __( '0 = first (top in Stack, first in Sequential). Higher numbers come after. Example: announcement bar = 0, main nav = 1.', 'she-header' ),
				'condition'   => array(
					'transparent!'    => '',
					'she_multi_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_multi_activate_manual',
			array(
				'label'        => __( 'Set Activation Point Manually', 'she-header' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'Yes', 'she-header' ),
				'label_off'    => __( 'Auto', 'she-header' ),
				'return_value' => 'yes',
				'default'      => '',
				'description'  => __( 'By default this container becomes sticky automatically when its own position reaches the top. If it sticks too early or too late, turn this on and enter the exact scroll distance below.', 'she-header' ),
				'condition'    => array(
					'transparent!'     => '',
					'she_multi_enable' => 'yes',
				),
			)
		);

		$element->add_responsive_control(
			'she_multi_activate_distance',
			array(
				'label'       => __( 'Activation Scroll Distance (px)', 'she-header' ),
				'type'        => Controls_Manager::SLIDER,
				'size_units'  => array( 'px' ),
				'range'       => array(
					'px' => array(
						'min'  => 0,
						'max'  => 10000,
						'step' => 10,
					),
				),
				'default'     => array(
					'unit' => 'px',
					'size' => 600,
				),
				'description' => __( 'This container takes over at the top once the page has been scrolled this many pixels. Bypasses automatic measurement entirely, so lazy-loaded images above it can never throw the timing off.', 'she-header' ),
				'condition'   => array(
					'transparent!'              => '',
					'she_multi_enable'          => 'yes',
					'she_multi_activate_manual' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_multi_max_notice',
			array(
				'raw'             => sprintf(
					/* translators: %d is the max number of containers — 5 */
					__( '<strong>Limit:</strong> up to <strong>%d</strong> Multi-Sticky containers per page are supported. If more than %d are enabled, only the first %d (by Priority order) will coordinate; the rest are ignored.', 'she-header' ),
					self::MAX_CONTAINERS,
					self::MAX_CONTAINERS,
					self::MAX_CONTAINERS
				),
				'type'            => Controls_Manager::RAW_HTML,
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
				'condition'       => array(
					'transparent!'     => '',
					'she_multi_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_multi_notice',
			array(
				'raw'             => __( 'For coordination, at least <strong>two</strong> sticky sections on the page need this enabled. When sections declare different Behavior values, the lowest-priority section\'s mode wins for the group.', 'she-header' ),
				'type'            => Controls_Manager::RAW_HTML,
				'content_classes' => 'elementor-descriptor',
				'condition'       => array(
					'transparent!'     => '',
					'she_multi_enable' => 'yes',
				),
			)
		);
	}

	/**
	 * Tag the section's wrapper at render time with the data attributes
	 * the JS coordinator uses to discover and order it.
	 *
	 * No dependency on Free's `transparent = yes` — Multi-Sticky is
	 * standalone.
	 *
	 * @param \Elementor\Element_Base $element
	 * @return void
	 */
	public function tag_section( $element ) {
		if ( $this->is_editor_or_preview() ) {
			return;
		}

		$settings = $element->get_settings_for_display();

		// Multi-Sticky is a sub-feature of Free's Sticky Header Effects:
		// the main "Enable" switcher MUST be on for Multi-Sticky to
		// activate. This matches the editor UI gating where Multi-Sticky
		// controls only show when `transparent` is `yes`.
		if ( empty( $settings['transparent'] ) || 'yes' !== $settings['transparent'] ) {
			return;
		}
		if ( empty( $settings['she_multi_enable'] ) || 'yes' !== $settings['she_multi_enable'] ) {
			return;
		}

		$mode     = isset( $settings['she_multi_mode'] ) ? (string) $settings['she_multi_mode'] : 'stack';
		$priority = isset( $settings['she_multi_priority'] ) ? (int) $settings['she_multi_priority'] : 0;

		// Whitelist mode to prevent arbitrary attribute injection.
		if ( ! in_array( $mode, array( 'stack', 'sequential' ), true ) ) {
			$mode = 'stack';
		}

		$element->add_render_attribute( '_wrapper', 'data-she-multi-mode', $mode );
		$element->add_render_attribute( '_wrapper', 'data-she-multi-priority', (string) $priority );

		// Manual activation override — emits responsive data attributes so
		// the JS can use an explicit scroll distance instead of measuring.
		if ( ! empty( $settings['she_multi_activate_manual'] ) && 'yes' === $settings['she_multi_activate_manual'] ) {
			$distance_desktop = isset( $settings['she_multi_activate_distance']['size'] )
				? (int) $settings['she_multi_activate_distance']['size']
				: null;
			$distance_tablet  = isset( $settings['she_multi_activate_distance_tablet']['size'] )
				? (int) $settings['she_multi_activate_distance_tablet']['size']
				: null;
			$distance_mobile  = isset( $settings['she_multi_activate_distance_mobile']['size'] )
				? (int) $settings['she_multi_activate_distance_mobile']['size']
				: null;

			if ( null !== $distance_desktop ) {
				$element->add_render_attribute( '_wrapper', 'data-she-multi-activate-at', (string) $distance_desktop );
			}
			if ( null !== $distance_tablet ) {
				$element->add_render_attribute( '_wrapper', 'data-she-multi-activate-at-tablet', (string) $distance_tablet );
			}
			if ( null !== $distance_mobile ) {
				$element->add_render_attribute( '_wrapper', 'data-she-multi-activate-at-mobile', (string) $distance_mobile );
			}
		}
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
	 * Enqueue coordinator CSS and JS, passing the MAX_CONTAINERS
	 * constant through to JS so both sides agree.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		wp_enqueue_style(
			'she-multi-sticky',
			SHE_HEADER_URL . 'modules/multi-sticky/assets/css/multi-sticky.css',
			array(),
			SHE_HEADER_VERSION
		);
		wp_enqueue_script(
			'she-multi-sticky',
			SHE_HEADER_URL . 'modules/multi-sticky/assets/js/multi-sticky.js',
			array(),
			SHE_HEADER_VERSION,
			true
		);
		wp_localize_script(
			'she-multi-sticky',
			'SheMultiStickyConfig',
			array(
				'maxContainers' => (int) self::MAX_CONTAINERS,
			)
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

		// Inject controls into Free's Sticky Header Effects panel.
		add_action(
			'elementor/element/section/section_sticky_header_effect/before_section_end',
			array( $this, 'register_controls' )
		);
		add_action(
			'elementor/element/container/section_sticky_header_effect/before_section_end',
			array( $this, 'register_controls' )
		);

		// Tag at render time (Section + Container).
		add_action(
			'elementor/frontend/section/before_render',
			array( $this, 'tag_section' )
		);
		add_action(
			'elementor/frontend/container/before_render',
			array( $this, 'tag_section' )
		);

		// Frontend assets — skip editor.
		if ( ! $this->is_editor_or_preview() ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		}
	}
}
