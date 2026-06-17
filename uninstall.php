<?php

/**
 * Fired when the plugin is uninstalled.
 *
 * @link       https://posimyth.com/
 * @since      2.0.0
 *
 * @package sticky-header-effects-for-elementor
 * @category Core
 * @author POSIMYTH
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Options created by the plugin.
$she_options = array(
	'she_rebranding_dismissed',
	'she_bfsale_notice_dismissed',
	'she_smsale_notice_dismissed',
	'she_menu_notificetions',
	'she_onboarding_setup',
	'she_design_from_scratch',
	'she_header_template',
	'wkit_onbording_end',
	'she_nexter_extension_notice',
	'she_header_install_time',
	'she_join_community_notice',
);

foreach ( $she_options as $she_option ) {
	delete_option( $she_option );
}

// Transients created by the plugin.
delete_transient( 'she_header_template' );

// Per-user dismissal flags (remove for every user).
delete_metadata( 'user', 0, 'she_pro_launch_notice_dismissed', '', true );
delete_metadata( 'user', 0, 'she_dismissed_notice_plugin', '', true );
delete_metadata( 'user', 0, 'she_pro_live_notice_dismissed', '', true );

// Versioned rollback caches (she_rollback_version_*) — the version suffix
// isn't known at uninstall time, so clean them up directly.
global $wpdb;

$like_transient = $wpdb->esc_like( '_transient_she_rollback_version_' ) . '%';
$like_timeout   = $wpdb->esc_like( '_transient_timeout_she_rollback_version_' ) . '%';

$wpdb->query(
	$wpdb->prepare(
		"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
		$like_transient,
		$like_timeout
	)
);
