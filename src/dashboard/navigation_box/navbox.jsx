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
    const [licensed, setLicensed] = useState(shed_data.shed_pro == 1); // live "Activated" state (updates on activate/deactivate without refresh)

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

    }, [props?.she_dashboard_data, props?.plugin_check, she_nexter_plugin]);

    // Live-update the sidebar "Activated" label when the license is activated or
    // deactivated on the Activate License tab (custom event), so it reflects
    // immediately without a page refresh.
    useEffect(() => {
        const onLicenseChange = (e) => { setLicensed(!!(e.detail && e.detail.licensed)); };
        window.addEventListener('she-license-changed', onLicenseChange);
        return () => window.removeEventListener('she-license-changed', onLicenseChange);
    }, []);

    return (

        <>
            <div className='she_navigation_cover'>
                <div className='she_logo_strip'>
                    <img className='she_main_logo' src={plugin_url + 'assets/svg/navbox/SHE_logo.svg'} />
                    <div className='she-mobile-menu-cn'>
                        {shed_data.shed_pro_installed == 1 ? (
                            <div className='she_hint_text she_hint_text--pro'>
                                <img className='she_pro_crown' src={plugin_url + 'assets/svg/premium_icon.svg'} width="20" height="19" draggable={false} alt="" />
                                PRO
                            </div>
                        ) : (
                            <div className='she_hint_text'>FREE</div>
                        )}
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
                            {/* {isDropdownOpen && ( */}
                            <ul className={`she_ext_opt_in_tabs ${isDropdownOpen ? 'is-open' : ''}`}>
                                <li className='she_nav_dropdown_links'><Link className={`${location.pathname == '/more_products' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/more_products" onClick={() => { setmenuToggel(false) }}>{__('More Products', 'she-header')}</Link></li>
                                <li className='she_nav_dropdown_links'><Link className={`${location.pathname == '/rollback_plugin' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/rollback_plugin" onClick={() => { setmenuToggel(false) }}>{__('Roll Back', 'she-header')}</Link></li>
                            </ul>
                            {/* )} */}
                        </div>
                        {shed_data.shed_pro_installed == 1 ? (
                            <li><Link className={`${location.pathname == '/activate_license' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/activate_license" onClick={() => { setmenuToggel(false) }}>{licensed ? (
                                <>{__('Activated', 'she-header')}<svg className='she_activated_check' width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M9.24735 0.0195866C7.79655 0.156374 6.69379 0.465122 5.48936 1.07089C3.9017 1.86425 2.43135 3.21257 1.46546 4.76021C0.76548 5.87796 0.257115 7.32008 0.0498588 8.7661C-0.0166196 9.22727 -0.0166196 10.7671 0.0498588 11.2283C0.2141 12.3812 0.519118 13.3895 0.996199 14.3548C1.53194 15.4491 2.05985 16.1838 2.92798 17.0554C3.7922 17.9152 4.53911 18.4506 5.59103 18.9665C6.3262 19.326 6.79938 19.5019 7.54628 19.6895C9.50153 20.1819 11.4646 20.0881 13.3729 19.412C13.9595 19.2049 14.9684 18.6968 15.4846 18.3529C16.6656 17.5634 17.7253 16.477 18.4918 15.2732C18.7733 14.8316 19.2269 13.8936 19.4107 13.3739C20.3297 10.7866 20.1694 8.01182 18.961 5.58484C18.4761 4.60779 17.9326 3.83788 17.17 3.05234C16.3332 2.18472 15.4885 1.57114 14.3896 1.0279C13.2321 0.457304 12.1528 0.148558 10.8702 0.031311C10.4713 -0.00386238 9.56801 -0.0116787 9.24735 0.0195866Z" fill="#14C38E" /><path d="M13.8261 6.73158C13.7733 6.75427 12.4461 8.05869 10.8776 9.63534L8.01967 12.4975L6.95643 11.4313C5.80646 10.2819 5.79892 10.2781 5.46712 10.3424C5.28238 10.3764 5.05615 10.6033 5.02222 10.7885C4.95812 11.1288 4.9355 11.1023 6.39087 12.5618C7.84624 14.0212 7.81607 13.9985 8.15918 13.9343C8.28737 13.9116 8.65687 13.5562 11.4432 10.7658C13.7243 8.47837 14.5914 7.58607 14.6216 7.49155C14.7046 7.23822 14.6141 6.966 14.3841 6.79586C14.2672 6.70889 13.9656 6.67487 13.8261 6.73158Z" fill="white" /></svg></>
                            ) : __('Activate License', 'she-header')}</Link></li>
                        ) : (
                            <li><a className='she_navlink' href="https://stickyheadereffects.com/#pricing" target="_blank" rel="noopener noreferrer" onClick={() => { setmenuToggel(false) }}>{__('Upgrade Now', 'she-header')}</a></li>
                        )}
                    </ul>
                    <div className='she_ver_nd_sys_info'>
                        <p className='she_version'>{__('Version', 'she-header')} {shed_data.shed_pro_installed == 1 && shed_data.shed_pro_version ? shed_data.shed_pro_version : she_version}</p> |
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