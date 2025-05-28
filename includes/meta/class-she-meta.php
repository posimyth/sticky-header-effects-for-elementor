<?php
/**
 * This file is used to load plugin links.
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

if ( ! class_exists( 'She_meta' ) ) {

	/**
	 * This class used for widget load
	 *
	 * @since 2.0
	 */
	class She_meta {

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
			add_filter( 'plugin_row_meta', array( $this, 'she_extra_links_plugin_row_meta' ), 10, 2 );
			add_filter( 'plugin_action_links_' . SHE_PBNAME, array( $this, 'she_settings_pro_link' ) );
		}

		/**
		 * Plugin Active show Document links
		 *
		 * @since 2.0
		 *
		 * @param array  $plugin_meta The array of plugin links.
		 * @param String $plugin_file The array of plugin links.
		 * @return array The updated plugin meta information containing additional links.
		 */
		public function she_extra_links_plugin_row_meta( $plugin_meta = array(), $plugin_file = '' ) {

			if ( strpos( $plugin_file, SHE_PBNAME ) !== false ) {
				$new_links = array(
					// 'official-site'    => '<a href="' . esc_url( 'https://stickyheadereffects.com/?utm_source=wpbackend&utm_medium=pluginpage&utm_campaign=pluginpage' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Visit Plugin site', 'tpebl' ) . '</a>',
					'docs'             => '<a href="' . esc_url( 'https://stickyheadereffects.com/docs?utm_source=wpbackend&utm_medium=pluginpage&utm_campaign=pluginpage' ) . '" target="_blank" rel="noopener noreferrer" style="color:green;">' . esc_html__( 'Docs', 'tpebl' ) . '</a>',
					'video-tutorials'  => '<a href="' . esc_url( 'https://www.youtube.com/c/POSIMYTHInnovations/?sub_confirmation=1' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Video Tutorials', 'tpebl' ) . '</a>',
					'join-community'   => '<a href="' . esc_url( 'https://www.facebook.com/groups/theplus4elementor' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Join Community', 'tpebl' ) . '</a>',
					'whats-new'        => '<a href="' . esc_url( 'https://wordpress.org/plugins/sticky-header-effects-for-elementor/#developers' ) . '" target="_blank" rel="noopener noreferrer" style="color: orange;">' . esc_html__( 'What\'s New?', 'tpebl' ) . '</a>',
					'req-feature'      => '<a href="' . esc_url( 'https://wordpress.org/support/plugin/sticky-header-effects-for-elementor/' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Request Feature', 'tpebl' ) . '</a>',
					'rate-plugin-star' => '<a href="' . esc_url( 'https://wordpress.org/support/plugin/sticky-header-effects-for-elementor/reviews/?filter=5' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Share Review', 'tpebl' ) . '</a>',
				);

				$plugin_meta = array_merge( $plugin_meta, $new_links );
			}

			foreach ( $plugin_meta as $key => $meta ) {
				if ( stripos( $meta, 'View details' ) !== false ) {
					unset( $plugin_meta[ $key ] );
				}
			}

			return $plugin_meta;
		}

		/**
		 * Plugin Active Settings, Need Help link Show
		 *
		 * @since 2.0
		 *
		 * @param array $links The array of plugin links.
		 * @return array The updated plugin meta information containing additional links.
		 */
		public function she_settings_pro_link( $links ) {

			/**Settings link.*/
			$setting_link = sprintf( '<a href="%s">%s</a>', esc_url( admin_url( 'admin.php?page=she-header' ) ), __( 'Settings', 'tpebl' ) );
			$links[]      = $setting_link;

			/**Need Help.*/
				$need_help = sprintf( '<a href="%s" target="_blank" rel="noopener noreferrer">%s</a>', esc_url( 'https://wordpress.org/support/plugin/sticky-header-effects-for-elementor/?utm_source=wpbackend&utm_medium=pluginpage&utm_campaign=pluginpage' ), __( 'Need Help?', 'tpebl' ) );
				$links     = (array) $links;
				$links[]   = $need_help;
			return $links;
		}
	}

	She_meta::instance();
}
