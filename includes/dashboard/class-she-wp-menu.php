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

if ( ! class_exists( 'She_Wp_Menu' ) ) {

	/**
	 * This class used for widget load
	 *
	 * @since 1.7.3
	 */
	class She_Wp_Menu {

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
			add_action( 'admin_menu', array( $this, 'she_admin_menu' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'she_enqueue_scripts' ) );
		}

		/**
		 * Add Menu Page WdKit.
		 *
		 * @since 1.7.3
		 * @version 2.0
		 */
		public function she_admin_menu() {
			$capability = 'manage_options';

			// if ( current_user_can( $capability ) ) {
			// add_menu_page( __( 'SHE for Elementor', 'she-header' ), __( 'SHE for Elementor', 'she-header' ), 'manage_options', 'she-header', array( $this, 'she_menu_page_template' ), '', 67 );
			// } 	 

			if ( current_user_can( $capability ) ) {
				add_action(
					'admin_menu',
					function () {
						add_submenu_page(
							'elementor',
							__( 'Sticky Header Effects', 'she-header' ),
							__( 'Sticky Header Effects', 'she-header' ),
							'manage_options',
							'she-header',
							array( $this, 'she_menu_page_template' ),
							14
						);
					},
					80
				);
			}
		}

		/**
		 * Load wdkit page content.
		 *
		 * @since 1.7.3
		 */
		public function she_menu_page_template() {
			echo '<div id="she-app"></div>';
		}

		/**
		 * Register the JavaScript for the admin area.
		 *
		 * @param string $page give builder name.
		 * @since 2.0
		 */
		public function she_enqueue_scripts( $page ) {

			wp_enqueue_style( 'she-admin-style', SHE_HEADER_URL . '/assets/css/admin.css', array(), SHE_HEADER_VERSION, 'all' );
			
			$get_notification = get_option( 'she_menu_notificetions' );

			$she_notificetions = 'close';
			if( $get_notification !== SHE_MENU_NOTIFICETIONS ){
				$she_notificetions = 'open';
			}

			if ( 'elementor_page_she-header' === $page ) {
				wp_enqueue_style( 'she-editor-css', SHE_HEADER_URL . 'build/index.css', array(), SHE_HEADER_VERSION );

				wp_enqueue_script( 'she-editor-js', SHE_HEADER_URL . 'build/index.js', array( 'wp-i18n', 'wp-element', 'wp-components' ), SHE_HEADER_VERSION, true );
				wp_set_script_translations( 'she-editor-js', 'she-header' );
				wp_localize_script(
					'she-editor-js',
					'shed_data',
					array(
						'ajax_url'        => admin_url( 'admin-ajax.php' ),
						'nonce'           => wp_create_nonce( 'she-db-nonce' ),
						'shed_url'        => SHE_HEADER_URL,
						'shed_wp_version' => SHE_HEADER_VERSION,
						'she_wp_version'  => get_bloginfo( 'version' ),
						'shed_pro'        => 0,
						'shed_wdkit_url'  => SHE_WDKIT_URL,
						'onboarding_setup'  => get_option( 'she_onboarding_setup' ),
						'shed_notificetions' => $she_notificetions,
					),
				);
			}
		}
	}

	She_Wp_Menu::instance();
}
