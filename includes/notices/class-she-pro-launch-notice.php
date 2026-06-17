<?php
/**
 * Pro Launch Admin Notice for Sticky Header Effects for Elementor.
 *
 * Shows a one-time dismissible banner to all admins once SHE Pro is released,
 * with a link to the pricing page.
 *
 * @link  https://posimyth.com/
 * @since 2.2.0
 *
 * @package she-header
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'She_Pro_Launch_Notice' ) ) {

	/**
	 * Shows a dismissible Pro launch banner in the WP admin.
	 *
	 * @since 2.2.0
	 */
	class She_Pro_Launch_Notice {

		/**
		 * Singleton instance.
		 *
		 * @since 2.2.0
		 * @var self|null
		 */
		private static $instance = null;

		/**
		 * User-meta key used to track per-user dismissal.
		 *
		 * @since 2.2.0
		 * @var string
		 */
		public $db_key = 'she_pro_launch_notice_dismissed';

		/**
		 * Pro plugin slug (folder/file).
		 *
		 * @since 2.2.0
		 * @var string
		 */
		public $pro_slug = 'sticky-header-effects-for-elementor-pro/sticky-header-effects-for-elementor-pro.php';

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
		 * Constructor — registers hooks.
		 *
		 * @since 2.2.0
		 */
		public function __construct() {
			add_action( 'admin_notices', array( $this, 'render' ) );
			add_action( 'wp_ajax_she_dismiss_pro_launch_notice', array( $this, 'dismiss' ) );
		}

		/**
		 * Outputs the admin banner markup and inline dismiss script.
		 *
		 * @since 2.2.0
		 */
		public function render() {

			// Hide when the Pro plugin is already active.
			if ( ! function_exists( 'is_plugin_active' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}
			if ( is_plugin_active( $this->pro_slug ) ) {
				return;
			}

			// Hide once the current user has dismissed it.
			if ( get_user_meta( get_current_user_id(), $this->db_key, true ) ) {
				return;
			}

			// Only show on screens relevant to SHE / Elementor users.
			$screen = get_current_screen();
			if ( ! $screen ) {
				return;
			}

			$allowed_screens = array(
				'elementor_page_she-header',
				'dashboard',
				'plugins',
				'update-core',
				'toplevel_page_elementor',
				'edit-elementor_library',
				'elementor_page_elementor-system-info',
			);

			if ( ! in_array( $screen->id, $allowed_screens, true ) ) {
				return;
			}

			$nonce       = wp_create_nonce( 'she_pro_launch_notice_nonce' );
			$pricing_url = 'https://stickyheadereffects.com/#pricing';
			$logo_img    = SHE_HEADER_URL . 'assets/images/banner/she-notice-benner.png';

			?>
			<style>
				/* Make WP's native dismiss × visible against the dark background */
				#she-pro-launch-notice.notice-is-dark .notice-dismiss::before {
					color: rgba(255, 255, 255, 0.55);
				}
				#she-pro-launch-notice.notice-is-dark .notice-dismiss:hover::before {
					color: #ffffff;
				}
				/* Button hover effects */
				#she-pro-launch-notice .she-btn-primary {
					transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
				}
				#she-pro-launch-notice .she-btn-primary:hover {
					background: #bf0069 !important;
					border-color: #bf0069 !important;
					color: #fff !important;
					box-shadow: 0 4px 12px rgba(230, 1, 126, 0.45);
				}
			</style>

			<?php
			/*
			 * Outer div follows the same WP-native pattern as TPAE notices:
			 *   • notice                → full-width + standard admin margins
			 *   • is-dismissible        → WP injects the × button automatically
			 *   • notice-is-dark        → our hook for the CSS override above
			 *   • she-pro-launch-notice → scoped JS selector
			 *
			 * The dark gradient is applied directly on this div so it still
			 * fills the full width that .notice provides.
			 */
			?>
			<div id="she-pro-launch-notice"
				class="notice is-dismissible she-pro-launch-notice notice-is-dark"
				style="background:linear-gradient(135deg,#190A12 0%,#2d0d20 60%,#3a0f29 100%);border-left-color:#E6017E;margin-left:0;border-radius:6px;">

				<div class="she-pro-notice-inner"
					style="display:flex;column-gap:12px;align-items:flex-start;padding:15px 10px;position:relative;margin-left:0;">

					<?php /* ── Left: logo — padding-top:14px matches TPAE icon alignment ── */ ?>
					<div style="display:flex;padding-top:14px;flex-shrink:0;">
						<img src="<?php echo esc_url( $logo_img ); ?>"
							alt="<?php esc_attr_e( 'Sticky Header Effects', 'she-header' ); ?>"
							style="max-width:44px;max-height:44px;border-radius:6px;" />
					</div>

					<?php /* ── Right: headline, description, buttons — mirrors TPAE column layout ── */ ?>
					<div style="margin:0 10px;color:#fff;">

						<?php /* Title + PRO badge row — margin:10px 0 7px matches TPAE h3 spacing */ ?>
						<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:10px 0 7px;">
							<h3 style="margin:0;color:#ffffff;font-size:1.25em;font-weight:700;line-height:1.3;">
								<?php esc_html_e( 'Sticky Header Effects Pro Is Now Live - 11 New Effects for Elementor', 'she-header' ); ?>
							</h3>
							<span style="background:#E6017E;color:#fff;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 8px;border-radius:20px;line-height:1.6;">
								<?php esc_html_e( 'PRO', 'she-header' ); ?>
							</span>
						</div>

						<p style="margin:0;color:rgba(255,255,255,0.72);font-size:13px;line-height:1.5;">
							<?php esc_html_e( '12 new effects and 50+ ready-made templates. With Sticky Until, Header Replace on Scroll, Multi-Sticky, and more. Same no-code editor.', 'she-header' ); ?>
						</p>

						<?php /* Buttons — margin-top:10px matches TPAE button row spacing */ ?>
						<div class="she-pro-notice-buttons" style="display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap;">

							<a href="<?php echo esc_url( $pricing_url ); ?>"
								target="_blank" rel="noopener noreferrer"
								class="button she-btn-primary"
								style="margin-right:10px;background:#E6017E;border-color:#E6017E;color:#fff;text-decoration:none;white-space:nowrap;">
								<?php esc_html_e( 'View Pricing', 'she-header' ); ?> &rarr;
							</a>

						</div><?php /* end buttons */ ?>

					</div><?php /* end right column */ ?>

				</div><?php /* end inner */ ?>

			</div><?php /* end notice */ ?>

			<script>
				jQuery( document ).ready( function( $ ) {
					/*
					 * WP's is-dismissible handler already hides the notice on × click.
					 * We just fire the AJAX call alongside it to persist the dismissal.
					 */
					$( '#she-pro-launch-notice' ).on( 'click', '.notice-dismiss', function() {
						$.ajax( {
							type: 'POST',
							url:  ajaxurl,
							data: {
								action: 'she_dismiss_pro_launch_notice',
								nonce:  '<?php echo esc_js( $nonce ); ?>',
							},
						} );
					} );
				} );
			</script>
			<?php
		}

		/**
		 * AJAX handler — saves dismissal to user meta so the notice stays hidden.
		 *
		 * @since 2.2.0
		 */
		public function dismiss() {

			if ( ! check_ajax_referer( 'she_pro_launch_notice_nonce', 'nonce', false ) ) {
				wp_send_json( array(
					'status'  => false,
					'message' => esc_html__( 'Security check failed.', 'she-header' ),
				) );
				wp_die();
			}

			if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
				wp_send_json( array(
					'status'  => false,
					'message' => esc_html__( 'Insufficient permissions.', 'she-header' ),
				) );
				wp_die();
			}

			update_user_meta( get_current_user_id(), $this->db_key, 1 );

			wp_send_json( array(
				'status'  => true,
				'message' => esc_html__( 'Notice dismissed.', 'she-header' ),
			) );
		}
	}

	She_Pro_Launch_Notice::instance();
}
