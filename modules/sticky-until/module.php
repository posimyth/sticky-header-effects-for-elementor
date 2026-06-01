<?php
/**
 * Sticky Until (Boundary Control) Module.
 *
 * Stops the sticky behavior when a defined boundary is reached:
 *  - End of the section's parent container
 *  - End of the page
 *  - A user-supplied CSS selector (e.g. `#footer`, `.contact-section`)
 *  - A pure scroll distance in pixels from the top of the page
 *
 * An optional numeric offset (px, can be negative) fine-tunes the trigger
 * point relative to the boundary.
 *
 * V1 release behavior:
 *  - When the boundary is reached the sticky header fades out via
 *    `.she-sticky-until-released` class (opacity 0 + pointer-events none).
 *  - Scrolling back up past the boundary re-engages sticky normally.
 *  - This "hide on release" model is intentional for v1: trying to freeze
 *    the header at a fixed Y coordinate would fight Free's per-scroll
 *    inline `top` styling and produce jitter. A future v2 may add a
 *    "Stop at Position" mode that coordinates with Free's scroll handler.
 *
 * Phase 2 ready: `is_active()` filterable via `she_is_pro_feature_active`.
 *
 * @package she-header
 * @since   2.2.0
 */

namespace SheHeader\Modules\StickyUntil;

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
		return 'sticky-until';
	}

	/**
	 * Whether this module should load.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return (bool) apply_filters( 'she_is_pro_feature_active', true, 'sticky-until' );
	}

	/**
	 * Register Sticky Until controls inside Free's existing Sticky Header
	 * Effects panel section.
	 *
	 * @param Controls_Stack $element Elementor section or container.
	 * @return void
	 */
	public function register_controls( Controls_Stack $element ) {

		$element->add_control(
			'she_sticky_until_heading',
			array(
				'label'     => __( 'Sticky Until (Boundary)', 'she-header' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_sticky_until_enable',
			array(
				'label'              => __( 'Enable Sticky Until', 'she-header' ),
				'type'               => Controls_Manager::SWITCHER,
				'label_on'           => __( 'On', 'she-header' ),
				'label_off'          => __( 'Off', 'she-header' ),
				'return_value'       => 'yes',
				'default'            => '',
				'description'        => __( 'Release the sticky behavior when a defined boundary is reached.', 'she-header' ),
				'frontend_available' => true,
				'condition'          => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_sticky_until_mode',
			array(
				'label'              => __( 'Boundary', 'she-header' ),
				'type'               => Controls_Manager::SELECT,
				'default'            => 'container',
				'options'            => array(
					'container'       => __( 'End of Container', 'she-header' ),
					'page'            => __( 'End of Page', 'she-header' ),
					'element'         => __( 'Custom Element', 'she-header' ),
					'scroll-distance' => __( 'Scroll Distance (px)', 'she-header' ),
				),
				'description'        => __( 'End of Container = the parent section/container that wraps this header. Scroll Distance = release after the user has scrolled N pixels from the top.', 'she-header' ),
				'frontend_available' => true,
				'condition'          => array(
					'transparent!'           => '',
					'she_sticky_until_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_sticky_until_element_selector',
			array(
				'label'              => __( 'Element Selector', 'she-header' ),
				'type'               => Controls_Manager::TEXT,
				'placeholder'        => '#footer',
				'default'            => '',
				'description'        => __( 'CSS selector — e.g. <code>#footer</code>, <code>.contact-section</code>. Sticky releases when the top of this element reaches the viewport.', 'she-header' ),
				'frontend_available' => true,
				'condition'          => array(
					'transparent!'             => '',
					'she_sticky_until_enable'  => 'yes',
					'she_sticky_until_mode'    => 'element',
				),
			)
		);

		$element->add_responsive_control(
			'she_sticky_until_distance',
			array(
				'label'              => __( 'Scroll Distance (px)', 'she-header' ),
				'type'               => Controls_Manager::SLIDER,
				'size_units'         => array( 'px' ),
				'range'              => array(
					'px' => array(
						'min'  => 0,
						'max'  => 10000,
						'step' => 10,
					),
				),
				'default'            => array(
					'unit' => 'px',
					'size' => 500,
				),
				'description'        => __( 'Sticky releases once the user has scrolled this many pixels from the top of the page. Combine with Offset to fine-tune.', 'she-header' ),
				'frontend_available' => true,
				'condition'          => array(
					'transparent!'             => '',
					'she_sticky_until_enable'  => 'yes',
					'she_sticky_until_mode'    => 'scroll-distance',
				),
			)
		);

		$element->add_control(
			'she_sticky_until_offset',
			array(
				'label'              => __( 'Offset (px)', 'she-header' ),
				'type'               => Controls_Manager::SLIDER,
				'size_units'         => array( 'px' ),
				'range'              => array(
					'px' => array(
						'min'  => -500,
						'max'  => 500,
						'step' => 1,
					),
				),
				'default'            => array(
					'unit' => 'px',
					'size' => 0,
				),
				'description'        => __( 'Positive value pushes the release point later; negative pulls it earlier.', 'she-header' ),
				'frontend_available' => true,
				'condition'          => array(
					'transparent!'            => '',
					'she_sticky_until_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_sticky_until_notice',
			array(
				'raw'             => __( 'Behavior: the sticky header fades out when the boundary is reached. Scroll back up past the boundary to re-engage.', 'she-header' ),
				'type'            => Controls_Manager::RAW_HTML,
				'content_classes' => 'elementor-descriptor',
				'condition'       => array(
					'transparent!'            => '',
					'she_sticky_until_enable' => 'yes',
				),
			)
		);
	}

	/**
	 * Enqueue the released-state CSS and the scroll watcher script.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		wp_enqueue_style(
			'she-sticky-until',
			SHE_HEADER_URL . 'modules/sticky-until/assets/css/sticky-until.css',
			array(),
			SHE_HEADER_VERSION
		);

		wp_enqueue_script(
			'she-sticky-until',
			SHE_HEADER_URL . 'modules/sticky-until/assets/js/sticky-until.js',
			array(),
			SHE_HEADER_VERSION,
			true
		);
	}

	/**
	 * Hook control registration + asset enqueue.
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

		add_action(
			'elementor/element/section/section_sticky_header_effect/before_section_end',
			array( $this, 'register_controls' )
		);
		add_action(
			'elementor/element/container/section_sticky_header_effect/before_section_end',
			array( $this, 'register_controls' )
		);

		// Frontend only — skip Elementor editor.
		if ( ! Elementor\Plugin::instance()->editor->is_edit_mode() ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		}
	}
}
