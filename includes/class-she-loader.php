<?php
/**
 * This file is used to load widget builder files and the builder.
 *
 * @link https://posimyth.com/
 * @since 1.7.3
 *
 * @package she-header
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
		 * @version 2.0
		 */
		public function she_load() {

			if ( is_admin() && current_user_can( 'manage_options' ) ) {
				require SHE_HEADER_PATH . 'includes/dashboard/class-she-dashboard-ajax.php';
				require SHE_HEADER_PATH . 'includes/dashboard/class-she-wp-menu.php';
				require SHE_HEADER_PATH . 'includes/meta/class-she-meta.php';
				add_action( 'admin_footer', array( $this, 'she_add_notificetions' ) );
				add_option( 'she_menu_notificetions', '1' );
			}

			require SHE_HEADER_PATH . 'includes/preset/class-she-preset.php';
			require SHE_HEADER_PATH . 'includes/notices/class-she-notice-main.php';
		}

		function she_add_notificetions() {

			$get_notification = get_option( 'she_menu_notificetions' );

			if ( $get_notification !== SHE_MENU_NOTIFICETIONS ) { ?>
				<script type="text/javascript">
					document.addEventListener('DOMContentLoaded', function() {
						var menuItem = document.querySelector('.toplevel_page_elementor.menu-top-first');
						if (menuItem) {
							menuItem.classList.add('she-admin-notice-active');
						}
					});
				</script>
				<?php
			}
		}
	}

	She_Loader::instance();
}
