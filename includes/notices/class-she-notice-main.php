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
		 * Add Menu Page WdKit.
		 *
		 * @version 2.0
		 */
		public function she_load() {
			if ( is_admin() && current_user_can( 'manage_options' ) ) {
				include SHE_HEADER_PATH . 'includes/notices/class-she-banner-notice.php';
				include SHE_HEADER_PATH . 'includes/notices/class-she-plugin-page.php';
				include SHE_HEADER_PATH . 'includes/notices/class-she-deactivate-feedback.php';
			}
		}
	}

	She_Notice_Main::instance();
}
