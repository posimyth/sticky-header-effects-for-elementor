<?php
/**
 * This file is used to load widget builder files and the builder.
 *
 * @link https://posimyth.com/
 * @since 2.0
 *
 * @package she-header
 */

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'She_Pluign_Page' ) ) {

	/**
	 * This class used for widget load
	 *
	 * @since 2.0
	 */
	class She_Pluign_Page {

		/**
		 *
		 * Ensures only one instance of the class is loaded or can be loaded.
		 *
		 * @var instance
		 * @since 2.0
		 */
		private static $instance = null;

		/**
		 *
		 * Ensures only one instance of the class is loaded or can be loaded.
		 * 
		 * @var db_key
		 * @since 2.0
		 */
		public $db_key = 'she_rebranding_dismissed';

		/**
		 * This instance is used to load class
		 *
		 * @since 2.0
		 */
		public static function instance() {

			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * This constructor is used to load builder files.
		 *
		 * @since 2.0
		 */
		public function __construct() {
			$she_dismissed = get_option( $this->db_key );
			
			if ( ! $she_dismissed ) {
				add_action( 'after_plugin_row', array( $this, 'she_plugins_page_rebranding_banner' ), 10, 1 );
				add_action( 'wp_ajax_she_dismiss_notice', array( $this, 'she_dismiss_notice' ) );
			}
		}

		/**
		 * Add Menu Page WdKit.
		 *
		 * @version 2.0
		 */
		public function she_plugins_page_rebranding_banner( $plugin_file ) {
			$plugin_file_array = explode( '/', $plugin_file );

			if ( 'sticky-header-effects-for-elementor.php' === end( $plugin_file_array )) {

				echo '<style>
						.she-plugin-update-notice.inline.notice{position:relative;display:flex;flex-direction:row;align-items:center;padding:10px;gap:10px}
						.she-plugin-notice-dismiss{position:absolute;top:0;right:1px;margin:0;padding:9px;border:none;background:none;color:#787c82;cursor:pointer}
						.she-plugin-notice-dismiss:before{content:"\f153";font:normal 18px/22px dashicons;display:block;background:none;color:#787c82;speak:never;height:20px;width:20px;text-align:center;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
					</style>';

				echo '<tr class="she-plugin-rebranding-update">
						<td colspan="4" style="padding: 20px 40px; background: #f0f6fc; border-left: 4px solid #72aee6; box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);">
							<div class="she-plugin-update-notice inline notice notice-alt notice-warning" style="position: relative;>
								<h4 style="margin-top:10px;margin-bottom:7px;font-size:14px;">' . esc_html__( 'This Plugin is now part of POSIMYTH Innovations', 'the-plus-addons-for-block-editor' ) . '</h4>
								<a target="_blank" rel="noopener noreferrer" href="' . esc_url( 'https://stickyheadereffects.com/massive-updates-2-0/?utm_source=wpbackend&utm_medium=pluginpage&utm_campaign=links' ) . '" style="text-decoration:underline;display:inline-block;">' . esc_html__( 'Read Whats New in Sticky Header Effects for Elementor', 'the-plus-addons-for-block-editor' ) . '</a>
								<span class="she-plugin-notice-dismiss"></span>
							</div>
						</td>
				</tr>';

				// Inline JavaScript
				echo '<script type="text/javascript">
					jQuery(document).ready(function($) {
						$(".she-plugin-notice-dismiss").on("click", function(e) {
							e.preventDefault();

							$.ajax({
								url: "' . esc_url( admin_url( 'admin-ajax.php' ) ) . '",
								type: "POST",
								data: {
									action: "she_dismiss_notice",
									nonce: "' . esc_js( wp_create_nonce( 'she_dismiss_nonce' ) ) . '"
								},
								success: function(response) {
									$(".she-plugin-rebranding-update").fadeOut();
								}
							});
						});
					});
					</script>';
			}
		}

		/**
		 * Dismiss the notice.
		 *
		 * @since 2.0
		 */
		public function she_dismiss_notice() {

			if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'she_dismiss_nonce' ) ) {
				$result = array(
					'message' => esc_html__( 'Invalid nonce. Unauthorized request.', 'she-header' ),
					'status'   => false,
				); 

				wp_send_json($result);
			}

			if ( ! current_user_can( 'manage_options' ) ) {
				$result = array(
					'message' => esc_html__( 'You do not have permission to perform this action.', 'she-header' ),
					'status'   => false,
				); 

				wp_send_json($result);
			}

			update_option( $this->db_key, true );

			$result = array( 
				'message' => esc_html__( 'Notice dismissed successfully.', 'she-header' ),
				'status'   => true,
			);

			wp_send_json($result);
		}
	}

	She_Pluign_Page::instance();
}
