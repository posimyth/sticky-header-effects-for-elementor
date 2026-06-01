<?php
/**
 * Logo Styling on Sticky Module.
 *
 * Applies frame-level styling (padding, border, border-radius, box-shadow)
 * to logo widgets only when the header is in its sticky state. Per the
 * locked scope this v1 ships "frame styling only" — image filters and size
 * overrides are deferred.
 *
 * Target selectors mirror the Logo Image Swap module so both features
 * affect the same set of logos. The `.not-logo` opt-out class (a Free
 * convention) is honored to exclude decorative images in the same section.
 *
 * Phase 2 ready: `is_active()` filterable via `she_is_pro_feature_active`.
 *
 * @package she-header
 * @since   2.2.0
 */

namespace SheHeader\Modules\LogoStyle;

use Elementor;
use Elementor\Controls_Manager;
use Elementor\Controls_Stack;
use Elementor\Group_Control_Border;
use Elementor\Group_Control_Box_Shadow;
use SheHeader\Base\Module_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Module.
 */
class Module extends Module_Base {

	/**
	 * Selector targeting logo widgets inside the sticky header.
	 *
	 * Kept as a constant so both this module and any future logo-related
	 * modules can share an identical target.
	 */
	const LOGO_SELECTOR = '{{WRAPPER}}.she-header .elementor-widget-theme-site-logo:not(.not-logo), {{WRAPPER}}.she-header .elementor-widget-image:not(.not-logo)';

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
		return 'logo-style';
	}

	/**
	 * Whether this module should load.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return (bool) apply_filters( 'she_is_pro_feature_active', true, 'logo-style' );
	}

	/**
	 * Register Logo Styling controls inside Free's existing Sticky Header
	 * Effects panel section.
	 *
	 * @param Controls_Stack $element Elementor section or container.
	 * @return void
	 */
	public function register_controls( Controls_Stack $element ) {

		$element->add_control(
			'she_logo_style_heading',
			array(
				'label'     => __( 'Logo Styling on Sticky', 'she-header' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_logo_style_enable',
			array(
				'label'        => __( 'Enable Logo Styling', 'she-header' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'On', 'she-header' ),
				'label_off'    => __( 'Off', 'she-header' ),
				'return_value' => 'yes',
				'default'      => '',
				'description'  => __( 'Apply padding, border, radius and shadow to the logo only when sticky.', 'she-header' ),
				'condition'    => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_responsive_control(
			'she_logo_style_padding',
			array(
				'label'      => __( 'Padding', 'she-header' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%', 'em', 'rem' ),
				'selectors'  => array(
					self::LOGO_SELECTOR => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
				'condition'  => array(
					'transparent!'          => '',
					'she_logo_style_enable' => 'yes',
				),
			)
		);

		$element->add_responsive_control(
			'she_logo_style_radius',
			array(
				'label'      => __( 'Border Radius', 'she-header' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%', 'em', 'rem' ),
				'selectors'  => array(
					self::LOGO_SELECTOR => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}; overflow: hidden;',
				),
				'condition'  => array(
					'transparent!'          => '',
					'she_logo_style_enable' => 'yes',
				),
			)
		);

		$element->add_group_control(
			Group_Control_Border::get_type(),
			array(
				'name'      => 'she_logo_style_border',
				'selector'  => self::LOGO_SELECTOR,
				'condition' => array(
					'transparent!'          => '',
					'she_logo_style_enable' => 'yes',
				),
			)
		);

		$element->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			array(
				'name'      => 'she_logo_style_shadow',
				'selector'  => self::LOGO_SELECTOR,
				'condition' => array(
					'transparent!'          => '',
					'she_logo_style_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_logo_style_transition',
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
					'size' => 0.4,
				),
				'selectors'  => array(
					'{{WRAPPER}} .elementor-widget-theme-site-logo:not(.not-logo), {{WRAPPER}} .elementor-widget-image:not(.not-logo)' => 'transition: padding {{SIZE}}{{UNIT}} ease, border-radius {{SIZE}}{{UNIT}} ease, border {{SIZE}}{{UNIT}} ease, box-shadow {{SIZE}}{{UNIT}} ease;',
				),
				'condition'  => array(
					'transparent!'          => '',
					'she_logo_style_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_logo_style_notice',
			array(
				'raw'             => __( 'Styling applies to Site Logo and Image widgets in this section. Add CSS class <code>not-logo</code> to any image you want to exclude.', 'she-header' ),
				'type'            => Controls_Manager::RAW_HTML,
				'content_classes' => 'elementor-descriptor',
				'condition'       => array(
					'transparent!'          => '',
					'she_logo_style_enable' => 'yes',
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

		add_action(
			'elementor/element/section/section_sticky_header_effect/before_section_end',
			array( $this, 'register_controls' )
		);
		add_action(
			'elementor/element/container/section_sticky_header_effect/before_section_end',
			array( $this, 'register_controls' )
		);
	}
}
