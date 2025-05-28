<?php
/**
 * This file is used to load widget builder files and the builder.
 *
 * @link       https://posimyth.com/
 * @since      2.0
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
	 * @since 2.0
	 */
	class She_Dashboard_Ajax {

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
		 * Get User Data.
		 *
		 * @var instance
		 * @since 2.0
		 */
		public $onbording_api = 'https://api.posimyth.com/wp-json/she/v2/she_store_user_data';
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
			add_action( 'wp_ajax_she_dashboard_ajax_call', array( $this, 'she_dashboard_ajax_call' ) );
		}

		/**
		 * Load wdkit page content.
		 *
		 * @since 2.0
		 */
		public function she_dashboard_ajax_call() {

			if ( ! check_ajax_referer( 'she-db-nonce', 'nonce', false ) ) {

				$response = $this->she_set_response( false, 'Invalid nonce.', 'The security check failed. Please refresh the page and try again.' );

				wp_send_json( $response );
				wp_die();
			}

			if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
				$response = $this->she_set_response( false, 'Invalid Permission.', 'Something went wrong.' );

				wp_send_json( $response );
				wp_die();
			}

			$type = isset( $_POST['type'] ) ? strtolower( sanitize_text_field( wp_unslash( $_POST['type'] ) ) ) : false;
			if ( ! $type ) {
				$response = $this->she_set_response( false, 'Invalid type.', 'Something went wrong.' );

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
				case 'she_theme_install':
					$response = $this->she_theme_install();
					break;
				case 'she_activate_theme':
					$response = $this->she_activate_theme();
					break;
				case 'she_prev_version':
					$response = $this->she_prev_version();
					break;
				case 'she_rollback_check':
					$response = $this->she_rollback_check();
					break;
				case 'she_api_call':
					$response = $this->she_api_call();
					break;
				case 'she_create_page':
					$response = $this->she_create_page();
					break;
				case 'she_onboarding_setup':
					$response = $this->she_onboarding_setup();
					break;
				case 'she_user_meta_data':
					$response = $this->she_user_meta_data();
					break;
				default:
					$response = $this->she_set_response( false, 'Invalid type.', 'Something went wrong.' );
					break;
			}

			wp_send_json( $response );
			wp_die();
		}

		/**
		 * Set Response
		 *
		 * @since 2.0
		 */
		public function shed_onload_data() {

			$plugins = array(
				array(
					'name'        => 'the-plus-addons-for-elementor-page-builder',
					'status'      => '',
					'plugin_slug' => 'the-plus-addons-for-elementor-page-builder/theplus_elementor_addon.php',
				),
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
				array(
					'name'        => 'elementor-pro',
					'status'      => '',
					'plugin_slug' => 'elementor-pro/elementor-pro.php',
				),
			);

			$plugin_details = $this->she_check_plugins_depends( $plugins );
			$plugin_details = ! empty( $plugin_details ) ? $plugin_details : $plugins;

			$theme_details = $this->she_check_theme_depends( 'nexter' );

			$user       = wp_get_current_user();
			$user_image = get_avatar_url( $user->ID );

			$tpae_pro = 0;

			$check_onboarding = get_option( 'she_onboarding_setup' );

			$set_onboarding['check_onboarding'] = 'show';
			if ( $check_onboarding ) {
				$set_onboarding['check_onboarding'] = 'hide';
			}

			$user_info = array(
				'user_image'        => $user_image,
				'roles'             => $user->roles,
				'user_name'         => $user->display_name,
				'user_email'        => $user->user_email,
				'she_notificetions' => 'open',
				'success'           => true,
			);

			$response = array(
				'success'          => true,
				'message'          => esc_html__( 'success', 'she-header' ),
				'description'      => esc_html__( 'success', 'she-header' ),
				'user_info'        => $user_info,
				'plugin_detail'    => $plugin_details,
				'theme_detail'     => $theme_details,
				'check_onboarding' => $set_onboarding,
			);

			return $response;
		}

		/**
		 *
		 * It is Use for Check Plugin Dependency of template.
		 *
		 * @since 2.0
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
		 *
		 * It is Use for Check Theme Dependency of template.
		 *
		 * @since 2.0
		 *
		 * @param array $theme_slug List of required theme to check.
		 */
		public function she_check_theme_depends( $theme_slug ) {

			$theme = wp_get_theme( $theme_slug );

			if ( ! $theme->exists() ) {
				return array(
					'name'   => $theme_slug,
					'status' => 'unavailable',
				);
			}

			$current_theme = wp_get_theme();

			if ( $theme_slug === $current_theme->get_stylesheet() ) {
				return array(
					'name'   => $theme_slug,
					'status' => 'active',
				);
			} else {
				return array(
					'name'   => $theme_slug,
					'status' => 'inactive',
				);
			}
		}

		/**
		 *
		 * It is Use for Active Theme of template.
		 *
		 * @since 2.0
		 *
		 * @param array $plugins List of required plugins to check.
		 */
		public function she_activate_theme() {

			$theme_slug = isset( $_POST['theme_slug'] ) ? sanitize_text_field( wp_unslash( $_POST['theme_slug'] ) ) : '';

			$active_theme = wp_get_theme();
			$theme_name   = $active_theme->get( 'Name' );

			if ( file_exists( WP_CONTENT_DIR . '/themes/' . $theme_slug ) && 'Nexter' !== $theme_name ) {

				switch_theme( $theme_slug );
				return array(
					'name'   => $theme_slug,
					'status' => 'Activated',
				);
			}
		}

		/**
		 * Get Plugin Previous Versions
		 *
		 * @since 2.0
		 */
		public function she_prev_version() {

			$versions_list = get_transient( 'she_rollback_version_' . SHE_HEADER_VERSION );

			if ( $versions_list === false ) {

				require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

				$plugin_info = plugins_api(
					'plugin_information',
					array(
						'slug' => 'sticky-header-effects-for-elementor',
					)
				);

				if ( empty( $plugin_info->versions ) || ! is_array( $plugin_info->versions ) ) {
					return array();
				}

				krsort( $plugin_info->versions );

				$versions_list = array();

				$index = 0;
				foreach ( $plugin_info->versions as $version => $download_link ) {
					if ( 25 <= $index ) {
						break;
					}

					$lowercase_version      = strtolower( $version );
					$check_rollback_version = ! preg_match( '/(beta|rc|trunk|dev)/i', $lowercase_version );

					$check_rollback_version = apply_filters( 'she_check_rollback_version', $check_rollback_version, $lowercase_version );

					if ( ! $check_rollback_version ) {
						continue;
					}

					if ( version_compare( $version, SHE_HEADER_VERSION, '>=' ) ) {
						continue;
					}

					++$index;
					$versions_list[] = $version;
				}

				set_transient( 'she_rollback_version_' . SHE_HEADER_VERSION, $versions_list, WEEK_IN_SECONDS );
			}

			return $versions_list;
		}

		/**
		 * Rollback to Previous Versions
		 *
		 * @since 2.0
		 */
		public function she_rollback_check() {

			$current_ver = isset( $_POST['version'] ) ? sanitize_text_field( wp_unslash( $_POST['version'] ) ) : '';

			$rv = $this->she_prev_version();
			if ( empty( $current_ver ) || ! in_array( $current_ver, $rv ) ) {
				return $this->she_set_response( false, 'Invalid nonce.', 'Try selecting another version.' );
			}

			$plugin_slug = basename( SHE_HEADER_PLUGIN_BASE, '.php' );

			$this_version    = $current_ver;
			$this_pluginname = SHE_HEADER_PLUGIN_BASE;
			$this_pluginslug = $plugin_slug;
			$this_plugin_url = sprintf( 'https://downloads.wordpress.org/plugin/%s.%s.zip', $this_pluginslug, $this_version );

			$plugin_info = array(
				'plugin_name' => $this_pluginname,
				'plugin_slug' => $this_pluginslug,
				'version'     => $this_version,
				'package_url' => $this_plugin_url,
			);

			$update_plugins_data = get_site_transient( 'update_plugins' );

			if ( ! is_object( $update_plugins_data ) ) {
				$update_plugins_data = new \stdClass();
			}

			$plugin_info              = new \stdClass();
			$plugin_info->new_version = $this_version;
			$plugin_info->slug        = $this_pluginslug;
			$plugin_info->package     = $this_plugin_url;
			$plugin_info->url         = 'https://stickyheadereffects.com/';

			$update_plugins_data->response[ $this_pluginname ] = $plugin_info;

			set_site_transient( 'update_plugins', $update_plugins_data );

			require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

			$logo_url = SHE_HEADER_URL . 'assets/images/theplus-logo-small.png';

			$args = array(
				'url'    => 'update.php?action=upgrade-plugin&plugin=' . rawurlencode( $this_pluginname ),
				'plugin' => $this_pluginname,
				'nonce'  => 'upgrade-plugin_' . $this_pluginname,
				'title'  => '<img src="' . esc_url( $logo_url ) . '" alt="theplus-logo"><div class="theplus-rb-subtitle">' . esc_html__( 'Rollback to Previous Version', 'she-header' ) . '</div>',
			);

			$upgrader_plugin = new \Plugin_Upgrader( new \Plugin_Upgrader_Skin( $args ) );
			$upgrader_plugin->upgrade( $this_pluginname );

			$activation_result = activate_plugin( $this_pluginname );

			return $this->she_set_response( true, 'Roll Back Successfully', 'Roll Back Successfully Done.' );
		}

		/**
		 * Plugin Install
		 *
		 * @since 2.0
		 */
		public function she_plugin_install() {

			add_action( 'wp_ajax_she_dashboard_ajax_call', array( $this, 'she_dashboard_ajax_call' ) );

			if ( ! current_user_can( 'install_plugins' ) ) {
				$response = $this->she_set_response( false, 'Invalid nonce.', 'The security check failed. Please refresh the page and try again.' );
				return $response;
			}

			$slug = isset( $_POST['slug'] ) ? sanitize_text_field( wp_unslash( $_POST['slug'] ) ) : '';
			$name = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
			if ( ! $slug ) {
				return $this->she_set_response( false, 'Slug Not Found.', 'Something went wrong.' );
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
				wp_send_json_error( array( 'content' => __( 'Failed to retrieve plugin information.', 'she-header' ) ) );
			}

			$skin     = new \Automatic_Upgrader_Skin();
			$upgrader = new \Plugin_Upgrader( $skin );

			$plugin_basename = $slug;

			if ( ! isset( $installed_plugins[ $plugin_basename ] ) && empty( $installed_plugins[ $plugin_basename ] ) ) {

				$installed         = $upgrader->install( $plugin_info->download_link );
				$activation_result = activate_plugin( $plugin_basename );

				$success = null === $activation_result;
				$result  = $this->she_set_response( $success, 'Successfully Install', 'Successfully Install', '' );

			} elseif ( isset( $installed_plugins[ $plugin_basename ] ) ) {

				$activation_result = activate_plugin( $plugin_basename );

				$success = null === $activation_result;
				$result  = $this->she_set_response( $success, 'Successfully Activate', 'Successfully Activate', '' );

			}

			return $result;
		}

		/**
		 * Theme Install
		 *
		 * @since 2.0
		 */
		public function she_theme_install() {

			if ( ! current_user_can( 'install_themes' ) ) {
				$response = $this->she_set_response( false, 'Invalid nonce.', 'The security check failed. Please refresh the page and try again.' );
				return $response;
			}

			$name = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';

			$theme_slug    = $name;
			$theme_api_url = 'https://api.wordpress.org/themes/info/1.0/';

			// Parameters for the request
			$args = array(
				'body' => array(
					'action'  => 'theme_information',
					'request' => serialize(
						(object) array(
							'slug'   => $name,
							'fields' => array(
								'description'     => false,
								'sections'        => false,
								'rating'          => true,
								'ratings'         => false,
								'downloaded'      => true,
								'download_link'   => true,
								'last_updated'    => true,
								'homepage'        => true,
								'tags'            => true,
								'template'        => true,
								'active_installs' => false,
								'parent'          => false,
								'versions'        => false,
								'screenshot_url'  => true,
							),
						)
					),
				),
			);

			// Make the request
			$response = wp_remote_post( $theme_api_url, $args );
			// Check for errors
			if ( is_wp_error( $response ) ) {
				$error_message = $response->get_error_message();

				$result = $this->she_set_response( false, 'oops', 'oops', '' );
			} else {
				$theme_info    = unserialize( $response['body'] );
				$theme_name    = $theme_info->name;
				$theme_zip_url = $theme_info->download_link;

				global $wp_filesystem;
				// Install the theme
				$theme = wp_remote_get( $theme_zip_url );

				if ( ! function_exists( 'WP_Filesystem' ) ) {
					require_once wp_normalize_path( ABSPATH . '/wp-admin/includes/file.php' );
				}

				WP_Filesystem();

				$active_theme = wp_get_theme();
				$theme_name   = $active_theme->get( 'Name' );

				$wp_filesystem->put_contents( WP_CONTENT_DIR . '/themes/' . $theme_slug . '.zip', $theme['body'] );
				$zip = new ZipArchive();
				if ( $zip->open( WP_CONTENT_DIR . '/themes/' . $theme_slug . '.zip' ) === true ) {
					$zip->extractTo( WP_CONTENT_DIR . '/themes/' );
					$zip->close();
				}

				$wp_filesystem->delete( WP_CONTENT_DIR . '/themes/' . $theme_slug . '.zip' );

				$result = $this->she_set_response( true, "Success $name", "Success $name", '' );
			}

			return $result;
		}

		/**
		 * API call and get Response
		 *
		 * @since 2.0
		 */
		public function she_api_call() {

			$method  = isset( $_POST['method'] ) ? sanitize_text_field( wp_unslash( $_POST['method'] ) ) : 'POST';
			$api_url = isset( $_POST['api_url'] ) ? sanitize_text_field( wp_unslash( $_POST['api_url'] ) ) : '';
			$body    = isset( $_POST['url_body'] ) ? json_decode( wp_unslash( $_POST['url_body'] ) ) : array();

			$header_template = isset( $_POST['store'] ) ? sanitize_text_field( wp_unslash( $_POST['store'] ) ) : '';

			if ( 'header_template' === $header_template ) {
				$she_header_template = get_transient( 'she_header_template' );

				if ( $she_header_template != false ) {
					return get_option( 'she_header_template' );
				}

				delete_option( 'she_header_template' );
				delete_transient( 'she_header_template' );
			}

			$args = array(
				'method'  => $method,
				'headers' => array(
					'Content-Type' => 'application/json',
				),
			);

			if ( ! empty( $body ) ) {
				$args['body'] = wp_json_encode( $body );
			}

			if ( 'POST' === $method ) {
				$response = wp_remote_post( $api_url, $args );
			}

			if ( 'GET' === $method ) {
				$response = wp_remote_get( $api_url, $args );
			}

			$status_code = wp_remote_retrieve_response_code( $response );
			$getdataone  = wp_remote_retrieve_body( $response );
			$statuscode  = array( 'HTTP_CODE' => $status_code );

			$response = json_decode( $getdataone, true );

			if ( is_array( $statuscode ) && is_array( $response ) ) {
				$final = array_merge( $statuscode, $response );

				if ( 200 == $status_code ) {
					if ( 'header_template' === $header_template ) {
						add_option( 'she_header_template', $final );
						set_transient( 'she_header_template', 'header_template', 24 * HOUR_IN_SECONDS );
						// set_transient('she_header_template', 'header_template', 120);
					}
				}
			}

			return $final;
		}


		/**
		 * Create Page for Header
		 * 
		 * @since 2.0
		 */
		public function she_create_page() {
			$post_type = isset( $_POST['post_type'] ) ? sanitize_text_field( $_POST['post_type'] ) : 'elementor_library';

			$post_args = array(
				'post_type'   => $post_type,
				'post_title'  => 'sticky-header',
				'post_status' => 'draft',
			);

			$post_id = wp_insert_post( $post_args );

			if ( $post_type === 'nxt_builder' ) {
				if ( $post_id && ! is_wp_error( $post_id ) ) {
					update_post_meta( $post_id, 'template_type', 'header' );
					update_post_meta( $post_id, 'nxt-hooks-layout-sections', 'header' );
				}
			} elseif ( $post_type === 'elementor_library' ) {
				if ( $post_id && ! is_wp_error( $post_id ) ) {
					update_post_meta( $post_id, '_elementor_template_type', 'header' );
				}
			}

			// $elementor_edit_url = admin_url( 'post.php?post=' . $post_id . '&action=elementor' );
			$elementor_edit_url = admin_url( 'post.php?post=' . $post_id . '&action=elementor&she_onload=true' );

			return $this->she_set_response(
				true,
				'Page created successfully',
				'',
				array(
					'post_id'  => $post_id,
					'edit_url' => $elementor_edit_url,
				)
			);
		}

		/**
		 * Onboarding Setup
		 *
		 * @since 2.0
		 */
		public function she_onboarding_setup() {

			$onboarding = get_option( 'she_onboarding_setup' );

			if ( ! $onboarding ) {
				update_option( 'she_onboarding_setup', 'hide' );
			}

			$onboarding = get_option( 'she_onboarding_setup' );
			if ( $onboarding ) {
				$response = $this->she_set_response( true, 'Onboarding Setup', 'Onboarding Setup', '' );
			} else {
				$response = $this->she_set_response( false, 'Onboarding Setup Failed', 'Onboarding Setup Failed', '' );
			}

			$get_notification = get_option( 'she_menu_notificetions' );

			if ( $get_notification !== SHE_MENU_NOTIFICETIONS ) {
				update_option( 'she_menu_notificetions', SHE_MENU_NOTIFICETIONS );
			}

			return $response;
		}


		/**
		 * User Meta Data
		 *
		 * @since 2.0
		 */
		public function she_user_meta_data() {

			global $wpdb;

			$user_data = array();

			$user_data['email'] = get_option( 'admin_email' );

			$response = wp_remote_post( $this->onbording_api,
				array(
					'method' => 'POST',
					'body'   => wp_json_encode( $user_data ),
				)
			);

			if ( is_wp_error( $response ) ) {
				wp_send_json( array( 'onBoarding' => false ) );
			} else {
				$status_one = wp_remote_retrieve_response_code( $response );
			}
		}

		/**
		 * Set the response data.
		 *
		 * @since 2.0
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

	She_Dashboard_Ajax::instance();
}
