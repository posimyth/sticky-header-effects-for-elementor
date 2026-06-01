<?php
/**
 * Backdrop Filter (Extended) Module.
 *
 * Extends Free's existing blur + saturate backdrop filter with grayscale,
 * brightness, contrast and hue-rotate. Writes a single comprehensive
 * `backdrop-filter` CSS rule so all functions compose cleanly (CSS does not
 * merge multiple backdrop-filter declarations — last one wins).
 *
 * Strategy:
 * - A master `she_backdrop_pro_enable` switcher renders the full rule and
 *   pulls Free's blur/saturate values via cross-control references.
 * - Individual sliders (grayscale/brightness/contrast/hue) just hold values;
 *   they do not write CSS themselves, avoiding duplicate/conflicting rules.
 * - Default slider values are "no-effect" (0% grayscale, 100% brightness/contrast,
 *   0deg hue) so enabling the switcher without touching sliders matches Free's look.
 *
 * Phase 2 ready: `is_active()` is filterable via `she_is_pro_feature_active`.
 *
 * @package she-header
 * @since   2.2.0
 */

namespace SheHeader\Modules\BackdropFilterPro;

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
		return 'backdrop-filter-pro';
	}

	/**
	 * Whether this module should load.
	 *
	 * Phase 1: always true (inside Free zip).
	 * Phase 2: hook `she_is_pro_feature_active` to license check, or move to Pro plugin.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return (bool) apply_filters( 'she_is_pro_feature_active', true, 'backdrop-filter-pro' );
	}

	/**
	 * Register Backdrop Filter (Extended) controls inside Free's existing
	 * Sticky Header Effects panel section.
	 *
	 * @param Controls_Stack $element Elementor section or container.
	 * @return void
	 */
	public function register_controls( Controls_Stack $element ) {

		$element->add_control(
			'she_backdrop_pro_heading',
			array(
				'label'     => __( 'Extended Backdrop Filters', 'she-header' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => array(
					'transparent!' => '',
					'blur_bg'      => 'yes',
				),
			)
		);

		/**
		 * Master switcher.
		 *
		 * Renders the comprehensive `backdrop-filter` rule that combines
		 * Free's blur + saturate with the Pro grayscale/brightness/contrast/hue.
		 * Sliders below only hold values; they do not write CSS themselves.
		 */
		$element->add_control(
			'she_backdrop_pro_enable',
			array(
				'label'        => __( 'Enable Extended Filters', 'she-header' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'On', 'she-header' ),
				'label_off'    => __( 'Off', 'she-header' ),
				'return_value' => 'yes',
				'default'      => '',
				'description'  => __( 'Adds grayscale, brightness, contrast and hue-rotate on top of Blur + Saturate.', 'she-header' ),
				'selectors'    => array(
					'{{WRAPPER}}.she-header' => 'backdrop-filter: blur({{blur_bg_blur_amount.SIZE}}{{blur_bg_blur_amount.UNIT}}) saturate({{blur_bg_saturate_amount.SIZE}}) grayscale({{she_backdrop_grayscale.SIZE}}%) brightness({{she_backdrop_brightness.SIZE}}%) contrast({{she_backdrop_contrast.SIZE}}%) hue-rotate({{she_backdrop_hue.SIZE}}deg) !important; -webkit-backdrop-filter: blur({{blur_bg_blur_amount.SIZE}}{{blur_bg_blur_amount.UNIT}}) saturate({{blur_bg_saturate_amount.SIZE}}) grayscale({{she_backdrop_grayscale.SIZE}}%) brightness({{she_backdrop_brightness.SIZE}}%) contrast({{she_backdrop_contrast.SIZE}}%) hue-rotate({{she_backdrop_hue.SIZE}}deg) !important;',
				),
				'condition'    => array(
					'transparent!' => '',
					'blur_bg'      => 'yes',
				),
			)
		);

		$element->add_control(
			'she_backdrop_grayscale',
			array(
				'label'      => __( 'Grayscale', 'she-header' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( '%' ),
				'range'      => array(
					'%' => array(
						'min'  => 0,
						'max'  => 100,
						'step' => 1,
					),
				),
				'default'    => array(
					'unit' => '%',
					'size' => 0,
				),
				'condition'  => array(
					'transparent!'            => '',
					'blur_bg'                 => 'yes',
					'she_backdrop_pro_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_backdrop_brightness',
			array(
				'label'       => __( 'Brightness', 'she-header' ),
				'type'        => Controls_Manager::SLIDER,
				'size_units'  => array( '%' ),
				'range'       => array(
					'%' => array(
						'min'  => 0,
						'max'  => 200,
						'step' => 1,
					),
				),
				'default'     => array(
					'unit' => '%',
					'size' => 100,
				),
				'description' => __( '100% = no change', 'she-header' ),
				'condition'   => array(
					'transparent!'            => '',
					'blur_bg'                 => 'yes',
					'she_backdrop_pro_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_backdrop_contrast',
			array(
				'label'       => __( 'Contrast', 'she-header' ),
				'type'        => Controls_Manager::SLIDER,
				'size_units'  => array( '%' ),
				'range'       => array(
					'%' => array(
						'min'  => 0,
						'max'  => 200,
						'step' => 1,
					),
				),
				'default'     => array(
					'unit' => '%',
					'size' => 100,
				),
				'description' => __( '100% = no change', 'she-header' ),
				'condition'   => array(
					'transparent!'            => '',
					'blur_bg'                 => 'yes',
					'she_backdrop_pro_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_backdrop_hue',
			array(
				'label'      => __( 'Hue Rotate', 'she-header' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'deg' ),
				'range'      => array(
					'deg' => array(
						'min'  => 0,
						'max'  => 360,
						'step' => 1,
					),
				),
				'default'    => array(
					'unit' => 'deg',
					'size' => 0,
				),
				'condition'  => array(
					'transparent!'            => '',
					'blur_bg'                 => 'yes',
					'she_backdrop_pro_enable' => 'yes',
				),
			)
		);
	}

	/**
	 * Hook control registration into Elementor's section and container panels.
	 *
	 * Uses `before_section_end` of Free's `section_sticky_header_effect` so
	 * Pro controls appear inside the same UI section users already know.
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
