<?php
/**
 * "Join Community" Admin Notice for Sticky Header Effects for Elementor.
 *
 * Modeled on The Plus Addons' Tp_Join_Community_Notice. Shows a one-time
 * dismissible banner inviting users to the community (Discord + Facebook),
 * 30 days after install.
 *
 * @link  https://posimyth.com/
 * @since 2.2.0
 *
 * @package she-header
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'She_Join_Community_Notice' ) ) {

	/**
	 * Community invitation notice.
	 *
	 * @since 2.2.0
	 */
	class She_Join_Community_Notice {

		/**
		 * Singleton instance.
		 *
		 * @since 2.2.0
		 * @var self|null
		 */
		private static $instance = null;

		/**
		 * Returns (and lazy-creates) the singleton.
		 *
		 * @since 2.2.0
		 * @return self
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Constructor — registers the dismiss handler and (when due) the notice.
		 *
		 * @since 2.2.0
		 */
		private function __construct() {
			add_action( 'wp_ajax_she_dismiss_join_community_notice', array( $this, 'dismiss' ) );

			$saved = get_option( 'she_header_install_time' );

			// No recorded install time → nothing to measure against.
			if ( empty( $saved ) ) {
				return;
			}

			$days_passed = floor( ( time() - strtotime( $saved ) ) / DAY_IN_SECONDS );

			if ( $days_passed >= 30 && ! get_option( 'she_join_community_notice' ) ) {
				add_action( 'admin_notices', array( $this, 'render' ) );
			}
		}

		/**
		 * Output the community invitation banner.
		 *
		 * @since 2.2.0
		 */
		public function render() {

			$nonce  = wp_create_nonce( 'she_join_community_notice' );
			$screen = get_current_screen();

			$plugin_status = apply_filters( 'she_get_plugin_status', 'not_installed' );

			$allowed_parents = array( 'index', 'elementor', 'themes', 'edit', 'plugins' );

			if ( get_option( 'she_onboarding_setup' ) || 'not_installed' !== $plugin_status ) {
				$allowed_parents[] = 'she-header';
			}

			$parent_base = ! empty( $screen->parent_base ) && in_array( $screen->parent_base, $allowed_parents, true );

			if ( ! $parent_base ) {
				return;
			}

			$logo_url     = defined( 'SHE_HEADER_URL' ) ? SHE_HEADER_URL . 'assets/img/she-icon.png' : '';
			$discord_url  = 'https://go.posimyth.com/she-discord/?utm_source=wpbackend&utm_medium=adminbanner&utm_campaign=join_community';
			$facebook_url = 'https://www.facebook.com/groups/theplus4elementor';
			?>
			<div class="notice notice-info is-dismissible she-join-community" style="border-left-color:#E6017E;">
				<div class="she-notice-wrap" style="display:flex;column-gap:12px;align-items:flex-start;padding:15px 10px;position:relative;margin-left:0;">

					<?php if ( $logo_url ) : ?>
						<div class="she-notice-logo" style="display:flex;padding-top:14px;flex-shrink:0;">
							<img style="max-width:28px;max-height:28px;border-radius:5px;" src="<?php echo esc_url( $logo_url ); ?>" alt="<?php esc_attr_e( 'Sticky Header Effects for Elementor', 'she-header' ); ?>" />
						</div>
					<?php endif; ?>

					<div style="margin:0 10px;color:#000;">
						<h3 style="margin:10px 0 7px;"><?php esc_html_e( 'Join the Sticky Header Effects Community – Learn, Share & Grow', 'she-header' ); ?></h3>

						<p style="color:#1e1e1e;"><?php esc_html_e( 'Get early access to features, share ideas, and connect with other Elementor creators.', 'she-header' ); ?></p>

						<div class="she-notice-button" style="margin-top:10px;">
							<a href="<?php echo esc_url( $discord_url ); ?>" class="button" target="_blank" rel="noopener noreferrer" style="margin-right:10px;background:#E6017E;border-color:#E6017E;color:#fff;">
								<?php esc_html_e( 'Join Discord', 'she-header' ); ?>
							</a>
							<a href="<?php echo esc_url( $facebook_url ); ?>" class="button" target="_blank" rel="noopener noreferrer" style="margin-right:10px;background:#E6017E;border-color:#E6017E;color:#fff;">
								<?php esc_html_e( 'Join Facebook Group', 'she-header' ); ?>
							</a>
						</div>
					</div>
				</div>
			</div>

			<script>
				jQuery( document ).on( 'click', '.she-join-community .notice-dismiss', function( e ) {
					e.preventDefault();

					jQuery.ajax( {
						url:  ajaxurl,
						type: 'POST',
						data: {
							action:   'she_dismiss_join_community_notice',
							security: '<?php echo esc_js( $nonce ); ?>',
							type:     'she_join_community_notice',
						},
						success: function() {
							jQuery( '.she-join-community' ).hide();
						}
					} );
				} );
			</script>
			<?php
		}

		/**
		 * AJAX handler — permanently records the dismissal (site-wide option).
		 *
		 * @since 2.2.0
		 */
		public function dismiss() {
			$security = ! empty( $_POST['security'] ) ? sanitize_text_field( wp_unslash( $_POST['security'] ) ) : '';

			if ( empty( $security ) || ! wp_verify_nonce( $security, 'she_join_community_notice' ) ) {
				wp_send_json_error( __( 'Security check failed.', 'she-header' ) );
			}

			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( __( 'You are not allowed to do this action', 'she-header' ) );
			}

			update_option( 'she_join_community_notice', true );

			wp_send_json_success();
		}
	}

	She_Join_Community_Notice::instance();
}
