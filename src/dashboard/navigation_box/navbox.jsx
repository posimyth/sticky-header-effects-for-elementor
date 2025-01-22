import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './navbox.scss'
import { __ } from '@wordpress/i18n';

const NavBox = (props) => {

    // var white_lable_data = props.tpae_white_lable_data;
    // var pluginList = props.plugin_check;
    var plugin_url = shed_data.shed_url;
    var tpae_version = shed_data.shed_wp_version;

    const free_pro = shed_data?.tpae_pro == '1' ? true : false;

    const Navigate = useNavigate();
    const location = useLocation();
    const fullUrl = window.location.href;
    const baseUrl = fullUrl.split('/admin.php')[0];

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [whitelable_data, setwhitelable_data] = useState({});
    const [menuToggel, setmenuToggel] = useState(false);

    // useEffect(() => {
    //     setwhitelable_data(props.tpae_white_lable_data || '');
    // }, [props.tpae_white_lable_data]);

    const toggleDropdown = (e) => {

        const parentElement = e.target.closest('.tpae_extra_options_navlink_cover');
        const rotateIcon = parentElement.querySelector('.tpae_navlink_icon');

        if (!isDropdownOpen) {
            rotateIcon.style.transform = 'rotate(90deg)';
        } else {
            rotateIcon.style.transform = 'rotate(0deg)';
        }

        setIsDropdownOpen(!isDropdownOpen);
    };

    const set_logo = (key) => {

        // if (white_lable_data?.tp_plus_logo) {
        //     return white_lable_data.tp_plus_logo;
        // } else {
        return plugin_url + 'assets/svg/navbox/SHE_logo.svg'
        // }
    }

    // const isPluginUnavailable = pluginList?.some((plugin) =>
    //     plugin.status !== 'unavailable' && plugin.name === 'envato-elements'
    // );

    return (

        <>
            <div className='tpae_navigation_cover'>
                <div className='tpae_logo_strip'>
                    <img className='tpae_main_logo' src={set_logo()} />
                    <div className='tpae-mobile-menu-cn'>
                        <div className='tpae_hint_text'>
                            {free_pro && (
                                <>
                                    <img src={plugin_url + 'assets/svg/premium_icon.svg'} draggable={false} />
                                    {'PRO'}
                                </>
                            )}
                            {!free_pro && 'FREE'}
                        </div>
                        <svg className='tpae-menu-btn' onClick={() => { setmenuToggel(!menuToggel) }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M4 16H28M4 8H28M4 24H28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <div className={`tpae_navlinks_cover ${menuToggel ? 'tpae_open_menu' : ''}`}>
                    <ul className='tpae_navlinks_inner_cover'>
                        <li><Link className={`${location.pathname == '/' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/" onClick={() => { setmenuToggel(false) }}>{__('Dashboard', 'tpebl')}</Link></li>
                        <li><Link className={`${location.pathname == '/widgets' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/widgets" onClick={() => { setmenuToggel(false) }}>{__('Header Templates', 'tpebl')}</Link></li>
                        <li><Link className={`${location.pathname == '/theme_builder' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/theme_builder" onClick={() => { setmenuToggel(false) }}>{__('Elementor Theme Builder ', 'tpebl')}</Link></li>

                        {/* {whitelable_data?.template_tab !== 'on' && isPluginUnavailable != true && */}
                        <li><Link className={`${location.pathname == '/extension' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/extension" onClick={() => { setmenuToggel(false) }}>{__('Extensions', 'tpebl')}</Link></li>
                        <li><Link className={`${location.pathname == '/more_products' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/more_products" onClick={() => { setmenuToggel(false) }}>{__('More Products', 'tpebl')}</Link></li>
                        <li><Link className={`${location.pathname == '/rollback_plugin' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/rollback_plugin" onClick={() => { setmenuToggel(false) }}>{__('Roll Back', 'tpebl')}</Link></li>
                        {/* } */}

                        {/* <div className='tpae_extra_options_navlink_cover'>
                        <li className={`${location.pathname == '/extra_options' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} onClick={(e) => { toggleDropdown(e) }} >{__('Extra Options', 'tpebl')}<span className='tpae_navlink_icon'><img src={plugin_url + 'assets/svg/chevron_right_icon.svg'} draggable={false} /></span></li>
                        {isDropdownOpen && (
                            <ul className='tpae_ext_opt_in_tabs'>
                                <li className='tpae_nav_dropdown_links'><Link className={`${location.pathname == '/settings' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/settings" onClick={() => { setmenuToggel(false) }}>{__('Settings', 'tpebl')}</Link></li>
                                <li className='tpae_nav_dropdown_links'><Link className={`${location.pathname == '/listing' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/listing" onClick={() => { setmenuToggel(false) }}>{__('Listing', 'tpebl')}</Link></li>
                                <li className='tpae_nav_dropdown_links'><Link className={`${location.pathname == '/performance' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/performance" onClick={() => { setmenuToggel(false) }}>{__('Performance', 'tpebl')}</Link></li>
                                <li className='tpae_nav_dropdown_links'><Link className={`${location.pathname == '/Custom_CSS_JS' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/Custom_CSS_JS" onClick={() => { setmenuToggel(false) }}>{__('Custom CSS & JS', 'tpebl')}</Link></li>

                                {whitelable_data?.rollback_tab !== 'on' &&
                                    <li className='tpae_nav_dropdown_links'><Link className={`${location.pathname == '/rollback_plugin' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/rollback_plugin" onClick={() => { setmenuToggel(false) }}>{__('Roll Back Plugin', 'tpebl')}</Link></li>
                                }

                                {whitelable_data?.tp_white_label_hidden !== 'on' &&
                                    <li className='tpae_nav_dropdown_links'><Link className={`${location.pathname == '/whitelabel' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/whitelabel" onClick={() => { setmenuToggel(false) }}>{__('White Label', 'tpebl')}</Link></li>
                                }

                                {whitelable_data?.plugin_ads !== 'on' &&
                                    <>
                                        <li className='tpae_nav_dropdown_links'><Link className={`${location.pathname == '/theme_builder' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/theme_builder" onClick={() => { setmenuToggel(false) }}>{__('Theme Builder', 'tpebl')}</Link></li>
                                        <li className='tpae_nav_dropdown_links'><Link className={`${location.pathname == '/more_products' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/more_products" onClick={() => { setmenuToggel(false) }}>{__('More Products ', 'tpebl')}</Link></li>
                                    </>
                                }
                            </ul>
                        )}
                    </div> */}
                        {/* <li>
                        {!free_pro &&
                            <Link className={`${location.pathname == '/upgrade_now' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/upgrade_now" onClick={() => { setmenuToggel(false) }}>{__('Upgrade Now', 'tpebl')}<span className='tpae_navlink_icon'><img src={plugin_url + 'assets/svg/premium_icon.svg'} draggable={false} /></span></Link>
                        }

                        {free_pro &&
                            <>
                                {whitelable_data?.licence_tab !== 'on' &&
                                    <Link className={`${location.pathname == '/activate_pro' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/activate_pro" onClick={() => { setmenuToggel(false) }}>{__('Activate PRO', 'tpebl')}</Link>
                                }
                            </>
                        }
                    </li> */}
                    </ul>
                    <div className='tpae_ver_nd_sys_info'>
                        <p className='theplus_version'>{__('Version', 'tpebl')} {tpae_version}</p> |
                        <a href={baseUrl + '/site-health.php'} target="_blank" rel="noopener noreferrer" className='tpae_system_info'>{__('System Info', 'tpebl')}</a>
                    </div>
                </div>
                <div className='tpae_content_area'></div>
            </div>
            <div className='she_nav_bnner'>
                <p className='she_bnner_txt'>Get 1000+ Elementor Templates & Sections</p>
                <div className='she_dwd_sections'>
                    <div className='she_dwd_btn'>Enable Templates</div>
                    <a className='she_dwd_link' href="#">Learn More</a>
                </div>
                <div className='she_footer_img'>
                    <img src={plugin_url + 'assets/images/banner/footer_wdk.png'} alt="" />
                </div>
            </div>
        </>
    );
}

const get_redux = state => ({
    tpae_dashboard_data: state.Dashboard_data.db_rx,
    // tpae_white_lable_data: state.White_label.white_lable_rx,
    plugin_check: state.check_plugin.plugin_status_rx,
})

const set_redux = dispatch => ({
    tpae_set_white_lable: data => dispatch(white_lable_a_rx(data)),
})

export default connect(get_redux, set_redux)(NavBox);