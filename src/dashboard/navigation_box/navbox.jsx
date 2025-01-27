import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './navbox.scss'
import { __ } from '@wordpress/i18n';

const NavBox = (props) => {

    var plugin_url = shed_data.shed_url;
    var tpae_version = shed_data.shed_wp_version;

    const free_pro = shed_data?.tpae_pro == '1' ? true : false;

    const location = useLocation();
    const fullUrl = window.location.href;
    const baseUrl = fullUrl.split('/admin.php')[0];
    const [menuToggel, setmenuToggel] = useState(false);

    const [buttonText, setButtonText] = useState('Enable Templates');
    const [pluginActive, setPluginActive] = useState(false);
    var plugin_status = props.plugin_check[1];

    const handleClick = async () => {

        setButtonText('Installing WDesignKit');

        setLoaderVisible(true);

        let form = new FormData();
        form.append('action', 'she_dashboard_ajax_call');
        form.append('nonce', nonce);
        form.append('type', 'she_plugin_install');
        form.append('slug', 'wdesignkit/wdesignkit.php');
        form.append('name', 'wdesignkit');

        var response = await axios.post(ajax_url, form);
        var data = response.data;

        if (data.success) {
            setButtonText('Installed WDesignKit');
            setPluginActive(true);
            setLoaderVisible(true);
        } else {
            setButtonText('Installation Failed');
            setLoaderVisible(false);
        }
    };

    const wdkit_Plugin_url = () => {
        var fullUrl = window.location.href;
        var baseUrl = fullUrl.split('/admin.php')[0];

        return baseUrl + '?page=wdesign-kit';
    }

    return (

        <>
            <div className='she_navigation_cover'>
                <div className='she_logo_strip'>
                    <img className='she_main_logo' src={plugin_url + 'assets/svg/navbox/SHE_logo.svg'} />
                    <div className='she-mobile-menu-cn'>
                        <div className='she_hint_text'>
                            {free_pro && (
                                <>
                                    <img src={plugin_url + 'assets/svg/premium_icon.svg'} draggable={false} />
                                    {'PRO'}
                                </>
                            )}
                            {!free_pro && 'FREE'}
                        </div>
                        <svg className='she-menu-btn' onClick={() => { setmenuToggel(!menuToggel) }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M4 16H28M4 8H28M4 24H28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <div className={`she_navlinks_cover ${menuToggel ? 'she_open_menu' : ''}`}>
                    <ul className='she_navlinks_inner_cover'>
                        <li><Link className={`${location.pathname == '/' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/" onClick={() => { setmenuToggel(false) }}>{__('Dashboard', 'she-header')}</Link></li>
                        <li><Link className={`${location.pathname == '/elementor_templates' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/elementor_templates" onClick={() => { setmenuToggel(false) }}>{__('Header Templates', 'she-header')}</Link></li>
                        <li className='she_navlink_cover'>
                            <Link className={`${location.pathname == '/theme_builder' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/theme_builder" onClick={() => { setmenuToggel(false) }}>{__('Elementor Theme Builder ', 'she-header')}
                            <div className='she-nav-tag'>
                                <span className='she-nav-tag-txt'>FREE</span>
                            </div>
                            </Link>
                        </li>
                        <li><Link className={`${location.pathname == '/extension' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/extension" onClick={() => { setmenuToggel(false) }}>{__('Extensions', 'she-header')}</Link></li>
                        <li><Link className={`${location.pathname == '/more_products' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/more_products" onClick={() => { setmenuToggel(false) }}>{__('More Products', 'she-header')}</Link></li>
                        <li><Link className={`${location.pathname == '/rollback_plugin' ? 'she_navlink she_active_tab' : 'she_navlink'}`} to="/rollback_plugin" onClick={() => { setmenuToggel(false) }}>{__('Roll Back', 'she-header')}</Link></li>

                    </ul>
                    <div className='she_ver_nd_sys_info'>
                        <p className='she_version'>{__('Version', 'she-header')} {tpae_version}</p> |
                        <a href={baseUrl + '/site-health.php'} target="_blank" rel="noopener noreferrer" className='tpae_system_info'>{__('System Info', 'she-header')}</a>
                    </div>
                </div>
                <div className='she_content_area'></div>
            </div>
            <div className='she_nav_bnner'>
                <p className='she_bnner_txt'>Get 1000+ Elementor Templates & Sections</p>
                <div className='she_dwd_sections'>
                    {plugin_status?.status === "active" || pluginActive ?

                        <a href={wdkit_Plugin_url()} className='she_dwd_btn' onClick={(e) => handleClick(e)}>{__('Open Templates', 'tpae')}</a>
                        :
                        <a className='she_dwd_btn' onClick={(e) => handleClick(e)}>{buttonText}</a>
                    }
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
    plugin_check: state.check_plugin.plugin_status_rx,
})

export default connect(get_redux)(NavBox);