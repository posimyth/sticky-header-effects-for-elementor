<?php
/**
 * This file is used to load widget builder files and the builder.
 *
 * @link       https://posimyth.com/
 * @since      1.7.3
 *
 * @package    she-header
 */

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'She_Dashboard_Ajax' ) ) {

	/**
	 * This class used for widget load
	 *
	 * @since 1.7.3
	 */
	class She_Dashboard_Ajax {

		/**
		 *
		 * Ensures only one instance of the class is loaded or can be loaded.
		 *
		 * @var instance
		 * @since 1.7.3
		 */
		private static $instance = null;

		/**
		 * This instance is used to load class
		 *
		 * @since 1.7.3
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
		 * @since 1.7.3
		 */
		public function __construct() {
			add_action( 'wp_ajax_she_dashboard_ajax_call', array( $this, 'she_dashboard_ajax_call' ) );
		}

		/**
		 * Load wdkit page content.
		 *
		 * @since 1.7.3
		 */
		public function she_dashboard_ajax_call() {

			if ( ! check_ajax_referer( 'she-db-nonce', 'nonce', false ) ) {

				$response = $this->tpae_set_response( false, 'Invalid nonce.', 'The security check failed. Please refresh the page and try again.' );

				wp_send_json( $response );
				wp_die();
			}

			if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
				$response = $this->tpae_set_response( false, 'Invalid Permission.', 'Something went wrong.' );

				wp_send_json( $response );
				wp_die();
			}

			$type = isset( $_POST['type'] ) ? strtolower( sanitize_text_field( wp_unslash( $_POST['type'] ) ) ) : false;
			if ( ! $type ) {
				$response = $this->tpae_set_response( false, 'Invalid type.', 'Something went wrong.' );

				wp_send_json( $response );
				wp_die();
			}

			switch ( $type ) {
				case 'shed_onload_data':
					$response = $this->shed_onload_data();
					break;
				case 'she_plugin_install':
					$response = $this->she_plugin_install();
					break;
				default:
					$response = $this->tpae_set_response( false, 'Invalid type.', 'Something went wrong.' );
					break;
			}

			wp_send_json( $response );
			wp_die();
		}

		/**
		 * Set Response
		 *
		 * @since 1.7.3
		 */
		public function shed_onload_data() {

			$plugins = array(
				array(
					'name'        => 'wdesignkit',
					'status'      => '',
					'plugin_slug' => 'wdesignkit/wdesignkit.php',
				),
				array(
					'name'        => 'the-plus-addons-for-block-editor',
					'status'      => '',
					'plugin_slug' => 'the-plus-addons-for-block-editor/the-plus-addons-for-block-editor.php',
				),
				array(
					'name'        => 'uichemy',
					'status'      => '',
					'plugin_slug' => 'uichemy/uichemy.php',
				),
				array(
					'name'        => 'nexter-extension',
					'status'      => '',
					'plugin_slug' => 'nexter-extension/nexter-extension.php',
				),
			);

			$plugin_details = $this->she_check_plugins_depends( $plugins );
			$plugin_details = ! empty( $plugin_details ) ? $plugin_details : $plugins;

			$user       = wp_get_current_user();
			$user_image = get_avatar_url( $user->ID );

			$tpae_pro = 0;

			$user_info = array(
				'user_image' => $user_image,
				'roles'      => $user->roles,
				'user_name'  => $user->display_name,
				'tpae_pro'   => $tpae_pro,
				'success'    => true,
			);

			$response = array(
				'success'     => true,
				'message'     => esc_html__( 'success', 'she-header' ),
				'description' => esc_html__( 'success', 'she-header' ),
				'user_info'   => $user_info,
			);

			return $response;
		}

		/**
		 *
		 * It is Use for Check Plugin Dependency of template.
		 *
		 * @since 1.7.3
		 *
		 * @param array $plugins List of required plugins to check.
		 */
		public function she_check_plugins_depends( $plugins ) {
			$update_plugin = array();

			$all_plugins = get_plugins();

			foreach ( $plugins as $plugin ) {
				$pluginslug = ! empty( $plugin['plugin_slug'] ) ? sanitize_text_field( wp_unslash( $plugin['plugin_slug'] ) ) : '';

				if ( ! is_plugin_active( $pluginslug ) ) {
					if ( ! isset( $all_plugins[ $pluginslug ] ) ) {
							$plugin['status'] = 'unavailable';
					} else {
						$plugin['status'] = 'inactive';
					}

					$update_plugin[] = $plugin;
				} elseif ( is_plugin_active( $pluginslug ) ) {
					$plugin['status'] = 'active';
					$update_plugin[]  = $plugin;
				}
			}

			return $update_plugin;
		}

		/**
		 * Plugin Install
		 *
		 * @since 1.7.3
		 */
		public function she_plugin_install() {

			add_action( 'wp_ajax_she_dashboard_ajax_call', array( $this, 'she_dashboard_ajax_call' ) );

			if ( ! current_user_can( 'install_plugins' ) ) {
				$response = $this->tpae_set_response( false, 'Invalid nonce.', 'The security check failed. Please refresh the page and try again.' );
				return $response;
			}

			$slug = isset( $_POST['slug'] ) ? sanitize_text_field( wp_unslash( $_POST['slug'] ) ) : '';
			$name = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
			if ( ! $slug ) {
				return $this->tpae_set_response( false, 'Slug Not Found.', 'Something went wrong.' );
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
								'slug'   => $name,
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
				wp_send_json_error( array( 'content' => __( 'Failed to retrieve plugin information.', 'tpebl' ) ) );
			}

			$skin     = new \Automatic_Upgrader_Skin();
			$upgrader = new \Plugin_Upgrader( $skin );

			$plugin_basename = $slug;

			if ( ! isset( $installed_plugins[ $plugin_basename ] ) && empty( $installed_plugins[ $plugin_basename ] ) ) {

				$installed         = $upgrader->install( $plugin_info->download_link );
				$activation_result = activate_plugin( $plugin_basename );

				$success = null === $activation_result;
				$result  = $this->tpae_set_response( $success, 'Successfully Install', 'Successfully Install', '' );

			} elseif ( isset( $installed_plugins[ $plugin_basename ] ) ) {

				$activation_result = activate_plugin( $plugin_basename );

				$success = null === $activation_result;
				$result  = $this->tpae_set_response( $success, 'Successfully Activate', 'Successfully Activate', '' );

			}

			return $result;
		}
	}

	She_Dashboard_Ajax::instance();
}
