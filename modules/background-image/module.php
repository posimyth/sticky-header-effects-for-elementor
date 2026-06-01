<?php
/**
 * Background Image on Sticky Module.
 *
 * Adds a background image that applies only when the header enters its
 * sticky state. Coexists with Free's existing solid color (overlays on top)
 * but supersedes Free's gradient (both write `background-image`; last rule
 * wins — Pro registers after Free, so Pro's image takes precedence).
 *
 * Phase 2 ready: `is_active()` filterable via `she_is_pro_feature_active`.
 *
 * @package she-header
 * @since   2.2.0
 */

namespace SheHeader\Modules\BackgroundImage;

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
		return 'background-image';
	}

	/**
	 * Whether this module should load.
	 *
	 * Phase 1: always true (inside Free zip).
	 * Phase 2: hook `she_is_pro_feature_active` for license gating, or move to Pro plugin.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return (bool) apply_filters( 'she_is_pro_feature_active', true, 'background-image' );
	}

	/**
	 * Register Background Image controls inside Free's existing Sticky Header Effects panel.
	 *
	 * @param Controls_Stack $element Elementor section or container.
	 * @return void
	 */
	public function register_controls( Controls_Stack $element ) {

		$element->add_control(
			'she_bg_image_heading',
			array(
				'label'     => __( 'Background Image on Sticky', 'she-header' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_bg_image_enable',
			array(
				'label'        => __( 'Enable Background Image', 'she-header' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'On', 'she-header' ),
				'label_off'    => __( 'Off', 'she-header' ),
				'return_value' => 'yes',
				'default'      => '',
				'description'  => __( 'Show a background image only after the header becomes sticky. Note: takes precedence over Free\'s gradient when both are set.', 'she-header' ),
				'condition'    => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_bg_image',
			array(
				'label'      => __( 'Image', 'she-header' ),
				'type'       => Controls_Manager::MEDIA,
				'dynamic'    => array(
					'active' => true,
				),
				'default'    => array(
					'url' => '',
				),
				'selectors'  => array(
					'{{WRAPPER}}.she-header' => 'background-image: url("{{URL}}");',
				),
				'condition'  => array(
					'transparent!'         => '',
					'she_bg_image_enable'  => 'yes',
				),
			)
		);

		$element->add_responsive_control(
			'she_bg_position',
			array(
				'label'     => __( 'Position', 'she-header' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'center center',
				'options'   => array(
					'top left'      => __( 'Top Left', 'she-header' ),
					'top center'    => __( 'Top Center', 'she-header' ),
					'top right'     => __( 'Top Right', 'she-header' ),
					'center left'   => __( 'Center Left', 'she-header' ),
					'center center' => __( 'Center Center', 'she-header' ),
					'center right'  => __( 'Center Right', 'she-header' ),
					'bottom left'   => __( 'Bottom Left', 'she-header' ),
					'bottom center' => __( 'Bottom Center', 'she-header' ),
					'bottom right'  => __( 'Bottom Right', 'she-header' ),
				),
				'selectors' => array(
					'{{WRAPPER}}.she-header' => 'background-position: {{VALUE}};',
				),
				'condition' => array(
					'transparent!'        => '',
					'she_bg_image_enable' => 'yes',
				),
			)
		);

		$element->add_responsive_control(
			'she_bg_size',
			array(
				'label'     => __( 'Size', 'she-header' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'cover',
				'options'   => array(
					'auto'    => __( 'Auto', 'she-header' ),
					'cover'   => __( 'Cover', 'she-header' ),
					'contain' => __( 'Contain', 'she-header' ),
				),
				'selectors' => array(
					'{{WRAPPER}}.she-header' => 'background-size: {{VALUE}};',
				),
				'condition' => array(
					'transparent!'        => '',
					'she_bg_image_enable' => 'yes',
				),
			)
		);

		$element->add_responsive_control(
			'she_bg_repeat',
			array(
				'label'     => __( 'Repeat', 'she-header' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'no-repeat',
				'options'   => array(
					'no-repeat' => __( 'No-repeat', 'she-header' ),
					'repeat'    => __( 'Repeat', 'she-header' ),
					'repeat-x'  => __( 'Repeat-x', 'she-header' ),
					'repeat-y'  => __( 'Repeat-y', 'she-header' ),
				),
				'selectors' => array(
					'{{WRAPPER}}.she-header' => 'background-repeat: {{VALUE}};',
				),
				'condition' => array(
					'transparent!'        => '',
					'she_bg_image_enable' => 'yes',
				),
			)
		);

		$element->add_responsive_control(
			'she_bg_attachment',
			array(
				'label'       => __( 'Attachment', 'she-header' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => 'scroll',
				'options'     => array(
					'scroll' => __( 'Scroll', 'she-header' ),
					'fixed'  => __( 'Fixed', 'she-header' ),
				),
				'description' => __( 'Fixed creates a parallax effect on desktop.', 'she-header' ),
				'selectors'   => array(
					'{{WRAPPER}}.she-header' => 'background-attachment: {{VALUE}};',
				),
				'condition'   => array(
					'transparent!'        => '',
					'she_bg_image_enable' => 'yes',
				),
			)
		);
	}

	/**
	 * Hook control registration into Elementor's section and container panels.
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

		// Section element (legacy Elementor sections).
		add_action(
			'elementor/element/section/section_sticky_header_effect/before_section_end',
			array( $this, 'register_controls' )
		);

		// Container element (Flexbox/Grid containers).
		add_action(
			'elementor/element/container/section_sticky_header_effect/before_section_end',
			array( $this, 'register_controls' )
		);
	}
}
