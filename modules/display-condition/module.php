<?php
/**
 * Display Condition Module.
 *
 * A rules engine that gates Free's sticky header behavior on a per-page
 * basis. Two repeaters (Include / Exclude) hold rule rows. Server-side
 * resolution happens via Elementor's `before_render` hook for sections
 * and containers; on a mismatch we tag the section with
 * `data-she-dc-status="fail"` and a tiny front-end shim strips
 * `she-header-yes` from those sections before Free's scroll handler
 * gets a chance to act.
 *
 * Why a JS shim instead of unsetting `transparent` directly:
 *   Elementor's Element_Base doesn't reliably expose a setter that
 *   propagates to render-time `prefix_class` output across versions.
 *   `add_render_attribute('_wrapper', ...)` is the official, stable API
 *   for injecting wrapper attributes from `before_render`, so we use it
 *   plus a trivial 6-line JS removal step. Decoupled from Free's JS.
 *
 * Editor preview: conditions are intentionally NOT evaluated in the
 * Elementor editor — designers always see the sticky section while
 * building (otherwise rules like "logged-out only" would hide the
 * section from the admin author).
 *
 * Rule types: site, front, posts_page, 404, search,
 *              specific (post/page), post_type,
 *              taxonomy, term, logged_in, logged_out, role,
 *              url_contains, archive, author.
 *
 * Phase 2 ready: `is_active()` filterable via `she_is_pro_feature_active`.
 *
 * @package she-header
 * @since   2.2.0
 */

namespace SheHeader\Modules\DisplayCondition;

use Elementor;
use Elementor\Controls_Manager;
use Elementor\Controls_Stack;
use Elementor\Repeater;
use SheHeader\Base\Module_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Module.
 */
