<?php
/**
 * Logo Image Swap Module.
 *
 * Swaps the actual <img src> of a logo when the header enters its sticky
 * state. Unlike Free's `change_logo_color` (which applies a CSS filter to
 * the existing image), this loads a separate, purpose-made image for the
 * sticky state — useful for non-monochrome logos, different mark vs.
 * wordmark variants, retina-optimized stickies, etc.
 *
 * Approach:
 * - Controls expose the sticky image (and optional @2x retina) URLs.
 * - Frontend JS uses a MutationObserver on the section's `class` attribute
 *   to detect when Free's JS toggles `.she-header`, then swaps src/srcset.
 *   This is decoupled from Free's scroll handler so we never compete with it.
 * - Original src/srcset are preserved in `data-she-original-*` attributes
 *   and restored when sticky deactivates.
 * - Respects Free's `.not-logo` opt-out convention so decorative images in
 *   the same section are skipped.
 *
 * Phase 2 ready: `is_active()` filterable via `she_is_pro_feature_active`.
 *
 * @package she-header
 * @since   2.2.0
 */

namespace SheHeader\Modules\LogoSwap;

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
		return 'logo-swap';
	}

	/**
	 * Whether this module should load.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return (bool) apply_filters( 'she_is_pro_feature_active', true, 'logo-swap' );
	}

	/**
	 * Register Logo Swap controls inside Free's existing Sticky Header Effects panel.
	 *
	 * @param Controls_Stack $element Elementor section or container.
	 * @return void
	 */
	public function register_controls( Controls_Stack $element ) {

		$element->add_control(
			'she_logo_swap_heading',
			array(
				'label'     => __( 'Logo Image Swap', 'she-header' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_logo_swap_enable',
			array(
				'label'              => __( 'Enable Logo Swap', 'she-header' ),
				'type'               => Controls_Manager::SWITCHER,
				'label_on'           => __( 'On', 'she-header' ),
				'label_off'          => __( 'Off', 'she-header' ),
				'return_value'       => 'yes',
				'default'            => '',
				'description'        => __( 'Replace the logo image with a different one when the header becomes sticky.', 'she-header' ),
				'frontend_available' => true,
				'condition'          => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_logo_swap_image',
			array(
				'label'              => __( 'Sticky Logo Image', 'she-header' ),
				'type'               => Controls_Manager::MEDIA,
				'dynamic'            => array(
					'active' => true,
				),
				'default'            => array(
					'url' => '',
				),
				'frontend_available' => true,
				'condition'          => array(
					'transparent!'         => '',
					'she_logo_swap_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_logo_swap_image_retina',
			array(
				'label'              => __( 'Retina Logo (@2x)', 'she-header' ),
				'type'               => Controls_Manager::MEDIA,
				'dynamic'            => array(
					'active' => true,
				),
				'default'            => array(
					'url' => '',
				),
				'description'        => __( 'Optional. High-resolution version for retina displays.', 'she-header' ),
				'frontend_available' => true,
				'condition'          => array(
					'transparent!'         => '',
					'she_logo_swap_enable' => 'yes',
				),
			)
		);

		$element->add_control(
			'she_logo_swap_notice',
			array(
				'raw'             => __( 'Swap targets Site Logo and Image widgets inside this section. Add the CSS class <code>not-logo</code> to any image you want to exclude.', 'she-header' ),
				'type'            => Controls_Manager::RAW_HTML,
				'content_classes' => 'elementor-descriptor',
				'condition'       => array(
					'transparent!'         => '',
					'she_logo_swap_enable' => 'yes',
				),
			)
		);
	}

	/**
	 * Enqueue the frontend swap script.
	 *
	 * Vanilla JS, no jQuery dep. Reads settings from the section's
	 * `data-settings` attribute (Elementor populates this from
	 * controls flagged `frontend_available: true`).
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_script(
			'she-logo-swap',
			SHE_HEADER_URL . 'modules/logo-swap/assets/js/logo-swap.js',
			array(),
			SHE_HEADER_VERSION,
			true
		);
	}

	/**
	 * Hook control registration + frontend script enqueue.
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

		// Frontend only (skip editor) — mirrors Free's pattern.
		if ( ! Elementor\Plugin::instance()->editor->is_edit_mode() ) {
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		}
	}
}
