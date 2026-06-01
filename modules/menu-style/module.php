<?php
/**
 * Sticky Menu Styling Module.
 *
 * Overrides nav-menu link color, hover color, active-state color,
 * typography, and item padding only when the header is in its sticky
 * state. Targets the most common menu widgets used in Elementor
 * headers:
 *  - Elementor Pro Nav Menu        (`.elementor-widget-nav-menu`)
 *  - Elementor Mega Menu           (`.elementor-widget-n-menu`)  — v3.18+
 *  - WordPress Menu widget         (`.elementor-widget-wp-menu`)
 *  - TPAE Navigation Menu (Pro)    (`.elementor-widget-tp-navigation-menu`)
 *  - TPAE Navigation Menu Lite     (`.elementor-widget-tp-navigation-menu-lite`)
 *
 * Selectors are kept in class constants so future menu-related modules
 * can share the exact same targeting (and so a single edit propagates).
 *
 * Phase 2 ready: `is_active()` filterable via `she_is_pro_feature_active`.
 *
 * @package she-header
 * @since   2.2.0
 */

namespace SheHeader\Modules\MenuStyle;

use Elementor;
use Elementor\Controls_Manager;
use Elementor\Controls_Stack;
use Elementor\Group_Control_Typography;
use SheHeader\Base\Module_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Module.
 */
class Module extends Module_Base {

	/**
	 * Normal-state link selectors, scoped to sticky.
	 */
	const LINK_SELECTOR = '{{WRAPPER}}.she-header .elementor-widget-nav-menu .elementor-item, {{WRAPPER}}.she-header .elementor-widget-n-menu .e-n-menu-title-text, {{WRAPPER}}.she-header .elementor-widget-wp-menu .menu-item > a, {{WRAPPER}}.she-header .elementor-widget-tp-navigation-menu .menu-item > a, {{WRAPPER}}.she-header .elementor-widget-tp-navigation-menu-lite .menu-item > a';

	/**
	 * Hover-state link selectors, scoped to sticky.
	 */
	const LINK_HOVER_SELECTOR = '{{WRAPPER}}.she-header .elementor-widget-nav-menu .elementor-item:hover, {{WRAPPER}}.she-header .elementor-widget-nav-menu .elementor-item:focus, {{WRAPPER}}.she-header .elementor-widget-n-menu .e-n-menu-item:hover .e-n-menu-title-text, {{WRAPPER}}.she-header .elementor-widget-wp-menu .menu-item > a:hover, {{WRAPPER}}.she-header .elementor-widget-tp-navigation-menu .menu-item > a:hover, {{WRAPPER}}.she-header .elementor-widget-tp-navigation-menu .menu-item > a:focus, {{WRAPPER}}.she-header .elementor-widget-tp-navigation-menu-lite .menu-item > a:hover, {{WRAPPER}}.she-header .elementor-widget-tp-navigation-menu-lite .menu-item > a:focus';

	/**
	 * Active / current-page link selectors, scoped to sticky.
	 */
	const LINK_ACTIVE_SELECTOR = '{{WRAPPER}}.she-header .elementor-widget-nav-menu .elementor-item.elementor-item-active, {{WRAPPER}}.she-header .elementor-widget-n-menu .e-n-menu-item.e-current .e-n-menu-title-text, {{WRAPPER}}.she-header .elementor-widget-wp-menu .current-menu-item > a, {{WRAPPER}}.she-header .elementor-widget-tp-navigation-menu .current-menu-item > a, {{WRAPPER}}.she-header .elementor-widget-tp-navigation-menu-lite .current-menu-item > a';

