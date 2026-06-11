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
	 * Brand colors — matched to the Sticky Header Effects landing page.
	 */
	const BRAND_PRIMARY = '#E6017E'; // magenta accent.
	const BRAND_BRIGHT  = '#FF3DA0'; // gradient highlight.
	const BRAND_PRESS   = '#BE0167'; // pressed/hover.
	const BRAND_LIGHT   = '#FDE7F1'; // light tint background.
	const INK           = '#1C0F16'; // heading ink.
	const INK_MUTED     = '#7C6B74'; // muted ink.

	/**
	 * Pricing / upgrade destination.
	 */
	const PRICING_URL = 'https://stickyheadereffects.com/pricing/?utm_source=she-free&utm_medium=elementor-panel&utm_campaign=pro-upsell';

	/**
	 * User-meta key remembering that the current user permanently dismissed
	 * the "Pro is now live" announcement.
	 */
	const LIVE_NOTICE_META = 'she_pro_live_notice_dismissed';

	/**
	 * AJAX action + nonce name for dismissing the announcement.
	 */
	const LIVE_NOTICE_ACTION = 'she_pro_dismiss_live_notice';

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
	 * Has the current user dismissed the "Pro is now live" announcement?
	 *
	 * Stored per-user so each admin/editor manages their own dismissal.
	 *
	 * @return bool
	 */
	private function is_live_notice_dismissed() {
		return (bool) get_user_meta( get_current_user_id(), self::LIVE_NOTICE_META, true );
	}

	/**
	 * AJAX: persist the per-user dismissal of the announcement.
	 *
	 * @return void
	 */
	public function ajax_dismiss_live_notice() {
		if ( ! check_ajax_referer( self::LIVE_NOTICE_ACTION, 'nonce', false ) ) {
			wp_send_json_error();
		}
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error();
		}
		update_user_meta( get_current_user_id(), self::LIVE_NOTICE_META, 1 );
		wp_send_json_success();
	}

	/**
	 * Inline editor script: handle the announcement's close button — remove
	 * the banner and POST the dismissal so it never shows again.
	 *
	 * @return void
	 */
	public function enqueue_dismiss_script() {
		$config = wp_json_encode(
			array(
				'ajaxurl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( self::LIVE_NOTICE_ACTION ),
				'action'  => self::LIVE_NOTICE_ACTION,
			)
		);

		$js = 'window.SHEProNotice=' . $config . ';'
			. '(function(){document.addEventListener("click",function(e){'
			. 'var b=e.target.closest&&e.target.closest(".she-pro-live__close");if(!b){return;}'
			. 'e.preventDefault();'
			. 'var box=b.closest(".she-pro-live");if(box&&box.parentNode){box.parentNode.removeChild(box);}'
			. 'var d=new FormData();d.append("action",window.SHEProNotice.action);d.append("nonce",window.SHEProNotice.nonce);'
			. 'fetch(window.SHEProNotice.ajaxurl,{method:"POST",credentials:"same-origin",body:d});'
			. '});})();';

		wp_add_inline_script( 'elementor-editor', $js );
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
	 * Build the "Pro is now live" announcement notice.
	 *
	 * A compact, brand-accented banner that sits near the top of the panel
	 * (just under "Import Presets") to announce that the Pro plugin is now
	 * available. Self-contained CSS so it reads natively in light & dark
	 * editor themes and does not depend on the promo card below.
	 *
	 * @return string
	 */
	private function build_live_notice_html() {
		$primary = self::BRAND_PRIMARY;
		$bright  = self::BRAND_BRIGHT;
		$press   = self::BRAND_PRESS;
		$url     = 'https://stickyheadereffects.com/pricing/?utm_source=she-free&utm_medium=elementor-panel&utm_campaign=pro-live';

		$badge_label = __( 'Now Live', 'she-header' );
		$title       = __( 'Sticky Header Effects Pro is here', 'she-header' );
		$text        = __( 'Unlock 11 advanced effects — Display Conditions, Reveal, Multi-Sticky, Header Replace, Logo Swap & more.', 'she-header' );
		$cta_label   = __( 'Get Pro', 'she-header' );

		// Spark / rocket-style badge icon (inline SVG, white on gradient).
		$spark = '<svg width="11" height="11" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M13 2 4.5 13H11l-1 9 8.5-11H12l1-9Z"/></svg>';

		$css = '
		<style>
		.she-pro-live{position:relative;overflow:hidden;border:1px solid var(--e-a-border-color,rgba(230,1,126,.18));border-radius:8px;padding:14px 34px 14px 16px;margin:10px 0 6px;background:rgba(230,1,126,.05);}
		.she-pro-live::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,' . $bright . ',' . $primary . ');}
		.she-pro-live__close{position:absolute;top:8px;right:8px;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;padding:0;border:0;background:transparent;color:var(--e-a-color-txt-muted,#7c6b74);cursor:pointer;border-radius:4px;line-height:0;transition:background .15s ease,color .15s ease;}
		.she-pro-live__close:hover{background:rgba(230,1,126,.12);color:var(--e-a-color-txt,#0c0d0e);}
		.she-pro-live__badge{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(90deg,' . $bright . ',' . $primary . ');color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;padding:3px 9px;border-radius:999px;margin-bottom:10px;}
		.she-pro-live__badge svg{display:block;}
		.she-pro-live__title{display:block;font-size:13.5px;font-weight:700;line-height:1.35;margin:0 0 6px;color:var(--e-a-color-txt,#0c0d0e);}
		.she-pro-live__text{font-size:11.5px;line-height:1.5;margin:0 0 13px;color:var(--e-a-color-txt-muted,#7c6b74);}
		.she-pro-live__btn{display:inline-block;background:' . $primary . ';color:#fff !important;font-size:12px;font-weight:700;text-decoration:none;padding:8px 18px;border-radius:5px;transition:background .15s ease;}
		.she-pro-live__btn:hover{background:' . $press . ';color:#fff !important;}
		</style>';

		$close = '<button type="button" class="she-pro-live__close" aria-label="' . esc_attr__( 'Dismiss', 'she-header' ) . '"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';

		$html = '<div class="she-pro-live">'
			. $close
			. '<span class="she-pro-live__badge">' . $spark . esc_html( $badge_label ) . '</span>'
			. '<strong class="she-pro-live__title">' . esc_html( $title ) . '</strong>'
			. '<p class="she-pro-live__text">' . esc_html( $text ) . '</p>'
			. '<a class="she-pro-live__btn" href="' . esc_url( $url ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( $cta_label ) . '</a>'
			. '</div>'
			. $css;

		return $html;
	}

	/**
	 * Build the upsell HTML (banner + locked feature list + scoped CSS).
	 *
	 * @return string
	 */
	private function build_upsell_html() {
		$primary = self::BRAND_PRIMARY;
		$press   = self::BRAND_PRESS;
		$url     = self::PRICING_URL;
		$compare_url = 'https://stickyheadereffects.com/pricing/?utm_source=she-free&utm_medium=elementor-panel&utm_campaign=compare#compare';

		$count = count( $this->get_pro_features() );

		$badge_label = __( 'Pro Feature', 'she-header' );
		$headline    = __( 'Unlock all Pro features for Sticky Header Effects', 'she-header' );
		$benefits    = array(
			sprintf(
				/* translators: %d is the number of Pro features. */
				__( '%d advanced sticky-header effects', 'she-header' ),
				$count
			),
			__( 'Display Conditions, Reveal & Multi-Sticky', 'she-header' ),
			__( 'Header Replace, Logo Swap & more', 'she-header' ),
		);
		$get_pro_label = __( 'Get Pro', 'she-header' );
		$compare_label = __( 'Compare Free vs Pro', 'she-header' );

		// Gem badge icon + check icon (brand-colored, inline SVG).
		$gem   = '<svg width="11" height="11" viewBox="0 0 24 24" fill="' . esc_attr( $primary ) . '" aria-hidden="true"><path d="M6 2h12l4 7-10 13L2 9l4-7Z"/></svg>';
		$check = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="' . esc_attr( $primary ) . '"/><path d="M7 12.4l3 3 7-7" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

		$list = '';
		foreach ( $benefits as $b ) {
			$list .= '<li class="she-pc__item">' . $check . '<span>' . esc_html( $b ) . '</span></li>';
		}

		// Self-contained card: subtle brand-tint surface + Elementor text vars,
		// so it reads natively in BOTH the light and dark editor themes.
		$css = '
		<style>
		.she-pc{border:1px solid var(--e-a-border-color,rgba(230,1,126,.16));background:rgba(230,1,126,.05);border-radius:8px;padding:16px;margin:8px 0 4px;}
		.she-pc__badge{display:inline-flex;align-items:center;gap:5px;background:rgba(230,1,126,.12);color:' . $primary . ';font-size:10px;font-weight:700;letter-spacing:.2px;padding:4px 10px;border-radius:999px;margin-bottom:12px;}
		.she-pc__badge svg{display:block;}
		.she-pc__title{font-size:14px;font-weight:700;line-height:1.35;margin:0 0 13px;color:var(--e-a-color-txt,#0c0d0e);}
		.she-pc__list{list-style:none;margin:0 0 15px;padding:0;display:flex;flex-direction:column;gap:9px;}
		.she-pc__item{display:flex;align-items:flex-start;gap:8px;font-size:11.5px;line-height:1.45;color:var(--e-a-color-txt,#515962);}
		.she-pc__item svg{flex:0 0 auto;margin-top:1px;}
		.she-pc__actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
		.she-pc__btn{display:inline-block;background:' . $primary . ';color:#fff !important;font-size:12px;font-weight:700;text-decoration:none;padding:9px 18px;border-radius:5px;transition:background .15s ease;}
		.she-pc__btn:hover{background:' . $press . ';color:#fff !important;}
		.she-pc__link{font-size:12px;font-weight:600;color:' . $primary . ' !important;text-decoration:none;white-space:nowrap;}
		.she-pc__link:hover{color:' . $press . ' !important;text-decoration:underline;}
		/* Locked Pro controls: PRO badge on the label, lock icon beside the switcher, fully non-toggleable. */
		.she-pro-locked-ctrl .elementor-control-title::after{content:"PRO";display:inline-block;margin-left:6px;padding:1px 5px;border-radius:3px;background:' . $primary . ';color:#fff;font-size:8px;font-weight:700;letter-spacing:.5px;line-height:1.7;vertical-align:middle;}
		/* Locked toggle: dimmed and non-interactive (no lock icon for now). */
		.she-pro-locked-ctrl .elementor-switch{opacity:.5;}
		/* Clicking anywhere on the row (label text OR switch) must never toggle it. */
		.she-pro-locked-ctrl{cursor:not-allowed;}
		.she-pro-locked-ctrl .elementor-control-content{pointer-events:none;}
			/* Demo / Docs text links beneath each feature description. */
			.she-pro-locked-ctrl .she-pro-desc{display:block;}
			.she-pro-locked-ctrl .she-pro-links{display:flex;align-items:center;gap:7px;margin-top:7px;font-size:11px;}
			.she-pro-locked-ctrl .she-pro-links a{pointer-events:auto;cursor:pointer;font-weight:600;text-decoration:none !important;color:var(--e-a-color-txt,#1d2327) !important;transition:color .15s ease;}
			.she-pro-locked-ctrl .she-pro-links a:hover{color:' . $primary . ' !important;}
			.she-pro-locked-ctrl .she-pro-links__sep{opacity:.4;}
		</style>';

		$html = '<div class="she-pc">'
			. '<span class="she-pc__badge">' . $gem . esc_html( $badge_label ) . '</span>'
			. '<h4 class="she-pc__title">' . esc_html( $headline ) . '</h4>'
			. '<ul class="she-pc__list">' . $list . '</ul>'
			. '<div class="she-pc__actions">'
			. '<a class="she-pc__btn" href="' . esc_url( $url ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( $get_pro_label ) . '</a>'
			. '<a class="she-pc__link" href="' . esc_url( $compare_url ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( $compare_label ) . ' &rsaquo;</a>'
			. '</div>'
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

		// "Pro is now live" announcement — placed near the top of the panel,
		// right after the "Import Presets" button. Shows regardless of the
		// main "Enable" toggle so users discover Pro immediately.
		$element->add_control(
			'she_pro_live_notice',
			array(
				'type'        => Controls_Manager::RAW_HTML,
				'raw'         => $this->build_live_notice_html(),
				'label_block' => true,
			),
			array(
				'position' => array(
					'of' => 'smart-preset-button',
					'at' => 'after',
				),
			)
		);

		// Every Pro feature shown as a NATIVE switcher control with a PRO badge,
		// but LOCKED: the switcher can't be toggled on in Free (CSS disables
		// interaction; see build_upsell_html). Labels match the Pro plugin's
		// feature headings exactly. render_type 'none' so they never affect the
		// frontend.
		// Each feature: label, description, and its own Live Demo + Read Docs URLs.
		// TODO: replace the placeholder demo/docs URLs below with the real ones.
		$pro_features = array(
			'display_condition' => array(
				'label' => __( 'Display Conditions', 'she-header' ),
				'desc'  => __( 'Show or hide the sticky header on specific pages, posts, roles & more.', 'she-header' ),
				'demo'  => 'https://stickyheadereffects.com/demo/display-conditions/',
				'docs'  => 'https://stickyheadereffects.com/docs/display-conditions/',
			),
			'sticky_until'      => array(
				'label' => __( 'Sticky Until', 'she-header' ),
				'desc'  => __( 'Stop sticking at a container, element, or scroll distance.', 'she-header' ),
				'demo'  => 'https://stickyheadereffects.com/demo/sticky-until/',
				'docs'  => 'https://stickyheadereffects.com/docs/sticky-until/',
			),
			'reveal'            => array(
				'label' => __( 'Reveal Animation', 'she-header' ),
				'desc'  => __( '9 entrance effects when the header becomes sticky.', 'she-header' ),
				'demo'  => 'https://stickyheadereffects.com/demo/reveal-animation/',
				'docs'  => 'https://stickyheadereffects.com/docs/reveal-animation/',
			),
			'header_replace'    => array(
				'label' => __( 'Header Replace on Scroll', 'she-header' ),
				'desc'  => __( 'Swap to a different header design when sticky.', 'she-header' ),
				'demo'  => 'https://stickyheadereffects.com/demo/header-replace/',
				'docs'  => 'https://stickyheadereffects.com/docs/header-replace/',
			),
			'logo_swap'         => array(
				'label' => __( 'Logo Image Swap', 'she-header' ),
				'desc'  => __( 'Show a different logo (with retina) when sticky.', 'she-header' ),
				'demo'  => 'https://stickyheadereffects.com/demo/logo-swap/',
				'docs'  => 'https://stickyheadereffects.com/docs/logo-swap/',
			),
			'menu_style'        => array(
				'label' => __( 'Sticky Menu Styling', 'she-header' ),
				'desc'  => __( 'Restyle nav menus on sticky — 5 widget types.', 'she-header' ),
				'demo'  => 'https://stickyheadereffects.com/demo/menu-styling/',
				'docs'  => 'https://stickyheadereffects.com/docs/menu-styling/',
			),
			'backdrop_filter'   => array(
				'label' => __( 'Extended Backdrop Filters', 'she-header' ),
				'desc'  => __( 'Grayscale, brightness, contrast & hue effects.', 'she-header' ),
				'demo'  => 'https://stickyheadereffects.com/demo/backdrop-filter/',
				'docs'  => 'https://stickyheadereffects.com/docs/backdrop-filter/',
			),
			'background_image'  => array(
				'label' => __( 'Background Image on Sticky', 'she-header' ),
				'desc'  => __( 'Set a background image for the sticky state.', 'she-header' ),
				'demo'  => 'https://stickyheadereffects.com/demo/background-image/',
				'docs'  => 'https://stickyheadereffects.com/docs/background-image/',
			),
			'opacity'           => array(
				'label' => __( 'Opacity Transition', 'she-header' ),
				'desc'  => __( 'Smooth 0–1 opacity fade on the sticky header.', 'she-header' ),
				'demo'  => 'https://stickyheadereffects.com/demo/opacity-transition/',
				'docs'  => 'https://stickyheadereffects.com/docs/opacity-transition/',
			),
			'logo_style'        => array(
				'label' => __( 'Logo Styling on Sticky', 'she-header' ),
				'desc'  => __( 'Frame, border & shadow styling for the logo.', 'she-header' ),
				'demo'  => 'https://stickyheadereffects.com/demo/logo-styling/',
				'docs'  => 'https://stickyheadereffects.com/docs/logo-styling/',
			),
			'multi_sticky'      => array(
				'label' => __( 'Multi-Sticky Coordination', 'she-header' ),
				'desc'  => __( 'Stack or sequence up to 5 sticky sections.', 'she-header' ),
				'demo'  => 'https://stickyheadereffects.com/demo/multi-sticky/',
				'docs'  => 'https://stickyheadereffects.com/docs/multi-sticky/',
			),
		);

		$demo_label = __( 'Live Demo', 'she-header' );
		$docs_label = __( 'Read Docs', 'she-header' );

		foreach ( $pro_features as $slug => $feature ) {
			// Demo / Docs text links beneath the description (Elementor renders
			// control descriptions as raw HTML). "Live Demo" uses the theme text
			// color; "Read Docs" uses the brand accent.
			$links = '<span class="she-pro-links">'
				. '<a class="she-link-demo" href="' . esc_url( $feature['demo'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( $demo_label ) . '</a>'
				. '<span class="she-pro-links__sep">|</span>'
				. '<a class="she-link-docs" href="' . esc_url( $feature['docs'] ) . '" target="_blank" rel="noopener noreferrer">' . esc_html( $docs_label ) . '</a>'
				. '</span>';

			$description = '<span class="she-pro-desc">' . esc_html( $feature['desc'] ) . '</span>' . $links;

			$element->add_control(
				'she_pro_lock_' . $slug,
				array(
					'label'        => $feature['label'],
					'description'  => $description,
					'type'         => Controls_Manager::SWITCHER,
					'label_on'     => __( 'On', 'she-header' ),
					'label_off'    => __( 'Off', 'she-header' ),
					'return_value' => 'yes',
					'default'      => '',
					'classes'      => 'she-pro-locked-ctrl',
					'render_type'  => 'none',
					'separator'    => 'before',
					'condition'    => array(
						'transparent!' => '',
					),
				)
			);
		}

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

		// Persist dismissal of the "Pro is now live" announcement.
		add_action( 'wp_ajax_' . self::LIVE_NOTICE_ACTION, array( $this, 'ajax_dismiss_live_notice' ) );

		// Editor-side click handler for the announcement's close button
		// (only needed while the notice can still appear).
		if ( ! $this->is_live_notice_dismissed() ) {
			add_action( 'elementor/editor/after_enqueue_scripts', array( $this, 'enqueue_dismiss_script' ) );
		}
	}
}
