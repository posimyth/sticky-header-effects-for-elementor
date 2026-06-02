<?php
/**
 * Pro Upsell Module (Free plugin).
 *
 * Injects a branded upgrade banner + a locked list of the 11 Pro features
 * into Free's existing "Sticky Header Effects" panel section. This is a
 * pure upsell — it renders nothing on the frontend and registers no Pro
 * functionality. It only shows users what Pro adds and links to pricing.
 *
 * IMPORTANT: this module's controls are registered ONLY when the Pro plugin
 * is NOT active. When Pro is active, the real Pro controls take over the
 * same panel and this upsell stays hidden (no duplicate / conflicting UI).
 *
 * @package she-header
 * @since   2.2.15
 */

namespace SheHeader\Modules\ProUpsell;

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
	 * Brand colors (Sticky Header Effects).
	 */
	const BRAND_PRIMARY = '#9D1A4F';
	const BRAND_LIGHT   = '#FFF6FA';

	/**
	 * Pricing / upgrade destination.
	 */
	const PRICING_URL = 'https://stickyheadereffects.com/pricing/?utm_source=she-free&utm_medium=elementor-panel&utm_campaign=pro-upsell';

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
		return 'pro-upsell';
	}

	/**
	 * Whether this module should load.
	 *
	 * @return bool
	 */
	public static function is_active() {
		return (bool) apply_filters( 'she_is_pro_feature_active', true, 'pro-upsell' );
	}

	/**
	 * Is the Pro plugin active? If so, the real Pro controls render and we
	 * must NOT show the upsell (avoids duplicate panel UI).
	 *
	 * The Pro main file defines SHE_PRO_VERSION at load time (before
	 * plugins_loaded), so by the time Elementor renders controls this is a
	 * reliable signal.
	 *
	 * @return bool
	 */
	private function is_pro_active() {
		return defined( 'SHE_PRO_VERSION' );
	}

	/**
	 * The 11 Pro features shown as locked rows.
	 *
	 * @return array<int, array{title:string, desc:string}>
	 */
	private function get_pro_features() {
		return array(
			array(
				'title' => __( 'Display Conditions', 'she-header' ),
				'desc'  => __( 'Show or hide on specific pages, posts, roles & more.', 'she-header' ),
			),
			array(
				'title' => __( 'Sticky Until', 'she-header' ),
				'desc'  => __( 'Stop sticking at a container, element or scroll point.', 'she-header' ),
			),
			array(
				'title' => __( 'Reveal Animations', 'she-header' ),
				'desc'  => __( '9 entrance effects when the header becomes sticky.', 'she-header' ),
			),
			array(
				'title' => __( 'Header Replace on Scroll', 'she-header' ),
				'desc'  => __( 'Swap to a different Elementor template on sticky.', 'she-header' ),
			),
			array(
				'title' => __( 'Logo Image Swap', 'she-header' ),
				'desc'  => __( 'Show a different logo (with retina) when sticky.', 'she-header' ),
			),
			array(
				'title' => __( 'Sticky Menu Styling', 'she-header' ),
				'desc'  => __( 'Restyle nav menus on sticky — 5 widget types.', 'she-header' ),
			),
			array(
				'title' => __( 'Backdrop Filter Extended', 'she-header' ),
				'desc'  => __( 'Grayscale, brightness, contrast & hue effects.', 'she-header' ),
			),
			array(
				'title' => __( 'Background Image on Sticky', 'she-header' ),
				'desc'  => __( 'Set a background image for the sticky state.', 'she-header' ),
			),
			array(
				'title' => __( 'Opacity Transition', 'she-header' ),
				'desc'  => __( 'Smooth 0–1 opacity fade on the sticky header.', 'she-header' ),
			),
			array(
				'title' => __( 'Logo Styling on Sticky', 'she-header' ),
				'desc'  => __( 'Frame, border & shadow styling for the logo.', 'she-header' ),
			),
			array(
				'title' => __( 'Multi-Sticky Coordination', 'she-header' ),
				'desc'  => __( 'Stack or sequence up to 5 sticky sections.', 'she-header' ),
			),
		);
	}

	/**
	 * Build the upsell HTML (banner + locked feature list + scoped CSS).
	 *
	 * @return string
	 */
	private function build_upsell_html() {
		$primary = self::BRAND_PRIMARY;
		$light   = self::BRAND_LIGHT;
		$url     = self::PRICING_URL;

		$features = $this->get_pro_features();
		$count    = count( $features );

		// Lock icon (inline SVG, brand-colored).
		$lock = '<svg class="she-pro-up__lock" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M17 10V7a5 5 0 0 0-10 0v3M5 10h14v10H5V10Z" stroke="' . esc_attr( $primary ) . '" stroke-width="2" stroke-linejoin="round"/></svg>';

		$rows = '';
		foreach ( $features as $f ) {
			$rows .= sprintf(
				'<li class="she-pro-up__item">%1$s<span class="she-pro-up__item-text"><strong>%2$s</strong><em>%3$s</em></span></li>',
				$lock,
				esc_html( $f['title'] ),
				esc_html( $f['desc'] )
			);
		}

		$banner_title = __( 'Sticky Header Effects', 'she-header' );
		$banner_sub   = sprintf(
			/* translators: %d is the number of Pro features (11). */
			__( 'Unlock %d powerful Pro features', 'she-header' ),
			$count
		);
		$btn_label = __( 'Upgrade to Pro', 'she-header' );

		$css = '
		<style>
		.she-pro-up{margin:8px 0 4px;font-family:inherit;}
		.she-pro-up__banner{background:linear-gradient(135deg,' . $primary . ' 0%,#c42566 100%);border-radius:8px;padding:14px 14px 13px;text-align:center;color:#fff;box-shadow:0 4px 14px rgba(157,26,79,.28);}
		.she-pro-up__badge{display:inline-block;background:rgba(255,255,255,.18);color:#fff;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 8px;border-radius:20px;margin-bottom:7px;}
		.she-pro-up__title{font-size:13px;font-weight:700;line-height:1.25;margin:0 0 3px;color:#fff;}
		.she-pro-up__sub{font-size:11px;opacity:.92;margin:0 0 11px;color:#fff;}
		.she-pro-up__btn{display:inline-block;background:#fff;color:' . $primary . ' !important;font-size:12px;font-weight:700;text-decoration:none;padding:8px 18px;border-radius:6px;transition:transform .15s ease,box-shadow .15s ease;box-shadow:0 2px 6px rgba(0,0,0,.12);}
		.she-pro-up__btn:hover{transform:translateY(-1px);box-shadow:0 5px 14px rgba(0,0,0,.2);color:' . $primary . ' !important;}
		.she-pro-up__btn span{font-size:13px;}
		.she-pro-up__list{list-style:none;margin:12px 0 0;padding:0;border:1px solid ' . $primary . '22;border-radius:8px;overflow:hidden;background:' . $light . ';}
		.she-pro-up__item{display:flex;align-items:flex-start;gap:8px;padding:8px 11px;border-bottom:1px solid ' . $primary . '1a;}
		.she-pro-up__item:last-child{border-bottom:none;}
		.she-pro-up__lock{flex:0 0 auto;margin-top:2px;}
		.she-pro-up__item-text{display:flex;flex-direction:column;line-height:1.3;}
		.she-pro-up__item-text strong{font-size:11.5px;font-weight:600;color:#2c2c2c;}
		.she-pro-up__item-text em{font-size:10px;font-style:normal;color:#7a7a7a;margin-top:1px;}
		</style>';

		$html = '<div class="she-pro-up">'
			. '<div class="she-pro-up__banner">'
			. '<span class="she-pro-up__badge">PRO</span>'
			. '<div class="she-pro-up__title">' . esc_html( $banner_title ) . '</div>'
			. '<div class="she-pro-up__sub">' . esc_html( $banner_sub ) . '</div>'
			. '<a class="she-pro-up__btn" href="' . esc_url( $url ) . '" target="_blank" rel="noopener noreferrer">'
			. esc_html( $btn_label ) . ' <span>&rarr;</span></a>'
			. '</div>'
			. '<ul class="she-pro-up__list">' . $rows . '</ul>'
			. '</div>'
			. $css;

		return $html;
	}

	/**
	 * Register the upsell controls inside Free's Sticky Header Effects panel.
	 *
	 * @param Controls_Stack $element Elementor section or container.
	 * @return void
	 */
	public function register_controls( Controls_Stack $element ) {
		// Never show the upsell when Pro is active.
		if ( $this->is_pro_active() ) {
			return;
		}

		$element->add_control(
			'she_pro_upsell_heading',
			array(
				'label'     => __( 'Pro Features', 'she-header' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
				// Only show once Free's main "Enable" switcher is on.
				'condition' => array(
					'transparent!' => '',
				),
			)
		);

		$element->add_control(
			'she_pro_upsell_html',
			array(
				'type'        => Controls_Manager::RAW_HTML,
				'raw'         => $this->build_upsell_html(),
				'label_block' => true,
				// Only show once Free's main "Enable" switcher is on.
				'condition'   => array(
					'transparent!' => '',
				),
			)
		);
	}

	/**
	 * Hook everything.
	 *
	 * @return void
	 */
	private function add_actions() {
		// If Pro is active, do not even register the hooks.
		if ( $this->is_pro_active() ) {
			return;
		}

		// Inject into Free's existing Sticky Header Effects panel section,
		// for both Section and Container element types.
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
