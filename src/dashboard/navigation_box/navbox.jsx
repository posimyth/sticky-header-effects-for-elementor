import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './navbox.scss'
import { __ } from '@wordpress/i18n';

const NavBox = (props) => {

    var plugin_url = shed_data.shed_url;
    var she_version = shed_data.shed_wp_version;
    var nonce = shed_data.nonce;
    var ajax_url = shed_data.ajax_url;
    var she_nexter_plugin = shed_data.shed_plugins;    

    const location = useLocation();
    const fullUrl = window.location.href;
    const baseUrl = fullUrl.split('/admin.php')[0];
    const [menuToggel, setmenuToggel] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [themeBuilder_plugin, setThemeBuilder_plugin] = useState(false);

    const toggleDropdown = (e) => {

        const parentElement = e.target.closest('.she_extra_options_navlink_cover');
        const rotateIcon = parentElement.querySelector('.she_navlink_icon');

        if (!isDropdownOpen) {
            rotateIcon.style.transform = 'rotate(90deg)';
        } else {
            rotateIcon.style.transform = 'rotate(0deg)';
        }

        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        if (props?.she_dashboard_data?.success && Array.isArray(props.plugin_check)) {
            const plugin_list = props.plugin_check;
            const index = plugin_list.findIndex((plg) => plg.name === 'nexter-extension');
            if (index > -1 && plugin_list[index]?.status === 'active') {
                setThemeBuilder_plugin(true);
            }
        }

        if (she_nexter_plugin) {
            const plugin_list = she_nexter_plugin;
            const index = plugin_list.findIndex((plg) => plg.name === 'nexter-extension');
            if (index > -1 && plugin_list[index]?.status === 'active') {
                setThemeBuilder_plugin(true);
            }
        }

    }, [props?.she_dashboard_data, props?.plugin_check,she_nexter_plugin]);

    return (

        <>
            <div className='she_navigation_cover'>
                <div className='she_logo_strip'>
                    <img className='she_main_logo' src={plugin_url + 'assets/svg/navbox/SHE_logo.svg'} />
                    <div className='she-mobile-menu-cn'>
                        <div className='she_hint_text'>FREE</div>
                        <svg className='she-menu-btn' onClick={() => { setmenuToggel(!menuToggel) }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M4 16H28M4 8H28M4 24H28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <div className={`she_navlinks_cover ${menuToggel ? 'she_open_menu' : ''}`}>
                    <ul className='she_navlinks_inner_cover'>
                        <li><Link className={`${location.pathname == '/dashboard_main' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/dashboard_main" onClick={() => { setmenuToggel(false) }}>{__('Dashboard', 'she-header')}</Link></li>
                        <li><Link className={`${location.pathname == '/' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/" onClick={() => { setmenuToggel(false) }}>{__('Header Templates', 'she-header')}</Link></li>
                        <li><Link className={`${location.pathname == '/header_widgets' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/header_widgets" onClick={() => { setmenuToggel(false) }}>{__('Header Widgets', 'she-header')}</Link></li>
                        {!themeBuilder_plugin && (
                            <li className='she_navlink_cover'>
                                 <Link className={`${location.pathname == '/theme_builder' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/theme_builder" onClick={() => { setmenuToggel(false) }}>{__('Elementor Theme Builder ', 'she-header')}
                                    <div className='she-nav-tag'>
                                        <span className='she-nav-tag-txt'>FREE</span>
                                    </div>
                                </Link>
                            </li>
                        )}
                        <li><Link className={`${location.pathname == '/extension' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/extension" onClick={() => { setmenuToggel(false) }}>{__('Extensions', 'she-header')}</Link></li>
                        <div className='she_extra_options_navlink_cover'>
                            <li className={`${location.pathname == '/extra_options' ? 'she_navlink she_active_tab' : 'she_navlink'}`} onClick={(e) => { toggleDropdown(e) }} >{__('Extra Options', 'she-header')}<span className='she_navlink_icon'><img src={plugin_url + 'assets/svg/chevron_right_icon.svg'} draggable={false} /></span></li>
                            {isDropdownOpen && (
                                <ul className='she_ext_opt_in_tabs'>
                                    <li className='she_nav_dropdown_links'><Link className={`${location.pathname == '/more_products' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/more_products" onClick={() => { setmenuToggel(false) }}>{__('More Products', 'she-header')}</Link></li>
                                    <li className='she_nav_dropdown_links'><Link className={`${location.pathname == '/rollback_plugin' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/rollback_plugin" onClick={() => { setmenuToggel(false) }}>{__('Roll Back', 'she-header')}</Link></li>                                </ul>
                            )}
                        </div>
                    </ul>
                    <div className='she_ver_nd_sys_info'>
                        <p className='she_version'>{__('Version', 'she-header')} {she_version}</p> |
                        <a href={baseUrl + '/site-health.php'} target="_blank" rel="noopener noreferrer" className='she_system_info'>{__('System Info', 'she-header')}</a>
                    </div>
                </div>
                <div className='she_content_area'></div>
            </div>
        </>
    );
}

const get_redux = state => ({
    plugin_check: state.check_plugin.plugin_status_rx,
    she_dashboard_data: state.Dashboard_data.db_rx,

})

export default connect(get_redux)(NavBox);