<?php
/**
 * Header Opacity Transition Module.
 *
 * Smoothly fades the header opacity between normal and sticky states.
 *
 * Phase 2 ready: `is_active()` is filterable via `she_is_pro_feature_active`
 * so this module can be license-gated in-place or lifted into a separate
 * Pro plugin without changes to its own code.
 *
 * @package she-header
 * @since   2.2.0
 */

namespace SheHeader\Modules\Opacity;

use Elementor;
use Elementor\Controls_Manager;
use Elementor\Controls_Stack;
use SheHeader\Base\Module_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Module.
 *
 * Registers Opacity controls inside the existing Sticky Header Effects
 * section ("section_sticky_header_effect") by hooking
 * `elementor/element/{section|container}/section_sticky_header_effect/before_section_end`.
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
		return 'opacity';
	}

	/**
	 * Whether this module should load.
	 *
	 * Phase 1: always true (lives inside Free zip).
	 * Phase 2 Option A: hook `she_is_pro_feature_active` to an EDD license check.
	 * Phase 2 Option B: move this file into the Pro plugin; the filter still works.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return (bool) apply_filters( 'she_is_pro_feature_active', true, 'opacity' );
	}

	/**
	 * Register Opacity controls inside Free's existing Sticky Header Effects section.
	 *
	 * @param Controls_Stack $element Elementor section or container.
	 * @return void
	 */
	public function register_controls( Controls_Stack $element ) {

		$element->add_control(
			'she_opacity_heading',
			array(
				'label'     => __( 'Opacity Transition', 'she-header' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_opacity_enable',
			array(
				'label'        => __( 'Enable Opacity', 'she-header' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'On', 'she-header' ),
				'label_off'    => __( 'Off', 'she-header' ),
				'return_value' => 'yes',
				'default'      => '',
				'description'  => __( 'Smoothly fade the header opacity between normal and sticky states.', 'she-header' ),
				'condition'    => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_responsive_control(
			'she_opacity_before',
			array(
				'label'       => __( 'Opacity Before Sticky', 'she-header' ),
				'type'        => Controls_Manager::SLIDER,
				'range'       => array(
					'px' => array(
						'min'  => 0,
						'max'  => 1,
						'step' => 0.01,
					),
				),
				'default'     => array(
					'size' => 1,
				),
				'description' => __( '0 = fully transparent, 1 = fully opaque.', 'she-header' ),
				'selectors'   => array(
					'{{WRAPPER}}.she-header-yes:not(.she-header)' => 'opacity: {{SIZE}};',
				),
				'condition'   => array(
					'transparent!'       => '',
					'she_opacity_enable' => 'yes',
				),
			)
		);

		$element->add_responsive_control(
			'she_opacity_after',
			array(
				'label'       => __( 'Opacity After Sticky', 'she-header' ),
				'type'        => Controls_Manager::SLIDER,
				'range'       => array(
					'px' => array(
						'min'  => 0,
						'max'  => 1,
						'step' => 0.01,
					),
				),
				'default'     => array(
					'size' => 1,
				),
				'description' => __( '0 = fully transparent, 1 = fully opaque.', 'she-header' ),
				'selectors'   => array(
					'{{WRAPPER}}.she-header-yes.she-header' => 'opacity: {{SIZE}};',
				),
				'condition'   => array(
					'transparent!'       => '',
					'she_opacity_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_opacity_duration',
			array(
				'label'      => __( 'Transition Duration', 'she-header' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 's', 'ms' ),
				'range'      => array(
					's'  => array(
						'min'  => 0,
						'max'  => 5,
						'step' => 0.1,
					),
					'ms' => array(
						'min'  => 0,
						'max'  => 5000,
						'step' => 50,
					),
				),
				'default'    => array(
					'unit' => 's',
					'size' => 0.4,
				),
				'selectors'  => array(
					'{{WRAPPER}}.she-header-yes' => 'transition: opacity {{SIZE}}{{UNIT}} ease, background-color 0.4s ease-in-out;',
				),
				'condition'  => array(
					'transparent!'       => '',
					'she_opacity_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_opacity_easing',
			array(
				'label'     => __( 'Transition Easing', 'she-header' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'ease',
				'options'   => array(
					'linear'      => __( 'Linear', 'she-header' ),
					'ease'        => __( 'Ease', 'she-header' ),
					'ease-in'     => __( 'Ease In', 'she-header' ),
					'ease-out'    => __( 'Ease Out', 'she-header' ),
					'ease-in-out' => __( 'Ease In Out', 'she-header' ),
				),
				'selectors' => array(
					'{{WRAPPER}}.she-header-yes' => 'transition-timing-function: {{VALUE}};',
				),
				'condition' => array(
					'transparent!'       => '',
					'she_opacity_enable' => 'yes',
				),
			)
		);
	}

	/**
	 * Hook control registration into Elementor's section and container panels.
	 *
	 * Uses the `before_section_end` hook of Free's `section_sticky_header_effect`
	 * so our controls appear inside the same panel section users already know.
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
