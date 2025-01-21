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

if ( ! class_exists( 'She_Loader' ) ) {

	/**
	 * This class used for widget load
	 *
	 * @since 1.7.3
	 */
	class She_Loader {

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
			$this->she_load();
		}

		/**
		 * Add Menu Page WdKit.
		 *
		 * @since 1.7.3
		 */
		public function she_load() {
			require SHE_HEADER_PATH . 'includes/dashboard/class-she-dashboard-ajax.php';
			require SHE_HEADER_PATH . 'includes/dashboard/class-she-wp-menu.php';
		}
	}

	She_Loader::instance();
}
