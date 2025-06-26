<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Custom Control for Discord Invite Box
 */
class Discord_Box_Control extends Base_Data_Control {

    public function get_type() {
        return 'she_discord_box';
    }

    public function content_template() {
    echo '<div class="she-discord-box-control">';

        echo '<a href="https://wordpress.org/support/plugin/sticky-header-effects-for-elementor/" target="_blank" class="she-request-box-button">';
            echo esc_html__('Request Feature', 'she-header');
        echo '</a>';

        echo '<div class="she-discord-box">';
            echo '<div class="she-discord-box-content">';
                echo '<p>';
                    echo esc_html__('Join our community to shape the future of', 'she-header') . '<br>';
                    echo '<span class="she-discord-strong">Sticky Header Effects for Elementor</span><br>';
                    echo esc_html__('Get early access and exclusive perks!', 'she-header');
                echo '</p>';
            echo '</div>';

            echo '<a href="https://discord.com/invite/SJwaHypc" target="_blank" class="she-discord-box-button">';
                echo esc_html__('- Join Discord Now', 'she-header');
            echo '</a>';
        echo '</div>';

    echo '</div>';
}

}
