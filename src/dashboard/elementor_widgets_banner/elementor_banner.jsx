import React from 'react';
import './elementor_banner.scss';
import { __ } from '@wordpress/i18n';

const ElementorWidgetBanner = () => {
    const plugin_url = shed_data.shed_url;
    
    return (

        <div className='tpae_ele_wid_ban_cov_box'>
            <div className='theplus_elementor_widgets_banner_left_content'>
                <p className='theplus_elementor_widgets_banner_top_sm_strip'><img src={plugin_url + 'assets/svg/dashboard_tab/shield_icon.svg'} draggable={false} />{__('60 days Money-Back Guarantee', 'she-header')}</p>
                <h2 className='theplus_elementor_widgets_banner_heading'>{__('Get Access to all')} <br />{__('120+ Elementor Widgets.')}</h2>
                <div className='tpae_ele_wid_banner_btn_group'>
                    <a target='_blank' rel="noopener noreferrer" className="tpae_ele_wid_banner_btn" href='https://theplusaddons.com/pricing?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings'>{__('Upgrade Now', 'she-header')}</a>
                    <a target='_blank' rel="noopener noreferrer" className='tpae_ele_wid_banner_btn_link' href='https://theplusaddons.com/widgets?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings'>{__('View all Widgets', 'she-header')}</a>
                </div>
                <ul className='theplus_banner_points_listing'>
                    <li className='theplus_banner_points_strip'><img src={plugin_url + 'assets/svg/dashboard_tab/tpae_check_white_icon.svg'} draggable={false} />{__('Performance Optimized', 'she-header')}</li>
                    <li className='theplus_banner_points_strip'><img src={plugin_url + 'assets/svg/dashboard_tab/tpae_check_white_icon.svg'} draggable={false} />{__('Recommended by Elementor', 'she-header')}</li>
                    <li className='theplus_banner_points_strip'><img src={plugin_url + 'assets/svg/dashboard_tab/tpae_check_white_icon.svg'} draggable={false} />{__('Works with Most Themes', 'she-header')}</li>
                </ul>
            </div>
            <div className='theplus_elementor_widgets_banner_right_content'>
                <img className='theplus_elementor_widgets_banner_right_img' src={plugin_url + 'assets/images/new_dashboard/elementor_widgets.png'} draggable={false}></img>
            </div>
        </div>
    )
}

export default ElementorWidgetBanner;