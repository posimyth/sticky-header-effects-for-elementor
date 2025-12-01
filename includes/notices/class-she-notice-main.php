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

if ( ! class_exists( 'She_Notice_Main' ) ) {

	/**
	 * This class used for widget load
	 *
	 * @since 2.0
	 */
	class She_Notice_Main {

		/**
		 *
		 * Ensures only one instance of the class is loaded or can be loaded.
		 *
		 * @var instance
		 * @since 2.0
		 */
		private static $instance = null;

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
			$this->she_load();
		}

				/**
		 *
		 * It is Use for Check Plugin Dependency of template.
		 *
		 * @since 6.0.0
		 */
		public function tpae_check_plugins_depends( $plugin ) {
			$update_plugin = array();

			if ( ! function_exists( 'get_plugins' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}
			
			$all_plugins = get_plugins();

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

			return $update_plugin;
		}

		/**
		 * Add Menu Page WdKit.
		 *
		 * @version 2.0
		 */
		public function she_load() {
			if ( is_admin() && current_user_can( 'manage_options' ) ) {
				// include SHE_HEADER_PATH . 'includes/notices/class-she-banner-notice.php';
				// include SHE_HEADER_PATH . 'includes/notices/class-she-plugin-page.php';
				include SHE_HEADER_PATH . 'includes/notices/class-she-deactivate-feedback.php';

				$ele_pro_plugin = array(
					'name'        => 'elementor-pro',
					'status'      => '',
					'plugin_slug' => 'elementor-pro/elementor-pro.php',
				);

				$tpae_plugin = array(
					'name'        => 'the-plus-addons-for-elementor-page-builder',
					'status'      => '',
					'plugin_slug' => 'the-plus-addons-for-elementor-page-builder/theplus_elementor_addon.php',
				);

				$ele_pro_details = $this->tpae_check_plugins_depends( $ele_pro_plugin );
				$tpae_details    = $this->tpae_check_plugins_depends( $tpae_plugin );
			  	
				if( ! empty( $ele_pro_details[0]['status'] ) && 'unavailable' == $ele_pro_details[0]['status'] ) {
					include SHE_HEADER_PATH . 'includes/notices/class-she-nexter-extension-promo.php';
				}

				if( ! empty( $tpae_details[0]['status'] ) && 'unavailable' == $tpae_details[0]['status'] ) {
					include SHE_HEADER_PATH . 'includes/notices/class-she-bf-banner.php';
				}

			}
		}
	}

	She_Notice_Main::instance();
}
