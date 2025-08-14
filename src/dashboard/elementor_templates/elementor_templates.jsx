import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import './elementor_templates.scss'
import { __ } from '@wordpress/i18n';
const { Fragment } = wp.element

const ElementorTemplates = (props) => {

    var plugin_url = shed_data.shed_url;
    var nonce = shed_data.nonce;
    var ajax_url = shed_data.ajax_url;
    var wdk_api = shed_data.shed_wdkit_url;
    var api_url = wdk_api + 'api/front/getfilterbrowsetemplates';
    var she_card_bg = plugin_url + 'assets/images/theme_bulider/she-dummy-bg.png';
    var plugins = JSON.stringify([1014]);
    var she_wdkit_plugin = shed_data.shed_plugins;

    var api_body = {
        ParPage: 9,
        CurrentPage: 1,
        builder_req: 1001,
        temp_type_req: 'all',
        freepro_req: 'all',
        plugin_req: plugins,
    };

    const [template_list, settemplate_list] = useState([]);
    const [wdkit_skeleton, setwdkit_skeleton] = useState(true);
    const [ElementPro, SetElementPro] = useState(false);
    const [buttonText, setButtonText] = useState('Enable Templates');
    const [pluginActive, setPluginActive] = useState('');

    useEffect(() => {
        get_etemplates()
    }, [])

    useEffect(() => {
        if (she_wdkit_plugin) {
            const plugin_list = she_wdkit_plugin;
            if (plugin_list[1]?.status === 'active') {
                setPluginActive('hide');
            }else{
                setPluginActive('show');
            }            
        }
    }, []);

    var plugin_status_check = props.plugin_check;

    useEffect(() => {

        const element_pro = plugin_status_check.find((check_status) => check_status?.name === 'elementor-pro' && check_status.status === 'active');

        if (element_pro) {
            SetElementPro(true);
        } else {
            SetElementPro(false);
        }

        const Wdesign_kit = plugin_status_check.find((check_status) => check_status?.name === 'wdesignkit' && check_status.status === 'active');

        if (Wdesign_kit) {
            setPluginActive('hide');
        }

    }, [plugin_status_check]);

    const wdkit_template_url = (templateTitle) => {
        var fullUrl = window.location.href;
        var baseUrl = fullUrl.split('/admin.php')[0];

        const url = `${baseUrl}?page=wdesign-kit#/browse?search=${encodeURIComponent(templateTitle)}`;

        window.open(url, '_blank');
    }

    const wdkit_Plugin_url = () => {
        var fullUrl = window.location.href;
        var baseUrl = fullUrl.split('/admin.php')[0];

        var pluginId = '';

        if (ElementPro) {
            pluginId = '[1014,1003,1004]';
        } else {
            pluginId = '[1014,1003]';
        }

        const encodedPluginId = encodeURIComponent(pluginId);

        return baseUrl + '/admin.php?page=wdesign-kit#/browse?plugin=' + encodedPluginId;
    }

    const Wkit_template_Skeleton = () => {
        return (
            <div className='she-ele-temp-box she-skeleton'>
                <div className='she-ele-temp-cov-img-box'></div>
                <div className='she-ele-temp-detail'>
                    <h4 className='she-elementor-template-title she-in-sec-heading'>{__('Name Of the Template', 'she-header')}</h4>
                    <p target="_blank" className='she-ghost-btn'>{__('Live Preview', 'she-header')}</p>
                </div>
            </div>
        );
    }

    const get_etemplates = async () => {

        let form = new FormData();
        form.append('action', 'she_dashboard_ajax_call');
        form.append('nonce', nonce);
        form.append('type', 'she_api_call');
        form.append('method', 'POST');
        form.append('api_url', api_url);
        form.append('url_body', JSON.stringify(api_body));
        form.append('store', 'header_template');

        var response = await axios.post(ajax_url, form);
        var data = response.data;

        if (data.HTTP_CODE === 200 && data.posts) {
            settemplate_list(data.posts);

            setTimeout(() => {
                setwdkit_skeleton(false);
            }, 800);
        }
    }

    const [loaderVisible, setLoaderVisible] = useState(false);

    const handleClick = async () => {

        setButtonText('Installing WDesignKit');

        setLoaderVisible(true);

        let form = new FormData();
        form.append('action', 'she_dashboard_ajax_call');
        form.append('nonce', nonce);
        form.append('type', 'she_plugin_install');
        form.append('slug', 'wdesignkit/wdesignkit.php');
        form.append('name', 'wdesignkit');
        form.append('she_plugin', 'she_plugin');

        var response = await axios.post(ajax_url, form);
        var data = response.data;

        if (data.success) {
            setButtonText('Installed WDesignKit');
            setPluginActive('hide');
            setLoaderVisible(true);
        } else {
            setButtonText('Installation Failed');
            setLoaderVisible(false);
        }
    };

    const items = Array.from({ length: 9 });

    return (
        <div className={`she-ele-temp-inn-main she-main-container ${template_list?.length > 0 ? '' : 'she-skeleton'}`}>
            <div className='she-section-heading-cover'>
                <h3 className='she-section-heading'>{__('Header Templates', 'she-header')}</h3>

                <>
                    {pluginActive === 'show' && (
                        <div className='she-common-btn'>
                            <a className='she-purple-common-btn' onClick={(e) => handleClick(e)}>{buttonText}</a>
                        </div>
                    )}
                </>
            </div>

            <div className='she-element-temp-bx-cov-main'>
                {/* <h3 className='she-in-sec-heading'>{__('Import Pre-Designed Website Templates Made With Plus Widgets.', 'she-header')}</h3> */}

                {/* templates in grid view start */}

                <div className='she-ele-temp-grid-vbox'>

                    {wdkit_skeleton &&
                        items.map((data, index) => {
                            return (
                                <Wkit_template_Skeleton key={index} />
                            );
                        })
                    }

                    {template_list?.length > 0 && template_list.map((t_data, index) => {

                        return (
                            <div className='she-ele-temp-box' key={index}>
                                <div className='she-ele-temp-cov-img-box'>
                                    <img className='she-elementor-template-img' src={she_card_bg} draggable={false} />
                                    <img className='she-elementor-template-img' src={t_data.responsive_image[1].url} draggable={false} style={{ position: 'absolute' }} />
                                </div>
                                <div className='she-ele-temp-detail'>
                                    <h4 className='she-elementor-template-title she-in-sec-heading'>{t_data.title}</h4>
                                    {/* <span className='she-float-box-title'>{t_data.title}</span> */}
                                    {pluginActive ?
                                        <a onClick={(e) => wdkit_template_url(t_data.title)} target="_blank" className='she-ghost-btn'>{__('Download Template', 'she-header')}</a>
                                        :
                                        <a href={t_data.post_url + '?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=stickyheader'} target="_blank" className='she-ghost-btn'>{__('Live Preview', 'she-header')}</a>
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="she-btn-wrap">
                    {pluginActive ?
                        <a href={wdkit_Plugin_url()} target="_blank" rel="noopener noreferrer" className="she-common-btn">{__('Open Templates', 'she-header')}</a>
                        :
                        <a href="https://wdesignkit.com/templates?builder=1001" target="_blank" rel="noopener noreferrer" className="she-common-btn">{__('View More Website Templates', 'she-header')}</a>
                    }
                </div>
            </div>
        </div>
    )
}

const get_redux = state => ({
    plugin_check: state.check_plugin.plugin_status_rx,
})

export default connect(get_redux)(ElementorTemplates);