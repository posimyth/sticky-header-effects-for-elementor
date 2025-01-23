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
            <div className='tpae_navigation_cover'>
                <div className='tpae_logo_strip'>
                    <img className='tpae_main_logo' src={plugin_url + 'assets/svg/navbox/SHE_logo.svg'} />
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
                        <li><Link className={`${location.pathname == '/elementor_templates' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/elementor_templates" onClick={() => { setmenuToggel(false) }}>{__('Header Templates', 'tpebl')}</Link></li>
                        <li><Link className={`${location.pathname == '/theme_builder' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/theme_builder" onClick={() => { setmenuToggel(false) }}>{__('Elementor Theme Builder ', 'tpebl')}</Link></li>
                        <li><Link className={`${location.pathname == '/extension' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/extension" onClick={() => { setmenuToggel(false) }}>{__('Extensions', 'tpebl')}</Link></li>
                        <li><Link className={`${location.pathname == '/more_products' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/more_products" onClick={() => { setmenuToggel(false) }}>{__('More Products', 'tpebl')}</Link></li>
                        <li><Link className={`${location.pathname == '/rollback_plugin' ? 'tpae_navlink tpae_active_tab' : 'tpae_navlink'}`} to="/rollback_plugin" onClick={() => { setmenuToggel(false) }}>{__('Roll Back', 'tpebl')}</Link></li>

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