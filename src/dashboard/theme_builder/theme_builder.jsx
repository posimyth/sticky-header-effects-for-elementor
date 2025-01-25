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
            'title': __('Advanced Header Builder', 'tpebl'),
            'description': __('Get rid of the limited Header customizer. Use Elementor Widgets or Blocks to create custom. menu.', 'tpebl'),
            'image': plugin_url + 'assets/images/new_dashboard/Advanced Header Builder.png',
            'q_image': 'https://wdesignkit.com/images/front/theplus-plugin/more-products/advanced-header-Builder.png',
        },
        {
            'title': __('Advanced Footer Builder', 'tpebl'),
            'description': __('Your custom Footer with no limit of layout. Create any footer layout you want with our Footer Builder.', 'tpebl'),
            'image': plugin_url + 'assets/images/new_dashboard/Advanced Footer Builder.png',
            'q_image': 'https://wdesignkit.com/images/front/theplus-plugin/more-products/advanced-footer-builder.png',
        },
        {
            'title': __('Breadcrumbs Bar', 'tpebl'),
            'description': __('Help users navigate your website by adding breadcrumb bar that shows the path they\'ve taken.', 'tpebl'),
            'image': plugin_url + 'assets/images/new_dashboard/Breadcrumbs Bar.png',
            'q_image': 'https://wdesignkit.com/images/front/theplus-plugin/more-products/breadcrumbs-bar.png',
        },
        {
            'title': __('404 Page', 'tpebl'),
            'description': __('Turn a "Page Not Found" into an opportunity by customizing your 404 error page with your branding and helpful content.', 'tpebl'),
            'image': plugin_url + 'assets/images/new_dashboard/404-page.png',
            'q_image': 'https://wdesignkit.com/images/front/theplus-plugin/more-products/404-page.png',
        },
        {
            'title': __('Single Pages', 'tpebl'),
            'description': __('Create custom Single pages for your CPT, Blog Posts, or WooCommerce Product Pages.', 'tpebl'),
            'image': plugin_url + 'assets/images/new_dashboard/single-pages.png',
            'q_image': 'https://wdesignkit.com/images/front/theplus-plugin/more-products/single-pages.png',
        },
        {
            'title': __('Archive Pages', 'tpebl'),
            'description': __('Create custom listing pages for posts, CPT or WooCommerce Products.', 'tpebl'),
            'image': plugin_url + 'assets/images/new_dashboard/archive-pages.png',
            'q_image': 'https://wdesignkit.com/images/front/theplus-plugin/more-products/archive-pages.png',
        },
        {
            'title': __('Code Snippets', 'tpebl'),
            'description': __('Get rid of the limited Header customizer. Use WordPress Blocks or Blocks to create custom menu.', 'tpebl'),
            'image': plugin_url + 'assets/images/new_dashboard/code-snippets.png',
            'q_image': 'https://wdesignkit.com/images/front/theplus-plugin/more-products/code-snippets.png',
        },
        {
            'title': __('Display Rules for Theme Builder Sections', 'tpebl'),
            'description': __('Control where and how your theme builder sections appear on your site.', 'tpebl'),
            'image': plugin_url + 'assets/images/new_dashboard/display-rules-sections.png',
            'q_image': 'https://wdesignkit.com/images/front/theplus-plugin/more-products/display-rules-sections.png',
        },
        {
            'title': __('Action & Filter Hooks', 'tpebl'),
            'description': __('Fine-tune your website\'s behavior and appearance by utilizing action and filter hooks for developers to extend functionalities.', 'tpebl'),
            'image': plugin_url + 'assets/images/new_dashboard/action-filter-hooks.png',
            'q_image': 'https://wdesignkit.com/images/front/theplus-plugin/more-products/action-filter-hooks.png',
        }
    ];

    return (
        <div className='theplus_theme_builder_cover_main she-main-container'>
            <div className='she-section-heading-cover'>
                <h3 className='she-section-heading'>{__('Elementor Theme Builder', 'tpebl')}</h3>

                <div className='tpae_head_tgl_btn_grp'>
                    {props?.plugin_check[4]?.status !== 'active' ?
                        <button className='she-purple-common-btn' onClick={() => { Install_Nexter() }}>{nexter_btn}</button>
                        :
                        <a href='edit.php?post_type=nxt_builder' target="_blank" rel="noopener noreferrer" className='she-purple-common-btn'>{__('Open Theme Builder', 'tpebl')}</a>
                    }
                    {/* <button className='she-purple-common-btn' onClick={() => { Install_Nexter() }}>{__('Install FREE Nexter Theme')}</button> */}
                </div>
            </div>

            <div className='theplus_theme_builder_box_cover_main'>
                <h3 className='she-in-sec-heading'>{__('Get FREE Theme Builder for Elementor with our Nexter Theme', 'tpebl')}</h3>

                <div className='theplus_theme_builder_grid_view_box'>

                    {card_array.length > 0 && card_array.map((card, index) => {
                        return (
                            <div className='theplus_theme_builder_box' key={index}>
                                <div className='theplus_theme_builder_cover_img_box'>
                                    <img className='theplus_theme_builder_img' src={card?.image} draggable={false} />
                                    <img className='theplus_theme_builder_img' src={card?.q_image} draggable={false} style={{ position: 'absolute', left: 0 }} />
                                </div>
                                <div className='theplus_theme_builder_description'>
                                    <h4 className='tpae_theme_build_title she-in-sec-heading'>{card?.title}</h4>
                                    <p className='tpae_tb_crd_desc'>{card?.description}</p>
                                </div>
                            </div>
                        );
                    })
                    }
                </div>
                <div className='theplus_view_all_btm_btn'>
                    <a href="https://nexterwp.com/nexter-extension" target="_blank" rel="noopener noreferrer" className='she-ghost-btn'>{__('Learn More', 'tpebl')}</a>
                </div>
            </div>
        </div>
    )
}

const get_redux = state => ({
    tpae_white_lable_data: state.White_label.white_lable_rx,
    plugin_check: state.check_plugin.plugin_status_rx,
})

export default connect(get_redux)(ThemeBuilder);