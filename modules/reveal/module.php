<?php
/**
 * Reveal / Entrance Animations Module.
 *
 * Adds a CSS keyframe library and per-section controls that animate the
 * header when it enters its sticky state. Effects available: slide
 * (down/up/left/right), fade-in, zoom (in/out), flip (x/y).
 *
 * Approach:
 * - Static CSS file defines `@keyframes she-reveal-*` rules, enqueued once.
 * - When the user enables the feature on a section, Elementor writes an
 *   `animation: she-reveal-<effect> <duration> <easing> <delay> both;`
 *   rule scoped to `{{WRAPPER}}.she-header` — so the animation fires when
 *   Free's scroll handler adds the `.she-header` class.
 * - `animation-fill-mode: both` prevents a flash of the final state.
 * - V1 ships entrance only; exit is "snap back to normal flow" (no reverse
 *   animation) — documented behavior, acceptable UX for v1.
 *
 * Phase 2 ready: `is_active()` filterable via `she_is_pro_feature_active`.
 *
 * @package she-header
 * @since   2.2.0
 */

namespace SheHeader\Modules\Reveal;

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
		return 'reveal';
	}

	/**
	 * Whether this module should load.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return (bool) apply_filters( 'she_is_pro_feature_active', true, 'reveal' );
	}

	/**
	 * Register Reveal Animation controls inside Free's existing Sticky Header
	 * Effects panel section.
	 *
	 * @param Controls_Stack $element Elementor section or container.
	 * @return void
	 */
	public function register_controls( Controls_Stack $element ) {

		$element->add_control(
			'she_reveal_heading',
			array(
				'label'     => __( 'Reveal Animation', 'she-header' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_reveal_enable',
			array(
				'label'        => __( 'Enable Reveal Animation', 'she-header' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'On', 'she-header' ),
				'label_off'    => __( 'Off', 'she-header' ),
				'return_value' => 'yes',
				'default'      => '',
				'description'  => __( 'Animate the header when it enters its sticky state.', 'she-header' ),
				'condition'    => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_reveal_effect',
			array(
				'label'     => __( 'Effect', 'she-header' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'slide-down',
				'options'   => array(
					'slide-down'  => __( 'Slide Down', 'she-header' ),
					'slide-up'    => __( 'Slide Up', 'she-header' ),
					'slide-left'  => __( 'Slide Left', 'she-header' ),
					'slide-right' => __( 'Slide Right', 'she-header' ),
					'fade-in'     => __( 'Fade In', 'she-header' ),
					'zoom-in'     => __( 'Zoom In', 'she-header' ),
					'zoom-out'    => __( 'Zoom Out', 'she-header' ),
					'flip-x'      => __( 'Flip X', 'she-header' ),
					'flip-y'      => __( 'Flip Y', 'she-header' ),
				),
				'condition' => array(
					'transparent!'      => '',
					'she_reveal_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_reveal_duration',
			array(
				'label'      => __( 'Duration', 'she-header' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 's', 'ms' ),
				'range'      => array(
					's'  => array(
						'min'  => 0.1,
						'max'  => 5,
						'step' => 0.1,
					),
					'ms' => array(
						'min'  => 100,
						'max'  => 5000,
						'step' => 50,
					),
				),
				'default'    => array(
					'unit' => 's',
					'size' => 0.5,
				),
				'condition'  => array(
					'transparent!'      => '',
					'she_reveal_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_reveal_easing',
			array(
				'label'     => __( 'Easing', 'she-header' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'ease-out',
				'options'   => array(
					'linear'                            => __( 'Linear', 'she-header' ),
					'ease'                              => __( 'Ease', 'she-header' ),
					'ease-in'                           => __( 'Ease In', 'she-header' ),
					'ease-out'                          => __( 'Ease Out', 'she-header' ),
					'ease-in-out'                       => __( 'Ease In Out', 'she-header' ),
					'cubic-bezier(0.68,-0.55,0.27,1.55)' => __( 'Back', 'she-header' ),
					'cubic-bezier(0.34,1.56,0.64,1)'    => __( 'Bounce', 'she-header' ),
				),
				'condition' => array(
					'transparent!'      => '',
					'she_reveal_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_reveal_delay',
			array(
				'label'      => __( 'Delay', 'she-header' ),
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
					'size' => 0,
				),
				'condition'  => array(
					'transparent!'      => '',
					'she_reveal_enable' => 'yes',
				),
			)
		);

		/**
		 * Master rule: assemble all four animation properties into one
		 * `animation` shorthand. Lives on `she_reveal_enable = yes` so it
		 * renders once per section when the feature is on. Uses cross-control
		 * references to pull effect/duration/easing/delay values.
		 */
		$element->add_control(
			'she_reveal_apply',
			array(
				'type'         => Controls_Manager::HIDDEN,
				'default'      => 'yes',
				'selectors'    => array(
					'{{WRAPPER}}.she-header' => 'animation: she-reveal-{{she_reveal_effect.VALUE}} {{she_reveal_duration.SIZE}}{{she_reveal_duration.UNIT}} {{she_reveal_easing.VALUE}} {{she_reveal_delay.SIZE}}{{she_reveal_delay.UNIT}} both;',
				),
				'condition'    => array(
					'transparent!'      => '',
					'she_reveal_enable' => 'yes',
				),
			)
		);
	}

	/**
	 * Enqueue the keyframe definitions CSS.
	 *
	 * @return void
	 */
	public function enqueue_styles() {
		wp_enqueue_style(
			'she-reveal-animations',
			SHE_HEADER_URL . 'modules/reveal/assets/css/reveal-animations.css',
			array(),
			SHE_HEADER_VERSION
		);
	}

	/**
	 * Hook control registration + CSS enqueue.
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

		// Inject controls into Free's existing panel section (Section + Container).
		add_action(
			'elementor/element/section/section_sticky_header_effect/before_section_end',
			array( $this, 'register_controls' )
		);
		add_action(
			'elementor/element/container/section_sticky_header_effect/before_section_end',
			array( $this, 'register_controls' )
		);

		// Frontend keyframe library.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
	}
}
