import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import './theme_builder.scss'
import { __ } from '@wordpress/i18n';

const ThemeBuilder = (props) => {

    var plugin_url = shed_data.shed_url;
    var nonce = shed_data.nonce;
    var ajax_url = shed_data.ajax_url;

    var image_url = 'https://api.wdesignkit.com/images/plugins/theme-builder/';

    const Navigate = useNavigate();
    const [nexter_btn, setNexter_btn] = useState('Enable Theme Builder');

    const Install_Nexter = async () => {
        setNexter_btn('Installing. . . ')

        let form = new FormData();
        form.append('action', 'she_dashboard_ajax_call');
        form.append('nonce', nonce);
        form.append('type', 'she_plugin_install');
        form.append('slug', 'nexter-extension/nexter-extension.php');
        form.append('name', 'nexter-extension');

        var response = await axios.post(ajax_url, form);

        if (response) {
            setNexter_btn('Installed Successfully');
            window.location.reload();
        }
    }

    let card_array = [
        {
            'title': __('Advanced Header Builder', 'she-header'),
            'description': __('Get rid of the limited Header customizer. Use Elementor Widgets or Blocks to create custom. menu.', 'she-header'),
            'image': plugin_url + 'assets/images/theme_bulider/advanced-header-builder.png',
            'q_image': image_url + 'advanced-header-builder.png',
        },
        {
            'title': __('Advanced Footer Builder', 'she-header'),
            'description': __('Your custom Footer with no limit of layout. Create any footer layout you want with our Footer Builder.', 'she-header'),
            'image': plugin_url + 'assets/images/theme_bulider/advanced-footer-builder.png',
            'q_image': image_url + 'advanced-footer-builder.png',
        },
        {
            'title': __('Breadcrumbs Bar', 'she-header'),
            'description': __('Help users navigate your website by adding breadcrumb bar that shows the path they\'ve taken.', 'she-header'),
            'image': plugin_url + 'assets/images/theme_bulider/breadcrumbs-bar.png',
            'q_image': image_url + 'breadcrumbs-bar.png',
        },
        {
            'title': __('404 Page', 'she-header'),
            'description': __('Turn a "Page Not Found" into an opportunity by customizing your 404 error page with your branding and helpful content.', 'she-header'),
            'image': plugin_url + 'assets/images/theme_bulider/404-page.png',
            'q_image': image_url + '404-page.png',
        },
        {
            'title': __('Single Pages', 'she-header'),
            'description': __('Create custom Single pages for your CPT, Blog Posts, or WooCommerce Product Pages.', 'she-header'),
            'image': plugin_url + 'assets/images/theme_bulider/single-pages.png',
            'q_image': image_url + 'single-pages.png',
        },
        {
            'title': __('Archive Pages', 'she-header'),
            'description': __('Create custom listing pages for posts, CPT or WooCommerce Products.', 'she-header'),
            'image': plugin_url + 'assets/images/theme_bulider/archive-pages.png',
            'q_image': image_url + 'archive-pages.png',
        },
        {
            'title': __('Code Snippets', 'she-header'),
            'description': __('Get rid of the limited Header customizer. Use WordPress Blocks or Blocks to create custom menu.', 'she-header'),
            'image': plugin_url + 'assets/images/theme_bulider/code-snippets.png',
            'q_image': image_url + 'code-snippets.png',
        },
        {
            'title': __('Display Rules for Theme Builder Sections', 'she-header'),
            'description': __('Control where and how your theme builder sections appear on your site.', 'she-header'),
            'image': plugin_url + 'assets/images/theme_bulider/display-rules-sections.png',
            'q_image': image_url + 'display-rules-sections.png',
        },
        {
            'title': __('Action & Filter Hooks', 'she-header'),
            'description': __('Fine-tune your website\'s behavior and appearance by utilizing action and filter hooks for developers to extend functionalities.', 'she-header'),
            'image': plugin_url + 'assets/images/theme_bulider/action-filter-hooks.png',
            'q_image':image_url + 'action-filter-hooks.png',
        }
    ];

    return (
        <div className='she-theme-bulder-main she-main-container'>
            <div className='she-section-heading-cover'>
                <div className='she-main-sections-heading'>
                   <h3 className='she-section-heading'>{__('Elementor Theme Builder', 'she-header')}</h3>
                   <p className='she-section-free-heading'>{__('FREE', 'she-header')}</p>
                </div>
                <div className='she_head_tgl_btn_grp'>
                    {props?.plugin_check[4]?.status !== 'active' ?
                        <button className='she-purple-common-btn' onClick={() => { Install_Nexter() }}>{nexter_btn}</button>
                        :
                        <a href='edit.php?post_type=nxt_builder' target="_blank" rel="noopener noreferrer" className='she-purple-common-btn'>{__('Open Theme Builder', 'she-header')}</a>
                    }
                    {/* <button className='she-purple-common-btn' onClick={() => { Install_Nexter() }}>{__('Install FREE Nexter Theme')}</button> */}
                </div>
            </div>

            <div className='she_theme_builder_box_cover_main'>
                {/* <h3 className='she-in-sec-heading'>{__('Get FREE Theme Builder for Elementor with our Nexter Theme', 'she-header')}</h3> */}

                <div className='she_theme_builder_grid_view_box'>

                    {card_array.length > 0 && card_array.map((card, index) => {
                        return (
                            <div className='she_theme_builder_box' key={index}>
                                <div className='she_theme_builder_cover_img_box'>
                                    <img className='she_theme_builder_img' src={card?.image} draggable={false} />
                                    <img className='she_theme_builder_img' src={card?.q_image} draggable={false} style={{ position: 'absolute', left: 0 }} />
                                </div>
                                <div className='she_theme_builder_description'>
                                    <h4 className='she_theme_build_title she-in-sec-heading'>{card?.title}</h4>
                                    <p className='she_tb_crd_desc'>{card?.description}</p>
                                </div>
                            </div>
                        );
                    })
                    }
                </div>
                <div className='she_view_all_btm_btn'>

                    {props?.plugin_check[4]?.status !== 'active' ?
                        <button onClick={() => { Install_Nexter() }} target="_blank" rel="noopener noreferrer" className='she-ghost-btn'>{nexter_btn}</button>
                        :
                        <a href="https://nexterwp.com/nexter-extension/?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=stickyheader" target="_blank" rel="noopener noreferrer" className='she-ghost-btn'>{__('View all Nexter Extension Features', 'she-header')}</a>
                    }

                </div>
            </div>
        </div>
    )
}

const get_redux = state => ({
    plugin_check: state.check_plugin.plugin_status_rx,
})

export default connect(get_redux)(ThemeBuilder);