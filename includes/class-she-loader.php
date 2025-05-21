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
				add_action( 'after_plugin_row', array( $this, 'she_plugins_page_rebranding_banner' ), 10, 1 );
			}

			require SHE_HEADER_PATH . 'includes/preset/class-she-preset.php';
			require SHE_HEADER_PATH . 'includes/notices/class-she-plugin-notice.php';
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

		public function she_plugins_page_rebranding_banner( $plugin_file ) {
			// if ( ! get_option('she_rebranding_dismissed') ) {
				
				$plugin_file_array = explode( '/', $plugin_file );
				if ( end( $plugin_file_array ) === 'sticky-header-effects-for-elementor.php' ) {

					echo '<style>
						.she-plugin-notice-dismiss {
							position: absolute;
							top: 0;
							right: 1px;
							margin: 0;
							padding: 9px;
							border: none;
							background: none;
							color: #787c82;
							cursor: pointer;
						}

						.she-plugin-notice-dismiss:before{
							content: "\f153";
							font: normal 18px/22px dashicons;
							display: block;
							background: none;
							color: #787c82;
							speak: never;
							height: 20px;
							width: 20px;
							text-align: center;
							-webkit-font-smoothing: antialiased;
							-moz-osx-font-smoothing: grayscale;
						}
					</style>';

					echo '<tr class="she-plugin-rebranding-update">
						<td colspan="4" style="padding: 20px 40px; background: #f0f6fc; border-left: 4px solid #72aee6; box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);">
						<div class="she-plugin-update-notice inline notice notice-alt notice-warning" style="position: relative;">
							<h4 style="margin-top:10px;margin-bottom:7px;font-size:14px;">' . esc_html__( "This Plugin has now been acquired by POSIMYTH Innovations", 'the-plus-addons-for-block-editor' ) . '</h4>
							<a target="_blank" rel="noopener noreferrer" href="'.esc_url('https://stickyheadereffects.com/massive-updates-2-0/?utm_source=wpbackend&utm_medium=pluginpage&utm_campaign=links').'" style="text-decoration:underline;margin-bottom:10px;display:inline-block;">' . esc_html__( 'Read What\'s New & What Changed?', 'the-plus-addons-for-block-editor') . '</a>
							<span class="she-plugin-notice-dismiss"></span>
						</div>
						</td></tr>';
				}
			// }
		}
	}

	She_Loader::instance();
}
