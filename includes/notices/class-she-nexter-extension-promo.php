<?php
/**
 * Exit if accessed directly.
 *
 * @link       https://posimyth.com/
 * @since      2.1.1
 * */

namespace Tp\Notices\TPAGInstallNotice;

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'She_Nexter_Extension_Promo_Notice' ) ) {

	/**
	 * This class used for only elementor widget load
	 *
	 * @since 2.1.1
	 */
	class She_Nexter_Extension_Promo_Notice {

		/**
		 * Instance
		 *
		 * @since 2.1.1
		 * @access private
		 * @static
		 * @var instance of the class.
		 */
		private static $instance = null;

		/**
		 * Instance
		 *
		 * @since 2.1.1
		 * @access public
		 * @var t_p_a_g_slug
		 */
		public $t_p_a_g_slug = 'nexter-extension/nexter-extension.php';

		/**
		 * Instance
		 *
		 * @since 2.1.1
		 * @access public
		 * @var t_p_a_slug
		 */
		public $t_p_a_slug = 'the-plus-addons-for-elementor-page-builder/theplus_elementor_addon.php';


		/**
		 * Instance
		 *
		 * Ensures only one instance of the class is loaded or can be loaded.
		 *
		 * @since 2.1.1
		 * @access public
		 * @static
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
		 * @since 2.1.1
		 */
		public function __construct() {
			add_action( 'admin_notices', array( $this, 'she_nexter_extension_promo' ) );
			add_action( 'wp_ajax_she_nexter_extension_dismiss_promo', array( $this, 'she_nexter_extension_dismiss_promo' ) );
		}

		/**
		 * Plugin Active Theplus Addons for Block Editor Notice Installing Notice show
		 *
		 * @since 2.1.1
		 */
		public function she_nexter_extension_promo() {
			$installed_plugins = get_plugins();

			$file_path      = $this->t_p_a_g_slug;
			$file_path_tpae = $this->t_p_a_slug;
			$screen         = get_current_screen();
			$nonce          = wp_create_nonce( 'she-nexter-extension' );
			$pt_exclude     = ! empty( $screen->post_type ) && in_array( $screen->post_type, array( 'product' ), true );

			$post_type  = isset( $_GET['post_type'] ) ? sanitize_text_field( $_GET['post_type'] ) : '';
			$tabs_group = isset( $_GET['tabs_group'] ) ? sanitize_text_field( $_GET['tabs_group'] ) : '';

			$show_notice = ( 'elementor_library' === $post_type && 'library' === $tabs_group );
			$get_action  = ! empty( $_GET['action'] ) ? sanitize_text_field( wp_unslash( $_GET['action'] ) ) : '';

			$notice_dismissed = get_option( 'she_nexter_extension_notice' );
			if ( ! empty( $notice_dismissed ) ) {
				return;
			}

			if ( ! $show_notice ) {
				return;
			}
			if ( $pt_exclude ) {
				return;
			}

			if ( is_plugin_active( $file_path ) || isset( $installed_plugins[ $file_path ] ) ) {
				return;
			}

			if ( is_plugin_active( $file_path_tpae ) || isset( $installed_plugins[ $file_path_tpae ] ) ) {
				return;
			}

			if ( ! empty( $_GET['action'] ) && 'install-plugin' === $_GET['action'] ) {
				return;
			}

			$install_url = wp_nonce_url(
				self_admin_url( 'update.php?action=install-plugin&plugin=nexter-extension' ),
				'install-plugin_nexter-extension'
			);

			echo '<div class="notice notice-error she-nexter-extension-promo is-dismissible" style="border-left-color: #9d1a4f;">
                    <div class="tp-nexter-werp" style="display: flex; column-gap: 12px; align-items: center; position: relative; margin-left: 0; flex-direction: row-reverse; justify-content: flex-end; padding: 20px 5px 20px 5px;">
                        <div style="margin: 0; color: #000;">
                            <h3 style="margin: 0; font-weight: 600; font-size: 1.030rem; line-height: 1.2; font-family: Roboto, Arial, Helvetica, sans-serif;">' . esc_html__( 'Create Elementor Header, Footer, Single, Archive, 404 etc for FREE!', 'she-header' ) . '</h3>
                            <p style="margin: 0; padding: 0; margin-block-start: 8px; line-height: 1.2;">' . wp_kses_post( sprintf( __( 'Install <a href="https://nexterwp.com/nexter-extension/?utm_source=wpbackend&utm_medium=banner&utm_campaign=links" target="_blank" rel="noopener noreferrer" style="font-weight: 500; text-decoration: underline;">%s</a> from Sticky Header Effects for Elementor to use FREE Theme Builder for Elementor.', 'she-header' ), 'Nexter Extension Plugin' ) ) . '</p>
							<div class="she-nexter-extension-button" style="display: flex; margin-block-start: 1rem;">
                          	  <a href="' . esc_url( $install_url ) . '" class="button" target="_blank" rel="noopener noreferrer" style="margin-right: 10px; background: #9d1a4f; border-color: #9d1a4f; color: rgba(255, 255, 255, 1);">' . esc_html__( 'Enable FREE Theme Builder', 'she-header' ) . '</a>
                            </div>
                        </div>
                    </div>
                </div>';
			?>
			<script>
				setTimeout(() => {
					jQuery(document).on('click', '.she-nexter-extension-promo .notice-dismiss', function(e) {
						e.preventDefault();
						jQuery('.she-nexter-extension-promo').hide();
						jQuery.ajax({
							url: ajaxurl,
							type: 'POST',
							data: {
								action: 'she_nexter_extension_dismiss_promo',
								security: "<?php echo esc_html( $nonce ); ?>",
								type: 'nexter_extension_notice',
							},
							success: function(response) {
								jQuery('.she-nexter-extension-promo').hide();
							}
						});
					});
				}, timeout = 1000);
			</script>
			<?php
		}

		/**
		 * It's is use for Save key in database
		 * Nexter Notice and TAG Popup Dismiss
		 *
		 * @since 2.1.1
		 */
		public function she_nexter_extension_dismiss_promo() {

			if ( ! check_ajax_referer( 'she-nexter-extension', 'security', false ) ) {
				$response = $this->she_set_response( false, 'Invalid nonce.', 'The security check failed. Please refresh the page and try again.' );
			}

			if ( ! current_user_can( 'manage_options' ) ) {
				$response = $this->she_set_response( false, 'You are not allowed to do this action', '', '' );
			}

			update_option( 'she_nexter_extension_notice', true );

			$response = $this->she_set_response( true, 'Success', 'Promo dismissed successfully', '' );
			wp_send_json( $response );
			wp_die();
		}

		/**
		 * Set the response data.
		 *
		 * @since 2.1.1
		 *
		 * @param bool   $success     Indicates whether the operation was successful. Default is false.
		 * @param string $message     The main message to include in the response. Default is an empty string.
		 * @param string $description A more detailed description of the message or error. Default is an empty string.
		 * @param mixed  $data        Optional additional data to include in the response. Default is an empty string.
		 */
		public function she_set_response( $success = false, $message = '', $description = '', $data = '' ) {

			$response = array(
				'success'     => $success,
				'message'     => esc_html( $message ),
				'description' => esc_html( $description ),
				'data'        => $data,
			);

			return $response;
		}
	}

	She_Nexter_Extension_Promo_Notice::instance();
}
