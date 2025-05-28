<?php
/**
 * It is Main File to load all Notice, Upgrade Menu and all
 *
 * @link       https://posimyth.com/
 * @since     2.0
 * */

namespace Theplus\Notices;

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'She_Deactivate_Feedback' ) ) {

	/**
	 * This class used for only load All Notice Files
	 *
	 * @since 2.0
	 */
	class She_Deactivate_Feedback {

		/**
		 * Singleton Instance of the Class.
		 *
		 * @since 2.0
		 * @var null|instance $instance An instance of the class or null if not instantiated yet.
		 */
		public static $instance = null;

		/**
		 * Singleton Instance of the Class.
		 *
		 * @since 2.0
		 * @var string|deactive_url $deactive_count_api An instance of the class or null if not instantiated yet.
		 */
		public $deactive_url = 'https://api.posimyth.com/wp-json/she/v2/she_deactivate_user_data';

		/**
		 * Singleton Instance Creation Method.
		 *
		 * This public static method ensures that only one instance of the class is loaded or can be loaded.
		 * It follows the Singleton design pattern to create or return the existing instance of the class.
		 *
		 * @since 2.0
		 * @access public
		 * @static
		 * @return self Instance of the class.
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Constructor Method for Compatibility Checks and Actions Initialization.
		 *
		 * This constructor method is automatically triggered when the class is instantiated.
		 * It performs compatibility checks to ensure basic requirements are met and initiates
		 * necessary actions such as setting up deactivation feedback and adding AJAX hooks.
		 *
		 * @since 2.0
		 * @access public
		 */
		public function __construct() {
			$this->she_deactivate_feedbacks();

			add_action( 'wp_ajax_she_deactivate_rateus_notice', array( $this, 'she_deactivate_rateus_notice' ) );
		}

		/**
		 * Check if the Current Screen is Related to Plugin Management.
		 *
		 * This private function checks whether the current screen corresponds to the
		 * WordPress plugin management screen, specifically the 'plugins' or 'plugins-network' screens.
		 * Returns true if the current screen is related to plugin management, otherwise false.
		 *
		 * @since 2.0
		 * @access private
		 *
		 * @return bool True if the current screen is for managing plugins, otherwise false.
		 */
		private function she_plugins_screen() {
			return in_array( get_current_screen()->id, array( 'plugins', 'plugins-network' ), true );
		}

		/**
		 * Initialize Hooks for Deactivation Feedback Functionality.
		 *
		 * Sets up hooks to enable the functionality related to deactivation feedback.
		 * This function adds an action hook to load necessary scripts and styles when
		 * the user accesses screens related to plugin deactivation.
		 *
		 * Fired by the `current_screen` action hook.
		 *
		 * @since 2.0
		 */
		public function she_deactivate_feedbacks() {

			add_action(
				'current_screen',
				function () {

					if ( ! $this->she_plugins_screen() ) {
						return;
					}

					add_action( 'admin_enqueue_scripts', array( $this, 'she_enqueue_feedback_dialog' ) );
				}
			);
		}

		/**
		 * Enqueue feedback dialog scripts.
		 *
		 * Registers the feedback dialog scripts and enqueues them.
		 *
		 * @since 2.0
		 */
		public function she_enqueue_feedback_dialog() {

			add_action( 'admin_footer', array( $this, 'she_display_deactivation_feedback_dialog' ) );

			wp_register_script( 'she-elementor-admin-feedback', SHE_HEADER_ASSETS_URL . 'js/she-deactivate-feedback.js', array(), SHE_HEADER_VERSION, true );
			wp_enqueue_script( 'she-elementor-admin-feedback' );
		}

		/**
		 * Print Deactivate Feedback Dialog.
		 *
		 * Displays a dialog box to prompt the user for reasons when deactivating Elementor.
		 * Provides options and input fields to collect feedback on why the plugin is being deactivated.
		 * This dialog is displayed in the WordPress admin area.
		 *
		 * Fired by the `admin_footer` filter hook.
		 *
		 * @since 2.0
		 *
		 * This function generates an HTML dialog box with radio buttons and text fields to capture
		 * the user's feedback regarding their reasons for deactivating The Plus Addons for Elementor plugin.
		 * The collected feedback is sent when the user deactivates the plugin.
		 */
		public function she_display_deactivation_feedback_dialog() {

			$security = wp_create_nonce( 'she-deactivate-feedback' );

			$reasons = array(
				array(
					'label' => esc_html__( 'Just Debugging', 'she-header' ),
					'svg'   => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><g stroke="#9D1A4F" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.667" clip-path="url(#a)"><path d="M10 18.333a8.333 8.333 0 1 0 0-16.667 8.333 8.333 0 0 0 0 16.667ZM8.333 12.5v-5M11.667 12.5v-5"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z"/></clipPath></defs></svg>',
				),
				array(
					'label' => esc_html__( 'Plugin Issues', 'she-header' ),
					'svg'   => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#9D1A4F" d="M10.179 2.771a3.601 3.601 0 0 1 3.42 3.596l.113.007a.9.9 0 0 1 .273.08l2.73-1.745.08-.046a.9.9 0 0 1 .89 1.562L14.97 7.961c.244.623.391 1.283.428 1.956l.002.05h2.7l.092.004a.9.9 0 0 1 0 1.791l-.092.005h-2.7v.9l-.006.268a5.405 5.405 0 0 1-.172 1.103l2.44 1.457.076.05a.9.9 0 0 1-.918 1.537l-.082-.042-2.264-1.353a5.402 5.402 0 0 1-8.95.001L3.261 17.04l-.461-.773-.462-.772 2.44-1.457a5.403 5.403 0 0 1-.178-1.372v-.899H1.9a.901.901 0 0 1 0-1.8h2.7v-.05l.038-.42a6.301 6.301 0 0 1 .391-1.536L2.314 6.225l-.075-.054a.9.9 0 0 1 1.045-1.463l2.73 1.747a.9.9 0 0 1 .274-.081l.111-.007A3.602 3.602 0 0 1 10 2.767l.179.004ZM3.26 17.04a.9.9 0 0 1-.923-1.545l.923 1.545Zm3.652-8.873a4.499 4.499 0 0 0-.514 1.837v2.662a3.602 3.602 0 0 0 2.7 3.486v-4.385a.9.9 0 0 1 1.8 0v4.385a3.602 3.602 0 0 0 2.697-3.307l.004-.179V9.995a4.496 4.496 0 0 0-.514-1.829H6.913ZM10 4.566a1.802 1.802 0 0 0-1.8 1.8h3.6l-.009-.178a1.8 1.8 0 0 0-1.613-1.613L10 4.566Z"/></svg>',
				),
				array(
					'label' => esc_html__( 'Slow Performance', 'she-header' ),
					'svg'   => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#9D1A4F" d="M2.8 10.931c0 1.99.806 3.79 2.109 5.091l-1.272 1.272A8.972 8.972 0 0 1 1 10.931a9 9 0 0 1 9-9 9 9 0 0 1 6.364 15.364l-1.273-1.273A7.2 7.2 0 1 0 2.8 10.932Zm4.236-4.236 4.05 4.05-1.272 1.272-4.05-4.05 1.272-1.272Z"/></svg>',
				),
				array(
					'label' => esc_html__( 'Switched to Alternative', 'she-header' ),
					'svg'   => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#9D1A4F" d="M5.532 9.195a.809.809 0 0 1 0 1.61l-.083.003H3.252a5.58 5.58 0 0 0 6.222 2.772l.352-.097a5.562 5.562 0 0 0 3.681-3.716.81.81 0 0 1 1.55.465 7.185 7.185 0 0 1-1.265 2.415l4.97 4.972.056.061a.81.81 0 0 1-1.137 1.14l-.062-.056-4.972-4.973a7.183 7.183 0 0 1-2.794 1.361v.001a7.199 7.199 0 0 1-7.236-2.406v.893a.808.808 0 1 1-1.617 0V10l.004-.083a.809.809 0 0 1 .805-.726h3.64l.083.004ZM6.506 1.2a7.199 7.199 0 0 1 5.084.646 7.196 7.196 0 0 1 2.151 1.76V2.72a.81.81 0 0 1 1.619 0v3.64a.81.81 0 0 1-.81.809h-3.64a.809.809 0 0 1 0-1.617h2.201a5.583 5.583 0 0 0-6.226-2.78h-.002a5.565 5.565 0 0 0-3.919 3.474l-.115.346a.81.81 0 0 1-1.551-.463l.071-.225a7.18 7.18 0 0 1 5.137-4.705v.001Z"/></svg>',
				),
				array(
					'label' => esc_html__( 'No Longer Needed', 'she-header' ),
					'svg'   => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#9D1A4F" d="M16.566 1.914a2.7 2.7 0 0 1 1.643 4.595c-.287.287-.633.5-1.009.633v8.259a2.701 2.701 0 0 1-2.7 2.7h-9a2.704 2.704 0 0 1-2.688-2.433L2.8 15.4V7.143a2.7 2.7 0 0 1-1.01-.634 2.701 2.701 0 0 1-.777-1.641L.999 4.6a2.702 2.702 0 0 1 2.7-2.7h12.6l.267.014ZM4.6 15.4l.004.089a.903.903 0 0 0 .896.811h9a.903.903 0 0 0 .9-.9V7.3H4.6v8.1Zm7.292-6.296a.9.9 0 0 1 0 1.791l-.092.005H8.2a.9.9 0 0 1 0-1.8h3.6l.092.004ZM3.699 3.701a.9.9 0 0 0-.9.9l.005.088a.902.902 0 0 0 .895.811h12.6l.09-.004A.901.901 0 0 0 17.2 4.6a.9.9 0 0 0-.811-.895l-.09-.004H3.7Z"/></svg>',
				),
				array(
					'label' => esc_html__( 'Compatibility Issues', 'she-header' ),
					'svg'   => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#9D1A4F" fill-rule="evenodd" d="M19 10a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9Zm-9 7.2a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z" clip-rule="evenodd"/><path fill="#9D1A4F" fill-rule="evenodd" d="M16.036 4.414a.9.9 0 0 1 0 1.272l-10.35 10.35a.9.9 0 0 1-1.272-1.272l10.35-10.35a.9.9 0 0 1 1.272 0Z" clip-rule="evenodd"/></svg>',
				),
				array(
					'label' => esc_html__( 'Missing Feature', 'she-header' ),
					'svg'   => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#9D1A4F" d="M17.363 10a1.158 1.158 0 0 0-.263-.734l-.075-.084-1.377-1.376a1.636 1.636 0 0 1 .774-2.749l.157-.048a1.23 1.23 0 0 0 .408-.26l.11-.12a1.228 1.228 0 1 0-2.105-1.207l-.049.155a1.638 1.638 0 0 1-2.585.919l-.164-.143-1.376-1.377a1.156 1.156 0 0 0-1.551-.077l-.085.077-1.378 1.376h.001l.184.05A2.864 2.864 0 1 1 4.404 7.99l-.051-.184-1.378 1.377a1.158 1.158 0 0 0-.338.818l.006.114a1.157 1.157 0 0 0 .331.703h.001l1.377 1.377.144.163a1.636 1.636 0 0 1-.92 2.585h.001a1.228 1.228 0 0 0-.024 2.381 1.228 1.228 0 0 0 1.504-.9 1.637 1.637 0 0 1 2.748-.775l1.377 1.376.085.077a1.16 1.16 0 0 0 .733.262l.113-.005a1.16 1.16 0 0 0 .705-.334l1.377-1.376a2.865 2.865 0 0 1-2.103-3.508 2.862 2.862 0 0 1 3.547-2.033 2.867 2.867 0 0 1 1.957 1.904l.05.183v.001h.002l1.377-1.377.075-.084a1.16 1.16 0 0 0 .263-.734ZM19 10a2.795 2.795 0 0 1-.634 1.771l-.185.204-1.377 1.375.001.001a1.638 1.638 0 0 1-2.75-.775v-.001a1.227 1.227 0 1 0-1.479 1.482l.207.064a1.637 1.637 0 0 1 .712 2.52l-.143.165-1.377 1.375a2.793 2.793 0 0 1-1.7.805l-.275.013a2.793 2.793 0 0 1-1.772-.633l-.203-.184-1.377-1.377v-.001a2.864 2.864 0 1 1-3.636-3.402l.184-.05-1.377-1.376v-.001a2.793 2.793 0 0 1-.805-1.701L1 10a2.793 2.793 0 0 1 .82-1.975l1.376-1.377a1.638 1.638 0 0 1 2.337.023c.202.21.344.47.411.753l.048.155a1.228 1.228 0 0 0 2.326-.776 1.227 1.227 0 0 0-.739-.81l-.155-.05a1.636 1.636 0 0 1-.776-2.748l1.377-1.376.203-.184a2.793 2.793 0 0 1 3.747.184l1.377 1.377.051-.185a2.864 2.864 0 1 1 4.85 2.78l-.133.138a2.863 2.863 0 0 1-1.132.67l-.184.05 1.377 1.376.185.203A2.797 2.797 0 0 1 19 10Z"/></svg>',
				),
				array(
					'label' => esc_html__( 'Other Reason', 'she-header' ),
					'svg'   => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#9D1A4F" d="M10 1a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9Zm0 1.8a7.2 7.2 0 1 0 0 14.4 7.2 7.2 0 0 0 0-14.4Zm0 10.8a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm0-8.55a3.262 3.262 0 0 1 1.213 6.291.72.72 0 0 0-.274.18c-.04.046-.046.103-.045.163l.006.116a.9.9 0 0 1-1.794.105L9.1 11.8v-.225c0-1.038.837-1.66 1.444-1.904a1.463 1.463 0 1 0-2.006-1.358.9.9 0 1 1-1.8 0A3.262 3.262 0 0 1 10 5.05Z"/></svg>',
				),
			);

			?>

			<div id="she-feedback-dialog-wrapper">
				<div id="she-feedback-dialog-header">
					<span id="she-feedback-dialog-header-title">
						<?php echo esc_html__( 'Deactivation Reason', 'she-header' ); ?>
					</span>
				<button type="button" id="she-feedback-close-button" aria-label="Close">
					&times;
				</button>
				</div>

				<form id="she-feedback-dialog-form" method="post">
					<input type="hidden" name="nonce" value="<?php echo esc_attr( $security ); ?>" />
					<input type="hidden" name="she_admin_url" value="<?php echo admin_url( 'admin-ajax.php' ); ?>" />
					
					<div class="she-feedback-dialog-radio-content">
						<div class="she-feedback-dialog-content">

						<?php
						foreach ( $reasons as $index => $reason ) {
							$id = 'she-feedback-reason-' . esc_attr( $index );
							?>

							<input type="radio" name="she_issue_type" id="<?php echo esc_attr( $id ); ?>" value="<?php echo esc_attr( $reason['label'] ); ?>" hidden />

							<label for="<?php echo esc_attr( $id ); ?>" class="she-feedback-option">
								<span class="she-feedback-icon"><?php echo $reason['svg']; ?></span>
								<span class="she-feedback-label"><?php echo esc_html( $reason['label'] ); ?></span>
							</label>
						<?php } ?>

							<div id="she-other-reason-textarea-wrapper" style="display:none;">
								<textarea name="she_issue_text" placeholder="Please share the reason"></textarea>
							</div>
						</div>

						<div class="she-feedback-dialog-content-content">
							<?php
								echo esc_html__( 'If you require any help, please ', 'she-header' );
								echo '<a href="https://wordpress.org/support/plugin/sticky-header-effects-for-elementor/" target="_blank" rel="noopener">' . esc_html__( 'Create A Ticket', 'she-header' ) . '</a>';
								echo esc_html__( ', we reply within 24 working hours. Looking for instant solutions? - ', 'she-header' );
								echo '<a href="https://stickyheadereffects.com/docs/?utm_source=wpbackend&utm_medium=admin&utm_campaign=pluginpage" target="_blank" rel="noopener">' . esc_html__( 'Read our Documentation', 'she-header' ) . '</a> ' . esc_html__( 'or', 'she-header' ) . '<a target="_blank" href="https://theplusaddons.com/chat/?utm_source=wpbackend&utm_medium=admin&utm_campaign=pluginpage" target="_blank" rel="noopener"> ' . esc_html__( 'Ask AI', 'she-header' ) . '</a>';
							?>
						</div>

						<div class="she-checkbox-wrapper">
							<input type="checkbox" class="she-chkbox-style" id="she-feedback-deactivate-checkbox" name="she_collect_email" value="1" />
							<label for="she-feedback-deactivate-checkbox">
								<?php echo esc_html__( 'I agree to be contacted via email for support with this plugin.', 'she-header' ); ?>
							</label>

						</div>
					</div>
				</form>
			</div>
			<?php
		}


		/**
		 * Deactivates the rate-us notice via AJAX.
		 *
		 * This function handles the AJAX request to deactivate the rate-us notice,
		 * and sends the necessary data to the remote API for processing.
		 *
		 * @since 2.0
		 * @return void
		 */
		public function she_deactivate_rateus_notice() {
			$nonce = ! empty( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';

			if ( ! isset( $nonce ) || empty( $nonce ) || ! wp_verify_nonce( $nonce, 'she-deactivate-feedback' ) ) {
				$response = array(
					'success'     => 0,
					'message'     => esc_html__( 'Security checked!', 'she-header' ),
					'description' => esc_html__( 'Security checked!', 'she-header' ),
				);

				wp_send_json( $response );
				wp_die();
			}

			$issue_type = ! empty( $_POST['issue_type'] ) ? sanitize_text_field( wp_unslash( $_POST['issue_type'] ) ) : '';
			$issue_text = ! empty( $_POST['issue_text'] ) ? sanitize_text_field( wp_unslash( $_POST['issue_text'] ) ) : '';

			$api_params = array(
				'issue_type' => $issue_type,
				'issue_text' => $issue_text,
			);

			if ( ! empty( $_POST['collect_email'] ) && $_POST['collect_email'] == '1' ) {
				$current_user = wp_get_current_user();
				$user_email   = $current_user->user_email;
				$api_params['email'] = $user_email;
			}

			$data = wp_remote_post(
				$this->deactive_url,
				array(
					'timeout'   => 60,
					'sslverify' => false,
					'body'      => $api_params,
				)
			);


			$response = array(
				'success'     => 1,
				'message'     => esc_html__( 'success!.', 'she-header' ),
				'description' => esc_html__( 'success!.', 'she-header' ),
			);

			wp_send_json( $response );
			wp_die();
		}
	}

	She_Deactivate_Feedback::instance();
}
