<?php
/**
 * Exit if accessed directly.
 *
 * @link       https://posimyth.com/
 * @since     2.1.4
 *
 * @package    she-header
 * */

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'She_Blackfriday_Banner' ) ) {

	/**
	 * This class used for only load widget notice
	 *
	 * @since 2.1.4
	 */
	class She_Blackfriday_Banner {

		/**
		 * Instance
		 *
		 * @since 2.1.4
		 * 
		 * @var instance of the class.
		 */
		private static $instance = null;

		/**
		 * Instance
		 *
		 * Ensures only one instance of the class is loaded or can be loaded.
		 *
		 * @since 2.1.4
		 * @access public
		 * @return instance of the class.
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Constructor
		 *
		 * Perform some compatibility checks to make sure basic requirements are meet.
		 *
		 * @since 2.1.4
		 */
		public function __construct() {

            /** SHe Bf Banner*/
			if ( ! get_option( 'she_smsale_notice_dismissed' ) ) {
				add_action( 'admin_notices', array( $this, 'she_bf_sale_banner' ) );
			}

            add_action( 'wp_ajax_she_bf_dismiss_notice', array( $this, 'she_bf_dismiss_notice' ) );
		}

		/**
		 * Black Friday offer Banner
		 *
		 * @since 2.1.4
		 */
		public function she_bf_sale_banner() {
			$current_screen_id = get_current_screen()->id;

			if ( ! in_array( $current_screen_id, array( 'elementor_page_she-header', 'toplevel_page_tpgb_welcome_page', 'theplus-settings_page_theplus_options', 'edit-clients-listout', 'edit-plus-mega-menu', 'edit-nxt_builder', 'appearance_page_nexter_settings_welcome', 'toplevel_page_wdesign-kit', 'toplevel_page_theplus_welcome_page', 'toplevel_page_elementor', 'edit-elementor_library', 'elementor_page_elementor-system-info', 'dashboard', 'update-core', 'plugins' ), true ) ) {
				return false;
			}

			$output  = '';

			echo '<div class="notice notice-info is-dismissible she-banner-notice she-bf-sale" style="border-left: 4px solid #006ADF;">
				<div class="inline" style="display: flex;column-gap: 12px;align-items: center;padding: 15px 10px;position: relative;    margin-left: 0px;">
					<img style="max-width:100px;max-height:100px;" src="' . esc_url( SHE_HEADER_URL . 'assets/images/banner/she-bs-banner.png' ) . '" />
					<div style="margin: 0 10px; color:#000;display:flex;flex-direction:column;height:90px;justify-content:space-around;/* gap: 10px; */">  
						<div style="font-size:16px;font-weight:600;letter-spacing:0.1px;">' . esc_html__( 'Using our free Sticky Header Effects? Our sister plugins are on their biggest Cyber Monday sale - feel free to explore.', 'she-header' ) . '</div>
						<a href="https://store.posimyth.com/offers/?utm_source=wpbackend&utm_medium=admin&utm_campaign=pluginpage" class="button she-notice-btn" target="_blank" rel="noopener noreferrer" style=" width:max-content;color:#fff;border-color:#DF241B;background:#DF241B;padding:3px 22px;border-radius:5px;font-weight:500;">' . esc_html__( 'View Offers', 'she-header' ) . '</a>
					</div>
				</div>
			</div>';

			echo '<style>.notice.she-banner-notice.she-bf-sale a.button.she-notice-btn:hover{background:#B91D15!important;}</style>';

			echo '<script>;
				jQuery(document).ready(function ($) {
					$(".she-bf-sale.is-dismissible").on("click", ".notice-dismiss", function () {
						$.ajax({
							type: "POST",
							url: ajaxurl,
							data: {
								action: "she_bf_dismiss_notice",
							},
						});
					});
				});
			</script>';
		}

		/**
		 *  It's is use for Save key in database for the SHe Black Friday Banner 
		 *
		 * @since 2.1.4
		 */
		public function she_bf_dismiss_notice() {

			if ( ! is_user_logged_in() ) {
				$result = array( 
					'message' => esc_html__( 'Insufficient permissions.', 'she-header' ),
					'status'   => false,
				);

				wp_send_json($result);
			}

            update_option( 'she_smsale_notice_dismissed', true );

			$result = array( 
				'message' => esc_html__( 'Success.', 'she-header' ),
				'status'   => true,
			);

			wp_send_json($result);
		}
	}

	She_Blackfriday_Banner::instance();
}
