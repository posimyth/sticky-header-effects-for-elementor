<?php
/**
 * It is Main File to load all Notice, Upgrade Menu and all
 *
 * @link       https://posimyth.com/
 * @since      2.0
 * */

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Tp_She_Preset' ) ) {

	/**
	 * This class used for Wdesign-kit releted
	 *
	 * @since 2.0
	 */
	class Tp_She_Preset {

		/**
		 * Instance
		 *
		 * @since 2.0
		 * @static
		 * @var instance of the class.
		 */
		private static $instance = null;

		/**
		 * Instance
		 *
		 * @since 2.0
		 * @var w_d_s_i_g_n_k_i_t_slug
		 */
		public $w_d_s_i_g_n_k_i_t_slug = 'wdesignkit/wdesignkit.php';

		/**
		 * Instance
		 *
		 * Ensures only one instance of the class is loaded or can be loaded.
		 *
		 * @since 2.0
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
		 * @since 2.0
		 */
		public function __construct() {

			if ( class_exists( '\Elementor\Plugin' ) ) {
				add_action( 'elementor/editor/before_enqueue_scripts', array( $this, 'she_elementor_editor_script' ) );
				add_action( 'elementor/editor/before_enqueue_scripts', array( $this, 'she_elementor_editor_style' ) );
			}

			add_action( 'wp_ajax_check_plugin_status', array( $this, 'she_check_plugin_status' ) );
			add_action( 'wp_ajax_she_install_wdkit', array( $this, 'she_install_wdkit' ) );

			add_action( 'wp_ajax_she_insert_entry', array( $this, 'she_design_scratch' ) );

			add_action( 'elementor/editor/footer', array( $this, 'she_preview_html_popup' ) );
		}

		/**
		 * Insert Entry Design From Scratch
		 *
		 * @since 2.1.1
		 */
		public function she_design_scratch() {

			check_ajax_referer( 'she_wdkit_preview_popup', 'security' );

			$option_key = 'she_design_from_scratch';

			if ( get_option( $option_key ) ) {
				$response = $this->she_response( 'Already saved.', '', false );
			}

			$updated = add_option( $option_key, true );

			if ( $updated ) {
				$response = $this->she_response( 'Option saved successfully.', '', true );
			} else {
				$response = $this->she_response( 'Failed to save option.', '', false );
			}

			wp_send_json( $response );
		}

		/**
		 * Loded Wdesignkit Template Js
		 *
		 * @since 2.0
		 */
		public function she_elementor_editor_script() {

			wp_enqueue_script( 'she-wdkit-preview-popup', SHE_HEADER_URL . 'assets/js/she-preset-btn.js', array( 'jquery', 'wp-i18n' ), SHE_HEADER_VERSION, true );

			wp_localize_script(
				'she-wdkit-preview-popup',
				'she_wdkit_preview_popup',
				array(
					'nonce'    => wp_create_nonce( 'she_wdkit_preview_popup' ),
					'ajax_url' => admin_url( 'admin-ajax.php' ),
					'tpae_pro' => defined( 'SHE_HEADER_VERSION' ) ? 1 : 0,
					'tpag_pro' => defined( 'TPGBP_VERSION' ) ? 1 : 0,
				)
			);
		}

		/**
		 * Loded Wdesignkit Template CSS
		 *
		 * @since 2.0
		 */
		public function she_elementor_editor_style() {
			wp_enqueue_style( 'she-wdkit-elementor-popup-preset', SHE_HEADER_URL . 'assets/css/she-wdkit-install-popup.css', array(), SHE_HEADER_VERSION );
		}

		/**
		 * WdesignKit Onboarding check
		 *
		 * @since 2.1.1
		 */
		public function she_set_wdkit_onboarding() {

			$wdkit_onbording = get_option( 'wkit_onbording_end', null );

			if ( $wdkit_onbording === null ) {
				add_option( 'wkit_onbording_end', true );
			} else {
				update_option( 'wkit_onbording_end', true );
			}
		}

		/**
		 * Install Wdesign kit
		 *
		 * @since 2.0
		 * @version 2.1.3
		 */
		public function she_install_wdkit() {

			check_ajax_referer( 'she_wdkit_preview_popup', 'security' );

			if ( ! current_user_can( 'install_plugins' ) || ! current_user_can( 'activate_plugins' ) ) {
				$result = $this->she_response(__( 'Permission Denied', 'she-header' ),__( 'You do not have permission to install or activate plugins.', 'she-header' ),false,'permission_error');
	         	wp_send_json( $result );
			}

			$installed_plugins = get_plugins();

			include_once ABSPATH . 'wp-admin/includes/file.php';
			include_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
			include_once ABSPATH . 'wp-admin/includes/class-automatic-upgrader-skin.php';
			include_once ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php';

			$result   = array();
			$response = wp_remote_post(
				'http://api.wordpress.org/plugins/info/1.0/',
				array(
					'body' => array(
						'action'  => 'plugin_information',
						'request' => serialize(
							(object) array(
								'slug'   => 'wdesignkit',
								'fields' => array(
									'version' => false,
								),
							)
						),
					),
				)
			);

			$plugin_info = unserialize( wp_remote_retrieve_body( $response ) );

			if ( ! $plugin_info ) {
				wp_send_json_error( array( 'content' => __( 'Failed to retrieve plugin information.', 'she-header' ) ) );
			}

			$skin     = new \Automatic_Upgrader_Skin();
			$upgrader = new \Plugin_Upgrader( $skin );

			$plugin_basename = $this->w_d_s_i_g_n_k_i_t_slug;

			if ( ! isset( $installed_plugins[ $plugin_basename ] ) && empty( $installed_plugins[ $plugin_basename ] ) ) {

				$installed         = $upgrader->install( $plugin_info->download_link );
				$activation_result = activate_plugin( $plugin_basename );

				$success = null === $activation_result;

				$this->she_set_wdkit_onboarding();

				$result = $this->she_response( 'Success Install WDesignKit', 'Success Install WDesignKit', $success, '' );

			} elseif ( isset( $installed_plugins[ $plugin_basename ] ) ) {

				$activation_result = activate_plugin( $plugin_basename );

				$success = null === $activation_result;

				$this->she_set_wdkit_onboarding();

				$result = $this->she_response( 'Success Install WDesignKit', 'Success Install WDesignKit', $success, '' );

			}

			wp_send_json( $result );
		}

		/**
		 * Check plugin status
		 *
		 * @since 2.0
		 * @return array
		 */
		public function she_check_plugin_status() {

			$installed_plugins = get_plugins();

			$plugin_page_url = add_query_arg( array( 'page' => 'wdesign-kit' ), admin_url( 'admin.php' ) );

			$installed = false;
			if ( is_plugin_active( $this->w_d_s_i_g_n_k_i_t_slug ) && isset( $installed_plugins[ $this->w_d_s_i_g_n_k_i_t_slug ] ) ) {
				$installed = true;
			}

			$return = array(
				'installed'       => $installed,
				'plugin_page_url' => $plugin_page_url,
			);

			wp_send_json( $return );
		}

		/**
		 * It is WDesignKit Popup Design for Download and install
		 *
		 * @since 2.0
		 */
		public function she_preview_html_popup() {

			 $check_circle_svg = '<svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M5 0C2.24311 0 0 2.24311 0 5C0 7.75689 2.24311 10 5 10C7.75689 10 10 7.75689 10 5C10 2.24311 7.75689 0 5 0ZM7.79449 3.68421L4.599 6.85464C4.41103 7.04261 4.11028 7.05514 3.90977 6.86717L2.21804 5.32581C2.01754 5.13784 2.00501 4.82456 2.18045 4.62406C2.36842 4.42356 2.6817 4.41103 2.88221 4.599L4.22306 5.82707L7.0802 2.96992C7.2807 2.76942 7.59398 2.76942 7.79449 2.96992C7.99499 3.17043 7.99499 3.48371 7.79449 3.68421Z"
									fill="#020202" />
								</svg>';
			?>
			<div id="she-wdkit-wrap" class="tp-main-container-preset" style="display: none">

			   <div class="she-popup-header">
					<div class="she-popup-logo">
						<img src="<?php echo SHE_HEADER_URL . 'assets/images/banner/wdkit-treadmark.svg'; ?>" alt="Sticky Header" class="she-popup-logo-img" />
			        </div>
					<div class="she-popup-close">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"><path fill="#808080" fill-opacity=".8" d="M12.293.293a1 1 0 1 1 1.414 1.414L8.414 7l5.293 5.293.068.076a1 1 0 0 1-1.406 1.406l-.076-.068L7 8.414l-5.293 5.293a1 1 0 1 1-1.414-1.414L5.586 7 .293 1.707A1 1 0 1 1 1.707.293L7 5.586 12.293.293Z"/></svg>
					</div>
				</div>
			<div class="she-popup-content">
				<div class="she-middel-sections">
				<div class="she-text-top">
					<?php echo esc_html__( 'Import 50+ Pre-Designed ', 'she-header' ); ?> <br />
					<?php echo esc_html__( 'Sticky Header Templates', 'she-header' ); ?>
				</div>

					<!-- <div class="tp-text-bottom">
						<?php echo esc_html__( 'Uniquely designed Elementor Templates for every website type made with Elementor & The Plus Addons for Elementor Widgets.', 'she-header' ); ?>
					</div> -->
					<div class="she-wkit-cb-data">
						<div class="wkit-she-preset-checkbox">
							<span class="she-preset-checkbox-content">
								<?php echo $check_circle_svg; ?>
								<p class="she-preset-label">
								<?php echo esc_html__( 'Design Quickly without starting from Scratch', 'she-header' ); ?>
							</p>
						</span>
						<span class="she-preset-checkbox-content">
							    <?php echo $check_circle_svg; ?>
								<p class="she-preset-label">
									<?php echo esc_html__( 'Fully Customizable for Any Style', 'she-header' ); ?>
								</p>
							</span>
						</div>
						<div class="wkit-she-preset-checkbox">
							<span class="she-preset-checkbox-content">
								    <?php echo $check_circle_svg; ?>
									<p class="she-preset-label">
									<?php echo esc_html__( 'Time-Saving and Efficient Workflow', 'she-header' ); ?>
								</p>
							</span>
							<span class="she-preset-checkbox-content">
								<?php echo $check_circle_svg; ?>
        						<p class="she-preset-label">
									<?php echo esc_html__( 'Explore Versatile Layout Options', 'she-header' ); ?>
								</p>
							</span>
						</div>
					</div>
					<div class="she-suport-main-wap">
						<div class="she-suport-text">
							<?php echo esc_html__( 'Supports Widgets :', 'she-header' ); ?>
						</div>
						<div class="she-support-icon-main">
							<div class="she-support-icon">
								<div class="she-icon-list">
									<img src="<?php echo SHE_HEADER_URL . 'assets/images/products/tpae-icon.svg'; ?>" alt="Elementor" class="she-support-icon-img" />
									<p><?php echo esc_html__( 'Navigation Menu Widget', 'she-header' ); ?></p>
								</div>
								<div class="she-icon-list">
									<img class="she-elementor" src="<?php echo SHE_HEADER_URL . 'assets/images/products/elementor-icon.svg'; ?>" alt="Elementor" class="she-support-icon-img" />
									<p><?php echo esc_html__( 'WordPress Menu', 'she-header' ); ?></p>
								</div>
								<div class="she-icon-list">
									<img class="she-elementor" src="<?php echo SHE_HEADER_URL . 'assets/images/products/elementor-icon.svg'; ?>" alt="Elementor" class="she-support-icon-img" />
									<p><?php echo esc_html__( 'Nav Menu', 'she-header' ); ?></p>
								</div>
							</div>
						</div>
					</div>
					<div class="wkit-she-preset-enable">
						<div class="she-pink-btn she-wdesign-install">
							<span class="she-enable-text"><?php echo esc_html__( 'Install WDesignKit Plugin for Templates', 'she-header' ); ?></span>
							<div class="she-wkit-publish-loader">
								<div class="she-wb-loader-circle"></div>
								</div>
							</div>
							<div class="she-design-from-scratch">
								<span class="she-scratch-text"><?php echo esc_html__( 'Design from Scratch', 'she-header' ); ?></span>
							</div>
						</div>
					</div>
					<div class="she-image-sections"></div>
				</div>
			</div>
			<?php
		}

		/**
		 * Response
		 *
		 * @param string  $message pass message.
		 * @param string  $description pass message.
		 * @param boolean $success pass message.
		 * @param string  $data pass message.
		 *
		 * @since 2.0
		 */
		public function she_response( $message = '', $description = '', $success = false, $data = '' ) {
			return array(
				'message'     => $message,
				'description' => $description,
				'success'     => $success,
				'data'        => $data,
			);
		}
	}

	Tp_She_Preset::instance();
}
