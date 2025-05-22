<?php
/**
 * Exit if accessed directly.
 *
 * @link       https://posimyth.com/
 * @since     2.0
 *
 * @package    she-header
 * */

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'She_Plugin_Notice' ) ) {

	/**
	 * This class used for only load widget notice
	 *
	 * @since 2.0
	 */
	class She_Plugin_Notice {

		/**
		 * Instance
		 *
		 * @since 2.0
		 * 
		 * @var instance of the class.
		 */
		private static $instance = null;

		/**
		 *
		 * Ensures only one instance of the class is loaded or can be loaded.
		 * 
		 * @var db_key
		 * @since 2.0
		 */
		public $db_key = 'she_dismissed_notice_plugin';

		/**
		 * Instance
		 *
		 * Ensures only one instance of the class is loaded or can be loaded.
		 *
		 * @since 2.0
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
		 * @since 2.0
		 */
		public function __construct() {
			add_action( 'admin_notices', array( $this, 'she_plugin_banner_notice' ) );
			add_action( 'wp_ajax_wb_dismiss_notice', array( $this, 'she_dismiss_notice' ) );
		}

		/**
		 * New widget demos link notice
		 *
		 * @since 2.0
		 */
		public function she_plugin_banner_notice() {
			$current_screen_id = get_current_screen()->id;

			if ( get_user_meta( get_current_user_id(), $this->db_key, true ) ) {
				return;
			}

			if ( ! in_array( $current_screen_id, array( 'elementor_page_she-header', 'toplevel_page_tpgb_welcome_page', 'theplus-settings_page_theplus_options', 'edit-clients-listout', 'edit-plus-mega-menu', 'edit-nxt_builder', 'appearance_page_nexter_settings_welcome', 'toplevel_page_wdesign-kit', 'toplevel_page_theplus_welcome_page', 'toplevel_page_elementor', 'edit-elementor_library', 'elementor_page_elementor-system-info', 'dashboard', 'update-core', 'plugins' ), true ) ) {
				return false;
			}

			$output  = '';
			$output .= '<div class="notice notice-info is-dismissible she-banner-notice tpae-bf-sale" style="display: flex; padding-top: 25px; padding-bottom: 22px; border-left-color: #9D1A4F; margin-left: 0; justify-content: space-between; align-items: center;">';

				$output .= '<div class="she-notice-side" style="display: flex; align-items: center;">';

					$output .= '<div style="display: flex;align-items: center;">';
						$output .= '<img src="' . esc_url( SHE_HEADER_URL . 'assets/images/banner/she-notice-benner.png' ) . '" alt="Plus Logo" style="width: 100px;display: flex;" />';
					$output .= '</div>';

					$output .= '<div style="display: flex; flex-direction: column; margin-left: 15px; gap: 12px;">';
						$output .= '<h2 style="margin:0;font-weight:bold;color:#1d2327;font-size:1.3em;">' . esc_html__( 'Sticky Header for Elementor Just Got a Major Upgrade!', 'she-header' ) . '</h2>';
						$message = esc_html__( 'Now acquired by POSIMYTH Innovations — with powerful new features and 50+ ready-to-use templates just for you.', 'she-header' );
						$output .= '<p style="margin: 0 0 2px; color: #000000;">' . esc_html( $message ) . '</p>';
					$output .= '</div>';

				$output .= '</div>';

				$output .= '<div style="display: flex; justify-content: center; align-items: center; border: 1px solid #9D1A4F; padding: 5px 20px; height: 30px; border-radius: 4px;cursor: pointer;">';
					$output .= '<a target="_blank" rel="noopener noreferrer" href="https://stickyheadereffects.com/blog/?utm_source=wpbackend&utm_medium=adminpage&utm_campaign=adminpage" style="color: #9D1A4F; font-size: 14px; font-weight: 500;text-decoration:none; width: max-content;">' . esc_html__( 'Learn More', 'she-header' ) . '</a>';
				$output .= '</div>';

			$output .= '</div>';

			$output .= '<script>;
				jQuery(document).ready(function ($) {
					$(".tpae-bf-sale.is-dismissible").on("click", ".notice-dismiss", function () {
						$.ajax({
							type: "POST",
							url: ajaxurl,
							data: {
								action: "wb_dismiss_notice",
							},
						});
					});
				});
			</script>';

			echo $output;
		}

		/**
		 * New widget demos link notice
		 *
		 * @since 2.0
		 */
		public function she_dismiss_notice() {

			if ( ! is_user_logged_in() ) {
				$result = array( 
					'message' => esc_html__( 'Insufficient permissions.', 'she-header' ),
					'status'   => false,
				);

				wp_send_json($result);
			}

			update_user_meta( get_current_user_id(), $this->db_key, 1 );

			$result = array( 
				'message' => esc_html__( 'Success.', 'she-header' ),
				'status'   => true,
			);

			wp_send_json($result);
		}
	}

	She_Plugin_Notice::instance();
}