class Module extends Module_Base {

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
		return 'display-condition';
	}

	/**
	 * Whether this module should load.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return (bool) apply_filters( 'she_is_pro_feature_active', true, 'display-condition' );
	}

	/**
	 * Register controls inside Free's existing Sticky Header Effects panel.
	 *
	 * @param Controls_Stack $element Elementor section or container.
	 * @return void
	 */
	public function register_controls( Controls_Stack $element ) {

		$element->add_control(
			'she_dc_heading',
			array(
				'label'     => __( 'Display Conditions', 'she-header' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_dc_enable',
			array(
				'label'        => __( 'Enable Conditions', 'she-header' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'On', 'she-header' ),
				'label_off'    => __( 'Off', 'she-header' ),
				'return_value' => 'yes',
				'default'      => '',
				'description'  => __( 'Control where the sticky behavior applies. With no rules, sticky shows everywhere.', 'she-header' ),
				'condition'    => array(
					'transparent!' => '',
				),
			)
		);

		// Build the shared rule-row schema once and reuse for both repeaters.
		$row_fields = $this->get_rule_row_fields();

		$element->add_control(
			'she_dc_include',
			array(
				'label'         => __( 'Include On (Show Sticky)', 'she-header' ),
				'type'          => Controls_Manager::REPEATER,
				'fields'        => $row_fields,
				'default'       => array(),
				'title_field'   => '{{{ she_dc_type }}}',
				'prevent_empty' => false,
				'condition'     => array(
					'transparent!'   => '',
					'she_dc_enable'  => 'yes',
				),
			)
		);

		$element->add_control(
			'she_dc_exclude',
			array(
				'label'         => __( 'Exclude On (Hide Sticky)', 'she-header' ),
				'type'          => Controls_Manager::REPEATER,
				'fields'        => $row_fields,
				'default'       => array(),
				'title_field'   => '{{{ she_dc_type }}}',
				'prevent_empty' => false,
				'condition'     => array(
					'transparent!'   => '',
					'she_dc_enable'  => 'yes',
				),
			)
		);

		$element->add_control(
			'she_dc_logic_notice',
			array(
				'raw'             => __(
					'Sticky shows where <strong>Include</strong> matches <em>AND</em> <strong>Exclude</strong> does not. With no rules in either repeater, sticky shows everywhere (default).',
					'she-header'
				),
				'type'            => Controls_Manager::RAW_HTML,
				'content_classes' => 'elementor-descriptor',
				'condition'       => array(
					'transparent!'  => '',
					'she_dc_enable' => 'yes',
				),
			)
		);
	}

	/**
	 * Build the array of controls used inside both repeaters.
	 *
	 * Kept as a method (not a constant) so we can populate options
	 * from the current site's posts/post types each editor load.
	 *
	 * @return array Repeater fields array.
	 */
	private function get_rule_row_fields() {
		$repeater = new Repeater();

		$repeater->add_control(
			'she_dc_type',
			array(
				'label'       => __( 'Rule Type', 'she-header' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => 'site',
				'label_block' => true,
				'options'     => array(
					'site'         => __( 'Entire Site', 'she-header' ),
					'front'        => __( 'Front Page', 'she-header' ),
					'posts_page'   => __( 'Posts Page (Blog)', 'she-header' ),
					'404'          => __( '404 Page', 'she-header' ),
					'search'       => __( 'Search Results', 'she-header' ),
					'specific'     => __( 'Specific Post / Page', 'she-header' ),
					'post_type'    => __( 'Post Type', 'she-header' ),
					'taxonomy'     => __( 'Taxonomy Archive', 'she-header' ),
					'term'         => __( 'Specific Term', 'she-header' ),
					'archive'      => __( 'Any Archive', 'she-header' ),
					'author'       => __( 'Author Archive', 'she-header' ),
					'logged_in'    => __( 'User Logged In', 'she-header' ),
					'logged_out'   => __( 'User Logged Out', 'she-header' ),
					'role'         => __( 'User Role', 'she-header' ),
					'url_contains' => __( 'URL Contains', 'she-header' ),
				),
			)
		);

		$repeater->add_control(
			'she_dc_specific',
			array(
				'label'       => __( 'Select Post / Page', 'she-header' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'default'     => array(),
				'options'     => $this->get_posts_options(),
				'condition'   => array(
					'she_dc_type' => 'specific',
				),
			)
		);

		$repeater->add_control(
			'she_dc_post_type',
			array(
				'label'       => __( 'Post Type', 'she-header' ),
				'type'        => Controls_Manager::SELECT,
				'label_block' => true,
				'default'     => 'post',
				'options'     => $this->get_post_types_options(),
				'condition'   => array(
					'she_dc_type' => 'post_type',
				),
			)
		);

		$repeater->add_control(
			'she_dc_taxonomy',
			array(
				'label'       => __( 'Taxonomy', 'she-header' ),
				'type'        => Controls_Manager::SELECT,
				'label_block' => true,
				'default'     => 'category',
				'options'     => $this->get_taxonomies_options(),
				'condition'   => array(
					'she_dc_type' => 'taxonomy',
				),
			)
		);

		$repeater->add_control(
			'she_dc_term',
			array(
				'label'       => __( 'Select Term(s)', 'she-header' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'default'     => array(),
				'options'     => $this->get_terms_options(),
				'description' => __( 'Matches on the term archive AND on any singular post that has the term assigned.', 'she-header' ),
				'condition'   => array(
					'she_dc_type' => 'term',
				),
			)
		);

		$repeater->add_control(
			'she_dc_role',
			array(
				'label'       => __( 'User Role(s)', 'she-header' ),
				'type'        => Controls_Manager::SELECT2,
				'multiple'    => true,
				'label_block' => true,
				'default'     => array(),
				'options'     => $this->get_roles_options(),
				'description' => __( 'Matches if the current user has any of the selected roles.', 'she-header' ),
				'condition'   => array(
					'she_dc_type' => 'role',
				),
			)
		);

		$repeater->add_control(
			'she_dc_url',
			array(
				'label'       => __( 'URL Contains', 'she-header' ),
				'type'        => Controls_Manager::TEXT,
				'label_block' => true,
				'default'     => '',
				'placeholder' => '/blog/',
				'description' => __( 'Case-insensitive substring of the current URL (including query string).', 'she-header' ),
				'condition'   => array(
					'she_dc_type' => 'url_contains',
				),
			)
		);

		return $repeater->get_controls();
	}

	/**
	 * Build the SELECT2 options list for "Specific Post / Page".
	 *
	 * Capped at 500 entries to keep editor load snappy. Sites with more
	 * content should use the Post Type rule instead — documented in
	 * Sprint 5's in-panel help text.
	 *
	 * @return array<int, string>
	 */
	private function get_posts_options() {
		$options = array();

		$posts = get_posts(
			array(
				'post_type'      => array( 'post', 'page' ),
				'post_status'    => 'publish',
				'posts_per_page' => 500,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'suppress_filters' => true,
			)
		);

		foreach ( $posts as $post ) {
			$options[ $post->ID ] = sprintf(
				/* translators: 1: post type, 2: post title */
				__( '%1$s — %2$s', 'she-header' ),
				ucfirst( $post->post_type ),
				$post->post_title !== '' ? $post->post_title : '(no title)'
			);
		}

		return $options;
	}

	/**
	 * Build the SELECT options list for "Post Type".
	 *
	 * Excludes `attachment` and any non-public post types.
	 *
	 * @return array<string, string>
	 */
	private function get_post_types_options() {
		$options = array();

		$post_types = get_post_types( array( 'public' => true ), 'objects' );
		foreach ( $post_types as $post_type ) {
			if ( in_array( $post_type->name, array( 'attachment' ), true ) ) {
				continue;
			}
			$options[ $post_type->name ] = $post_type->label;
		}

		return $options;
	}

	/**
	 * Build the SELECT options list for "Taxonomy Archive".
	 *
	 * Excludes private and built-in non-public taxonomies (nav_menu,
	 * link_category, post_format).
	 *
	 * @return array<string, string>
	 */
	private function get_taxonomies_options() {
		$options    = array();
		$exclude    = array( 'nav_menu', 'link_category', 'post_format' );
		$taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );

		foreach ( $taxonomies as $tax ) {
			if ( in_array( $tax->name, $exclude, true ) ) {
				continue;
			}
			$options[ $tax->name ] = $tax->label;
		}

		return $options;
	}

	/**
	 * Build the SELECT2 options list for "Specific Term".
	 *
	 * One unified list across all public taxonomies. Values are encoded as
	 * "{taxonomy}:{term_id}" so the resolver can route to the correct
	 * conditional tag without an extra taxonomy field.
	 *
	 * Capped at 500 entries to keep editor load snappy. Sites with more
	 * terms should use the "Taxonomy Archive" rule (all terms in a taxonomy).
	 *
	 * @return array<string, string>
	 */
	private function get_terms_options() {
		$options = array();

		$taxonomy_slugs = array_keys( $this->get_taxonomies_options() );
		if ( empty( $taxonomy_slugs ) ) {
			return $options;
		}

		$terms = get_terms(
			array(
				'taxonomy'   => $taxonomy_slugs,
				'hide_empty' => false,
				'number'     => 500,
				'orderby'    => 'name',
				'order'      => 'ASC',
			)
		);

		if ( is_wp_error( $terms ) || empty( $terms ) ) {
			return $options;
		}

		// Build a taxonomy label lookup for prefixed display labels.
		$tax_labels = array();
		foreach ( get_taxonomies( array( 'public' => true ), 'objects' ) as $tax ) {
			$tax_labels[ $tax->name ] = $tax->labels->singular_name;
		}

		foreach ( $terms as $term ) {
			$key   = $term->taxonomy . ':' . $term->term_id;
			$label = sprintf(
				/* translators: 1: taxonomy label, 2: term name */
				__( '%1$s — %2$s', 'she-header' ),
				isset( $tax_labels[ $term->taxonomy ] ) ? $tax_labels[ $term->taxonomy ] : $term->taxonomy,
				$term->name
			);
			$options[ $key ] = $label;
		}

		return $options;
	}

	/**
	 * Build the SELECT2 options list for "User Role".
	 *
	 * @return array<string, string>
	 */
	private function get_roles_options() {
		$options = array();

		if ( ! function_exists( 'wp_roles' ) ) {
			return $options;
		}

		$roles = wp_roles()->roles;
		if ( ! is_array( $roles ) ) {
			return $options;
		}

		foreach ( $roles as $slug => $role ) {
			$options[ $slug ] = isset( $role['name'] ) ? translate_user_role( $role['name'] ) : $slug;
		}

		return $options;
	}

	/**
	 * Frontend gate: evaluate conditions and flag failed sections.
	 *
	 * On a failed match, tags the wrapper with `data-she-dc-status="fail"`.
	 * A tiny shim JS then strips `she-header-yes` from those sections
	 * before Free's scroll handler picks them up.
	 *
	 * @param \Elementor\Element_Base $element Section or container instance.
	 * @return void
	 */
	public function maybe_disable_sticky( $element ) {

		// Designer always sees the section while building.
		if ( $this->is_editor_or_preview() ) {
			return;
		}

		$settings = $element->get_settings_for_display();

		// Only act on sections where Free's sticky is enabled.
		if ( empty( $settings['transparent'] ) || 'yes' !== $settings['transparent'] ) {
			return;
		}

		// Bail if Display Conditions feature isn't turned on for this section.
		if ( empty( $settings['she_dc_enable'] ) || 'yes' !== $settings['she_dc_enable'] ) {
			return;
		}

		$include = isset( $settings['she_dc_include'] ) ? (array) $settings['she_dc_include'] : array();
		$exclude = isset( $settings['she_dc_exclude'] ) ? (array) $settings['she_dc_exclude'] : array();

		// No rules at all → no-op (preserves default "show everywhere").
		if ( empty( $include ) && empty( $exclude ) ) {
			return;
		}

		$include_passed   = empty( $include ) ? true : Resolver::matches_any( $include );
		$exclude_triggered = ! empty( $exclude ) && Resolver::matches_any( $exclude );

		$should_show = $include_passed && ! $exclude_triggered;

		if ( ! $should_show ) {
			$element->add_render_attribute( '_wrapper', 'data-she-dc-status', 'fail' );
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
	 * Enqueue the frontend shim that strips `she-header-yes` from
	 * sections we've tagged as failed.
	 *
	 * Priority 5 in the action hook to register before Free's default
	 * priority 10 enqueue, so our shim's DOMContentLoaded listener
	 * attaches first.
	 *
	 * @return void
	 */
	public function enqueue_shim() {
		wp_enqueue_script(
			'she-display-condition',
			SHE_HEADER_URL . 'modules/display-condition/assets/js/display-condition.js',
			array(),
			SHE_HEADER_VERSION,
			false // Load in <head> so it parses before footer scripts.
		);
	}

	/**
	 * Hook all the things.
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

		// Evaluate conditions per element before render. Priority 5 to run
		// before any other third-party hooks that may read settings.
		add_action(
			'elementor/frontend/section/before_render',
			array( $this, 'maybe_disable_sticky' ),
			5
		);
		add_action(
			'elementor/frontend/container/before_render',
			array( $this, 'maybe_disable_sticky' ),
			5
		);

		// Frontend shim — priority 5 to register before Free's default 10.
		if ( ! $this->is_editor_or_preview() ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_shim' ), 5 );
		}
	}
}