	/**
	 * Menu-item wrapper selectors (for padding).
	 */
	const ITEM_SELECTOR = '{{WRAPPER}}.she-header .elementor-widget-nav-menu .elementor-item, {{WRAPPER}}.she-header .elementor-widget-n-menu .e-n-menu-item, {{WRAPPER}}.she-header .elementor-widget-wp-menu .menu-item, {{WRAPPER}}.she-header .elementor-widget-tp-navigation-menu .menu-item, {{WRAPPER}}.she-header .elementor-widget-tp-navigation-menu-lite .menu-item';

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
		return 'menu-style';
	}

	/**
	 * Whether this module should load.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return (bool) apply_filters( 'she_is_pro_feature_active', true, 'menu-style' );
	}

	/**
	 * Register Sticky Menu Styling controls inside Free's existing Sticky
	 * Header Effects panel section.
	 *
	 * @param Controls_Stack $element Elementor section or container.
	 * @return void
	 */
	public function register_controls( Controls_Stack $element ) {

		$element->add_control(
			'she_menu_style_heading',
			array(
				'label'     => __( 'Sticky Menu Styling', 'she-header' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_menu_style_enable',
			array(
				'label'        => __( 'Enable Menu Styling', 'she-header' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'On', 'she-header' ),
				'label_off'    => __( 'Off', 'she-header' ),
				'return_value' => 'yes',
				'default'      => '',
				'description'  => __( 'Override nav menu link color, hover, active state, typography and item padding only when sticky.', 'she-header' ),
				'condition'    => array(
					'transparent!' => '',
				),
			)
		);

		// ---------------------------------- Color tabs

		$element->start_controls_tabs(
			'she_menu_style_tabs',
			array(
				'condition' => array(
					'transparent!'          => '',
					'she_menu_style_enable' => 'yes',
				),
			)
		);

		// Normal.
		$element->start_controls_tab(
			'she_menu_style_tab_normal',
			array(
				'label'     => __( 'Normal', 'she-header' ),
				'condition' => array(
					'transparent!'          => '',
					'she_menu_style_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_menu_link_color',
			array(
				'label'     => __( 'Link Color', 'she-header' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					self::LINK_SELECTOR => 'color: {{VALUE}};',
				),
			)
		);

		$element->end_controls_tab();

		// Hover.
		$element->start_controls_tab(
			'she_menu_style_tab_hover',
			array(
				'label'     => __( 'Hover', 'she-header' ),
				'condition' => array(
					'transparent!'          => '',
					'she_menu_style_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_menu_link_hover_color',
			array(
				'label'     => __( 'Link Hover Color', 'she-header' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					self::LINK_HOVER_SELECTOR => 'color: {{VALUE}};',
				),
			)
		);

		$element->end_controls_tab();

		// Active / current.
		$element->start_controls_tab(
			'she_menu_style_tab_active',
			array(
				'label'     => __( 'Active', 'she-header' ),
				'condition' => array(
					'transparent!'          => '',
					'she_menu_style_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_menu_link_active_color',
			array(
				'label'     => __( 'Active / Current Color', 'she-header' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					self::LINK_ACTIVE_SELECTOR => 'color: {{VALUE}};',
				),
			)
		);

		$element->end_controls_tab();

		$element->end_controls_tabs();

		// ---------------------------------- Typography (normal-state link).

		$element->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'      => 'she_menu_typography',
				'label'     => __( 'Typography', 'she-header' ),
				'selector'  => self::LINK_SELECTOR,
				'condition' => array(
					'transparent!'          => '',
					'she_menu_style_enable' => 'yes',
				),
			)
		);

		// ---------------------------------- Item padding.

		$element->add_responsive_control(
			'she_menu_item_padding',
			array(
				'label'      => __( 'Item Padding', 'she-header' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%', 'em', 'rem' ),
				'selectors'  => array(
					self::ITEM_SELECTOR => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
				'condition'  => array(
					'transparent!'          => '',
					'she_menu_style_enable' => 'yes',
				),
			)
		);

		// ---------------------------------- Transition.

		$element->add_control(
			'she_menu_transition',
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
					// Always-on transition so changes ease both into and out of sticky state.
					'{{WRAPPER}} .elementor-widget-nav-menu .elementor-item, {{WRAPPER}} .elementor-widget-n-menu .e-n-menu-title-text, {{WRAPPER}} .elementor-widget-wp-menu .menu-item > a, {{WRAPPER}} .elementor-widget-tp-navigation-menu .menu-item > a, {{WRAPPER}} .elementor-widget-tp-navigation-menu-lite .menu-item > a' => 'transition: color {{SIZE}}{{UNIT}} ease, padding {{SIZE}}{{UNIT}} ease, background-color {{SIZE}}{{UNIT}} ease;',
				),
				'condition'  => array(
					'transparent!'          => '',
					'she_menu_style_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_menu_style_notice',
			array(
				'raw'             => __( 'Supports Elementor Pro Nav Menu, Elementor Mega Menu (n-menu), WordPress Menu widget, and The Plus Addons Navigation Menu (Pro &amp; Lite). Other menu widgets may need custom CSS.', 'she-header' ),
				'type'            => Controls_Manager::RAW_HTML,
				'content_classes' => 'elementor-descriptor',
				'condition'       => array(
					'transparent!'          => '',
					'she_menu_style_enable' => 'yes',
				),
			)
		);
	}

	/**
	 * Hook control registration.
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
