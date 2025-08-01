import React, { useEffect, useState } from 'react';
import axios from 'axios';
import extension_json from './header_widgets_list.jsx'
import './header_widgets.scss';
import { connect } from 'react-redux';
import NotFound from './not_found.jsx'
import { __ } from '@wordpress/i18n';

const Header_widgets = (props) => {

    var plugin_url = shed_data.shed_url;
    var nonce = shed_data.nonce;
    var ajax_url = shed_data.ajax_url;
    var pro_plugin = '1';
    var plugin_status = props.plugin_check;

    const free_pro = '1';
    const [FreePro, setFreePro] = useState('all');
    const [search_filter, setsearch_filter] = useState('');
    const [ActiveTab, setActiveTab] = useState('');
    const [Tpaecheck, SetTpae] = useState(false);
    const [Wdkitcheck, SetWdkit] = useState(false);
    const [ElementPro, SetElementPro] = useState(false);
    const [TheplusSowPopup, ThePlusPopup] = useState(false);
    const [WdkitPopup, SetWdkitPopup] = useState(false);
    const [TpDwonloadBtn, SetDwonloadBtn] = useState('Enable Free Navigation Menu');
    const [buttonText, setButtonText] = useState('Install WDesignKit');
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {

        const tpae_Status = plugin_status.find((check_status) => check_status.name === 'the-plus-addons-for-elementor-page-builder' && check_status.status === 'active');

        if (tpae_Status) {
            SetTpae(true);
        } else {
            SetTpae(false);
        }

        const wdkit_Status = plugin_status.find((check_status) => check_status.name === 'wdesignkit' && check_status.status === 'active');

        if (wdkit_Status) {
            SetWdkit(true);
        } else {
            SetWdkit(false);
        }

        const element_pro = plugin_status.find((check_status) => check_status.name === 'elementor-pro' && check_status.status === 'active');

        if (element_pro) {
            SetElementPro(true);
        } else {
            SetElementPro(false);
        }

    }, [plugin_status]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [FreePro, search_filter]);

    useEffect(() => {

        document.addEventListener('scroll', () => {
            /**code for activate tabs in menu  */
            let plus_special = document.getElementById('she_elementor')?.getBoundingClientRect()?.top - 350;
            let plus_global = document.getElementById('she_theplus_addon')?.getBoundingClientRect()?.top - 350;
            let plus_columns = document.getElementById('she_wdesign_kit')?.getBoundingClientRect()?.top - 350;

            if (plus_columns < 0) {
                setActiveTab('she_wdesign_kit')
            } else if (plus_global < 0) {
                setActiveTab('she_theplus_addon')
            } else if (plus_special < 0) {
                setActiveTab('she_elementor')
            }
        })
    })

    const scroll_to_id = async (id) => {

        let html_top = document.querySelector(id).getBoundingClientRect().top + window.pageYOffset - 300;

        window.scrollTo({
            top: html_top,
            behavior: "smooth"
        });
    }

    const closePopup = (type) => {
        if (type == 'tpae') {
            ThePlusPopup(false);
        }
        if (type == 'wdkit') {
            SetWdkitPopup(false);
        }
    };

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const tpae_poup_accordian = [
        {
            question: __('Why Do I Need The Plus Addons for Elementor?', 'she-header'),
            answer: __('The Elementor Free version does not come with a free Navigation Menu widget. Therefore, by installing The Plus Addons, you can create your Header Menu easily.', 'she-header'),
        },
    ];

    const Theplus_Popup = () => {
        return (
            <>
                <div className="she-tpae-content">
                    <div className="she-tpae-title">{__('Get a Free Elementor Navigation Menu Widget with The Plus Addons for Elementor.', 'she-header')}</div>
                    <div className="she-install-activate">
                        <a className='she-tpae-btn' onClick={(e) => handle_plugin(e, 'tpae')}>{TpDwonloadBtn}</a>
                        <a href='https://theplusaddons.com/?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=stickyheader' target="_blank" rel="noopener noreferrer" className='she-nexter-learn'>{__('Learn More', 'she-header')}</a>
                    </div>
                    <div className="she-tpae-accordion">
                        {tpae_poup_accordian.map((item, index) => (
                            <div key={index} className="she-tpae-accordion-item">
                                <div className={`she-tpae-accordio-content ${activeIndex === index ? "she-tpae-content-opan" : ""}`} onClick={() => handleToggle(index)}>
                                    <div className="she-tpae-accd-qui">{item.question}</div>
                                    <div className='she-tpae-pm-lable'>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {activeIndex !== index && (<path d="M10 4.16675V15.8334" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />)}
                                            <path d="M4.16797 10H15.8346" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div className={`she-tpae-accordion-ans ${activeIndex === index ? "opan-accordion" : ""}`}>{item.answer}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    }

    const wdkit_poup_accordian = [
        {
            question: "Why do I need to install the WDesignKit plugin to access widgets?",
            answer: "WDesignKit plugin offers access to over 100+ exclusive widgets designed for Elementor, Gutenberg, and Bricks Builder."
        },
        {
            question: "Are these widgets customizable?",
            answer: "WDesignKit plugin offers access to over 100+ exclusive widgets."
        },
        {
            question: "Will the plugin impact my site’s speed?",
            answer: "Widgets designed for Elementor, Gutenberg, and Bricks Builder."
        }
    ];

    const Wdesign_popup = () => {
        return (
            <div className="she-wdkit-popup-content">
                <div className="she-wdkit-popup-title">Get Access to 50+ More Unique Elementor Widgets from WDesignKit</div>
                <div className="she-wdkit-features-dic">
                    <ul>
                        <li>Get Access to 1000+ Elementor Templates</li>
                        <li>50+ Unique Elementor Widgets</li>
                        <li>Custom Elementor Widget Builder</li>
                        <li>100% Customizable Widgets</li>
                    </ul>
                </div>
                <div className="she-wdkit-install-activate">
                    <a className='she-wdkit-install-btn' onClick={(e) => handle_plugin(e, 'wdkit')}>{buttonText}</a>
                    <a className='she-wdkit-learn-more' href='https://wdesignkit.com/?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=stickyheader' target='_blank' rel="noopener noreferrer">Learn More</a>
                </div>

                <div className="she-wdkit-popup-accordion">
                    {wdkit_poup_accordian.map((item, index) => (
                        <div key={index} className="she-wdkit-accordion-item">
                            <div className={`she-wdkit-accordio-content ${activeIndex === index ? "she-tpae-content-opan" : ""}`} onClick={() => handleToggle(index)}>
                                <div className="she-wdkit-accd-qui">{item.question}</div>
                                <div>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {activeIndex !== index && (<path d="M10 4.16675V15.8334" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />)}
                                        <path d="M4.16797 10H15.8346" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className={`she-wdkit-accd-ans ${activeIndex === index ? "opan-accordion" : ""}`}>{item.answer}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const handle_plugin = async (e, type) => {


        var she_slug = '';
        var she_name = '';

        if (type == 'tpae') {

            SetDwonloadBtn('Installing TPAE');
            she_slug = 'the-plus-addons-for-elementor-page-builder/theplus_elementor_addon.php';
            she_name = 'the-plus-addons-for-elementor-page-builder';

        } else if (type == 'wdkit') {

            setButtonText('Installing WDesignKit');

            she_slug = 'wdesignkit/wdesignkit.php';
            she_name = 'wdesignkit';

        }

        let form = new FormData();
        form.append('action', 'she_dashboard_ajax_call');
        form.append('nonce', nonce);
        form.append('type', 'she_plugin_install');
        form.append('slug', she_slug);
        form.append('name', she_name);

        var response = await axios.post(ajax_url, form);
        var data = response.data;

        if (data.success) {
            if (type == 'tpae') {
                SetTpae(true);
                ThePlusPopup(false)
                SetDwonloadBtn('Installing Success');
            }
            if (type == 'wdkit') {
                SetWdkit(true);
                SetWdkitPopup(false)
                setButtonText('Installing Success');
            }
        } else {
            if (type == 'tpae') {
                SetDwonloadBtn('Installing Failed');
            }
            if (type == 'wdkit') {
                setButtonText('Installing Failed');
            }
        }
    };

    const preview_Plugin_url = (type) => {

        const fullUrl = window.location.href;
        const baseUrl = fullUrl.split('wp-admin/')[0] + 'wp-admin/';

        if (type == 'tpae') {
            return baseUrl + 'admin.php?page=theplus_welcome_page#/widgets';
        } else if (type == 'wdkit') {
            return baseUrl + 'admin.php?page=wdesign-kit#/widget-browse?search=menu';
        } else if (type == 'elementor') {
            return baseUrl + 'admin.php?page=elementor-element-manager';
        } else if (type == 'elementor_free') {
            return baseUrl + 'admin.php?page=elementor-settings#tab-experiments';
        }

    }

    const she_product_tag = (tag, type) => {

        if (type == 'tpae') {

            var tpae_bg = '';
            var tpae_color = '';

            if (tag == 'pro') {
                tpae_bg = '#8072fc'
                tpae_color = '#fff'
            } else {
                tpae_bg = '#f4f2ff'
                tpae_color = '#8072fc'
            }

            return {
                backgroundColor: tpae_bg,
                border: '1px solid #e5e0ff',
                color: tpae_color
            }
        } else if (type == 'wdkit') {
            return {
                backgroundColor: '#f3d2e4',
                border: '1px solid #f3d2e4',
                color: '#c22076'
            }
        }

    }

    const plus_plugin_data = () => {
        var null_check = true;
        return (
            <>
                {
                    extension_json.plugin_widgets.map((categoryKey, index) => {

                        const extension_options = categoryKey.widgets.filter((data) => {
                            if ('all' == FreePro) {
                                return data;
                            } else if (data?.tag == FreePro) {
                                return data;
                            }
                        }).filter((data) => {
                            if (search_filter == '') {
                                return data;
                            } else if (data?.label.toLocaleLowerCase().includes(search_filter.toLocaleLowerCase())) {
                                return data;
                            }
                        })

                        if (extension_options.length > 0) {

                            null_check = false;

                            return (
                                <div className='she-catwise-wid-manage-cov' key={index}>

                                    <div className='she-catwise-wid-mancover'>
                                        <div className='she-wid-h-infogrp'>
                                            <h3 className='she-wid-cat-h' id={'she_' + categoryKey.name}>
                                                {categoryKey.label}
                                            </h3>
                                            <div className='she-cat-qik-info'>
                                                <span className='she-ttl-wid-num'>{extension_options.length} {__('Total Widgets', 'she-header')} </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='she-wid-box-cover'>
                                        {extension_options.map((data, index) => {
                                            return (
                                                <div className={`she-part-wid-mng-box ${(data?.tag == 'pro') && !free_pro ? 'she-widget-pro' : ''}`} key={index}>
                                                    <div className='she-wid-in-left'>
                                                        <div className={`she-widgets-tag${data?.tag == 'pro' ? '-pro' : ''}`} style={she_product_tag(data?.tag, data?.type)}>{data.tag}</div>
                                                        <div className='she-wid-name'>{data.label}
                                                            {pro_plugin == '0' && data.status &&
                                                                <span className={`she-wid-sm-tag she-wid-name-hint-text tp-tag-color-${data.status}`}>{data.status}</span>
                                                            }
                                                            {pro_plugin == '1' && data.pro_status &&
                                                                <span className={`she-wid-sm-tag she-wid-name-hint-text tp-tag-color-${data.pro_status}`}>{data.pro_status}</span>
                                                            }
                                                        </div>
                                                        <div className='she-abt-wid-qik-link-cov'>
                                                            {data.demoUrl && (
                                                                <a
                                                                    href={data.demoUrl + '?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=stickyheader'}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className='she-widgets-link'
                                                                >
                                                                    {__('Live Demo', 'she-header')}
                                                                </a>
                                                            )}

                                                            {data.docUrl && data.demoUrl && <span> | </span>}

                                                            {data.docUrl && (
                                                                <a
                                                                    href={data.docUrl + '?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=stickyheader'}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className='she-widgets-link'
                                                                >
                                                                    {__('Read Docs', 'she-header')}
                                                                </a>
                                                            )}

                                                            {(data.videoUrl && (data.demoUrl || data.docUrl)) && <span> | </span>}

                                                            {data.videoUrl && (
                                                                <a
                                                                    href={data.videoUrl + '?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=stickyheader'}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className='she-widgets-link'
                                                                >
                                                                    {__('Video', 'she-header')}
                                                                </a>
                                                            )}
                                                        </div>

                                                    </div>
                                                    <div className='she-widget-inner-toggle'>
                                                        <label className="she-tgl-btn-cover">

                                                            {data?.type === 'tpae' && (
                                                                !Tpaecheck ? (
                                                                    <div className="she-widgets-download-template" onClick={() => ThePlusPopup(true)}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                                                                            <path d="M6.79116 0.0356951C6.73488 0.0567989 6.64344 0.117764 6.58951 0.171695C6.40192 0.359281 6.41364 0.117764 6.41364 3.55762V6.61995L5.93999 6.1463C5.43351 5.64216 5.34441 5.57885 5.14979 5.57651C4.97862 5.57651 4.86372 5.62575 4.73241 5.75237C4.53779 5.9423 4.49558 6.16271 4.60814 6.40892C4.63627 6.47223 4.92 6.77236 5.50151 7.35154C6.26592 8.11126 6.37144 8.20739 6.50744 8.2707C6.8193 8.41608 7.16164 8.41843 7.48054 8.28008C7.60481 8.22381 7.71736 8.12298 8.48646 7.36091C9.11956 6.7325 9.36342 6.47457 9.39625 6.39954C9.45487 6.27292 9.45722 6.06657 9.40329 5.93995C9.31887 5.73361 9.08205 5.57651 8.86398 5.57651C8.65295 5.57885 8.57322 5.63513 8.06205 6.1463L7.58605 6.61995V3.55762C7.58605 0.117764 7.59778 0.359281 7.41019 0.171695C7.2484 0.00755787 7.01392 -0.0416832 6.79116 0.0356951Z" fill="#19191B" />
                                                                            <path d="M1.37381 5.45235C1.22843 5.50394 1.08305 5.65635 1.03147 5.81111C0.996296 5.91897 0.991606 5.98463 1.00568 6.266C1.05726 7.38214 1.3996 8.42558 2.00926 9.33302C2.46181 10.0107 3.15118 10.6743 3.83353 11.0987C5.46083 12.1069 7.44924 12.2781 9.24302 11.5676C10.0074 11.2652 10.6827 10.8056 11.3018 10.1701C12.3405 9.10323 12.9267 7.75027 12.9947 6.26131C13.0111 5.86738 12.9807 5.74311 12.8259 5.58835C12.5961 5.35856 12.235 5.35856 12.0052 5.58835C11.8763 5.71732 11.8364 5.84628 11.82 6.20973C11.8012 6.5849 11.7543 6.90145 11.6629 7.24145C11.2103 8.93909 9.84564 10.2756 8.14096 10.6883C5.57104 11.312 2.98001 9.75275 2.32112 7.18517C2.23905 6.86159 2.16871 6.35745 2.16871 6.07842C2.16871 5.86035 2.11477 5.71028 1.99284 5.58835C1.83105 5.42421 1.59657 5.37497 1.37381 5.45235Z" fill="#19191B" />
                                                                        </svg>
                                                                    </div>
                                                                ) : (
                                                                    <a className='she-plugin-redirect' href={preview_Plugin_url('tpae')} target="_blank" rel="noopener noreferrer">
                                                                        <div className="she-widgets-download-template">
                                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fillRule="evenodd" clipRule="evenodd" d="M8.75033 2.33268C8.42816 2.33268 8.16699 2.07152 8.16699 1.74935C8.16699 1.42718 8.42816 1.16602 8.75033 1.16602H12.2502H12.2503C12.3751 1.16602 12.4908 1.20521 12.5856 1.27196C12.7356 1.37752 12.8337 1.55199 12.8337 1.74935V5.24935C12.8337 5.57152 12.5725 5.83268 12.2503 5.83268C11.9282 5.83268 11.667 5.57152 11.667 5.24935V3.15756L6.24606 8.57849C6.01825 8.8063 5.6489 8.8063 5.4211 8.57849C5.19329 8.35069 5.19329 7.98134 5.4211 7.75354L10.842 2.33268H8.75033ZM2.91699 4.08268C2.76228 4.08268 2.61391 4.14414 2.50451 4.25354C2.39512 4.36293 2.33366 4.51131 2.33366 4.66602V11.0827C2.33366 11.2374 2.39512 11.3858 2.50451 11.4952C2.61391 11.6046 2.76228 11.666 2.91699 11.666H9.33366C9.48837 11.666 9.63674 11.6046 9.74614 11.4952C9.85553 11.3858 9.91699 11.2374 9.91699 11.0827V7.58268C9.91699 7.26052 10.1782 6.99935 10.5003 6.99935C10.8225 6.99935 11.0837 7.26052 11.0837 7.58268V11.0827C11.0837 11.5468 10.8993 11.9919 10.5711 12.3201C10.2429 12.6483 9.79779 12.8327 9.33366 12.8327H2.91699C2.45286 12.8327 2.00774 12.6483 1.67956 12.3201C1.35137 11.9919 1.16699 11.5468 1.16699 11.0827V4.66602C1.16699 4.20189 1.35137 3.75677 1.67956 3.42858C2.00774 3.10039 2.45286 2.91602 2.91699 2.91602H6.41699C6.73916 2.91602 7.00033 3.17718 7.00033 3.49935C7.00033 3.82152 6.73916 4.08268 6.41699 4.08268H2.91699Z" fill="black" />
                                                                            </svg>
                                                                        </div>
                                                                    </a>
                                                                )
                                                            )}

                                                            {data?.type === 'wdkit' && (
                                                                !Wdkitcheck ? (
                                                                    <div className="she-widgets-download-template" onClick={() => SetWdkitPopup(true)}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                                                                            <path d="M6.79116 0.0356951C6.73488 0.0567989 6.64344 0.117764 6.58951 0.171695C6.40192 0.359281 6.41364 0.117764 6.41364 3.55762V6.61995L5.93999 6.1463C5.43351 5.64216 5.34441 5.57885 5.14979 5.57651C4.97862 5.57651 4.86372 5.62575 4.73241 5.75237C4.53779 5.9423 4.49558 6.16271 4.60814 6.40892C4.63627 6.47223 4.92 6.77236 5.50151 7.35154C6.26592 8.11126 6.37144 8.20739 6.50744 8.2707C6.8193 8.41608 7.16164 8.41843 7.48054 8.28008C7.60481 8.22381 7.71736 8.12298 8.48646 7.36091C9.11956 6.7325 9.36342 6.47457 9.39625 6.39954C9.45487 6.27292 9.45722 6.06657 9.40329 5.93995C9.31887 5.73361 9.08205 5.57651 8.86398 5.57651C8.65295 5.57885 8.57322 5.63513 8.06205 6.1463L7.58605 6.61995V3.55762C7.58605 0.117764 7.59778 0.359281 7.41019 0.171695C7.2484 0.00755787 7.01392 -0.0416832 6.79116 0.0356951Z" fill="#19191B" />
                                                                            <path d="M1.37381 5.45235C1.22843 5.50394 1.08305 5.65635 1.03147 5.81111C0.996296 5.91897 0.991606 5.98463 1.00568 6.266C1.05726 7.38214 1.3996 8.42558 2.00926 9.33302C2.46181 10.0107 3.15118 10.6743 3.83353 11.0987C5.46083 12.1069 7.44924 12.2781 9.24302 11.5676C10.0074 11.2652 10.6827 10.8056 11.3018 10.1701C12.3405 9.10323 12.9267 7.75027 12.9947 6.26131C13.0111 5.86738 12.9807 5.74311 12.8259 5.58835C12.5961 5.35856 12.235 5.35856 12.0052 5.58835C11.8763 5.71732 11.8364 5.84628 11.82 6.20973C11.8012 6.5849 11.7543 6.90145 11.6629 7.24145C11.2103 8.93909 9.84564 10.2756 8.14096 10.6883C5.57104 11.312 2.98001 9.75275 2.32112 7.18517C2.23905 6.86159 2.16871 6.35745 2.16871 6.07842C2.16871 5.86035 2.11477 5.71028 1.99284 5.58835C1.83105 5.42421 1.59657 5.37497 1.37381 5.45235Z" fill="#19191B" />
                                                                        </svg>
                                                                    </div>
                                                                ) : (
                                                                    <a className='she-plugin-redirect' href={preview_Plugin_url('wdkit')} target="_blank" rel="noopener noreferrer">
                                                                        <div className="she-widgets-download-template">
                                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fillRule="evenodd" clipRule="evenodd" d="M8.75033 2.33268C8.42816 2.33268 8.16699 2.07152 8.16699 1.74935C8.16699 1.42718 8.42816 1.16602 8.75033 1.16602H12.2502H12.2503C12.3751 1.16602 12.4908 1.20521 12.5856 1.27196C12.7356 1.37752 12.8337 1.55199 12.8337 1.74935V5.24935C12.8337 5.57152 12.5725 5.83268 12.2503 5.83268C11.9282 5.83268 11.667 5.57152 11.667 5.24935V3.15756L6.24606 8.57849C6.01825 8.8063 5.6489 8.8063 5.4211 8.57849C5.19329 8.35069 5.19329 7.98134 5.4211 7.75354L10.842 2.33268H8.75033ZM2.91699 4.08268C2.76228 4.08268 2.61391 4.14414 2.50451 4.25354C2.39512 4.36293 2.33366 4.51131 2.33366 4.66602V11.0827C2.33366 11.2374 2.39512 11.3858 2.50451 11.4952C2.61391 11.6046 2.76228 11.666 2.91699 11.666H9.33366C9.48837 11.666 9.63674 11.6046 9.74614 11.4952C9.85553 11.3858 9.91699 11.2374 9.91699 11.0827V7.58268C9.91699 7.26052 10.1782 6.99935 10.5003 6.99935C10.8225 6.99935 11.0837 7.26052 11.0837 7.58268V11.0827C11.0837 11.5468 10.8993 11.9919 10.5711 12.3201C10.2429 12.6483 9.79779 12.8327 9.33366 12.8327H2.91699C2.45286 12.8327 2.00774 12.6483 1.67956 12.3201C1.35137 11.9919 1.16699 11.5468 1.16699 11.0827V4.66602C1.16699 4.20189 1.35137 3.75677 1.67956 3.42858C2.00774 3.10039 2.45286 2.91602 2.91699 2.91602H6.41699C6.73916 2.91602 7.00033 3.17718 7.00033 3.49935C7.00033 3.82152 6.73916 4.08268 6.41699 4.08268H2.91699Z" fill="black" />
                                                                            </svg>
                                                                        </div>
                                                                    </a>
                                                                )
                                                            )}


                                                            {data?.type === 'elementor' && data?.name === 'she_wodpress_menu' && (

                                                                !ElementPro ? (
                                                                    <a className='she-plugin-redirect' href={'https://elementor.com/pro/'} target="_blank" rel="noopener noreferrer">
                                                                        <div className="she-widgets-download-template">
                                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fillRule="evenodd" clipRule="evenodd" d="M8.75033 2.33268C8.42816 2.33268 8.16699 2.07152 8.16699 1.74935C8.16699 1.42718 8.42816 1.16602 8.75033 1.16602H12.2502H12.2503C12.3751 1.16602 12.4908 1.20521 12.5856 1.27196C12.7356 1.37752 12.8337 1.55199 12.8337 1.74935V5.24935C12.8337 5.57152 12.5725 5.83268 12.2503 5.83268C11.9282 5.83268 11.667 5.57152 11.667 5.24935V3.15756L6.24606 8.57849C6.01825 8.8063 5.6489 8.8063 5.4211 8.57849C5.19329 8.35069 5.19329 7.98134 5.4211 7.75354L10.842 2.33268H8.75033ZM2.91699 4.08268C2.76228 4.08268 2.61391 4.14414 2.50451 4.25354C2.39512 4.36293 2.33366 4.51131 2.33366 4.66602V11.0827C2.33366 11.2374 2.39512 11.3858 2.50451 11.4952C2.61391 11.6046 2.76228 11.666 2.91699 11.666H9.33366C9.48837 11.666 9.63674 11.6046 9.74614 11.4952C9.85553 11.3858 9.91699 11.2374 9.91699 11.0827V7.58268C9.91699 7.26052 10.1782 6.99935 10.5003 6.99935C10.8225 6.99935 11.0837 7.26052 11.0837 7.58268V11.0827C11.0837 11.5468 10.8993 11.9919 10.5711 12.3201C10.2429 12.6483 9.79779 12.8327 9.33366 12.8327H2.91699C2.45286 12.8327 2.00774 12.6483 1.67956 12.3201C1.35137 11.9919 1.16699 11.5468 1.16699 11.0827V4.66602C1.16699 4.20189 1.35137 3.75677 1.67956 3.42858C2.00774 3.10039 2.45286 2.91602 2.91699 2.91602H6.41699C6.73916 2.91602 7.00033 3.17718 7.00033 3.49935C7.00033 3.82152 6.73916 4.08268 6.41699 4.08268H2.91699Z" fill="black" />
                                                                            </svg>
                                                                        </div>
                                                                    </a>
                                                                ) : (
                                                                    <a className='she-plugin-redirect' href={preview_Plugin_url('elementor')} target="_blank" rel="noopener noreferrer">
                                                                        <div className="she-widgets-download-template">
                                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fillRule="evenodd" clipRule="evenodd" d="M8.75033 2.33268C8.42816 2.33268 8.16699 2.07152 8.16699 1.74935C8.16699 1.42718 8.42816 1.16602 8.75033 1.16602H12.2502H12.2503C12.3751 1.16602 12.4908 1.20521 12.5856 1.27196C12.7356 1.37752 12.8337 1.55199 12.8337 1.74935V5.24935C12.8337 5.57152 12.5725 5.83268 12.2503 5.83268C11.9282 5.83268 11.667 5.57152 11.667 5.24935V3.15756L6.24606 8.57849C6.01825 8.8063 5.6489 8.8063 5.4211 8.57849C5.19329 8.35069 5.19329 7.98134 5.4211 7.75354L10.842 2.33268H8.75033ZM2.91699 4.08268C2.76228 4.08268 2.61391 4.14414 2.50451 4.25354C2.39512 4.36293 2.33366 4.51131 2.33366 4.66602V11.0827C2.33366 11.2374 2.39512 11.3858 2.50451 11.4952C2.61391 11.6046 2.76228 11.666 2.91699 11.666H9.33366C9.48837 11.666 9.63674 11.6046 9.74614 11.4952C9.85553 11.3858 9.91699 11.2374 9.91699 11.0827V7.58268C9.91699 7.26052 10.1782 6.99935 10.5003 6.99935C10.8225 6.99935 11.0837 7.26052 11.0837 7.58268V11.0827C11.0837 11.5468 10.8993 11.9919 10.5711 12.3201C10.2429 12.6483 9.79779 12.8327 9.33366 12.8327H2.91699C2.45286 12.8327 2.00774 12.6483 1.67956 12.3201C1.35137 11.9919 1.16699 11.5468 1.16699 11.0827V4.66602C1.16699 4.20189 1.35137 3.75677 1.67956 3.42858C2.00774 3.10039 2.45286 2.91602 2.91699 2.91602H6.41699C6.73916 2.91602 7.00033 3.17718 7.00033 3.49935C7.00033 3.82152 6.73916 4.08268 6.41699 4.08268H2.91699Z" fill="black" />
                                                                            </svg>
                                                                        </div>
                                                                    </a>
                                                                )
                                                            )}

                                                            {data?.type === 'elementor' && data?.name === 'she_menu' && (
                                                                !ElementPro ? (
                                                                    <a className='she-plugin-redirect' href={'https://elementor.com/pro/'} target="_blank" rel="noopener noreferrer">
                                                                        <div className="she-widgets-download-template">
                                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fillRule="evenodd" clipRule="evenodd" d="M8.75033 2.33268C8.42816 2.33268 8.16699 2.07152 8.16699 1.74935C8.16699 1.42718 8.42816 1.16602 8.75033 1.16602H12.2502H12.2503C12.3751 1.16602 12.4908 1.20521 12.5856 1.27196C12.7356 1.37752 12.8337 1.55199 12.8337 1.74935V5.24935C12.8337 5.57152 12.5725 5.83268 12.2503 5.83268C11.9282 5.83268 11.667 5.57152 11.667 5.24935V3.15756L6.24606 8.57849C6.01825 8.8063 5.6489 8.8063 5.4211 8.57849C5.19329 8.35069 5.19329 7.98134 5.4211 7.75354L10.842 2.33268H8.75033ZM2.91699 4.08268C2.76228 4.08268 2.61391 4.14414 2.50451 4.25354C2.39512 4.36293 2.33366 4.51131 2.33366 4.66602V11.0827C2.33366 11.2374 2.39512 11.3858 2.50451 11.4952C2.61391 11.6046 2.76228 11.666 2.91699 11.666H9.33366C9.48837 11.666 9.63674 11.6046 9.74614 11.4952C9.85553 11.3858 9.91699 11.2374 9.91699 11.0827V7.58268C9.91699 7.26052 10.1782 6.99935 10.5003 6.99935C10.8225 6.99935 11.0837 7.26052 11.0837 7.58268V11.0827C11.0837 11.5468 10.8993 11.9919 10.5711 12.3201C10.2429 12.6483 9.79779 12.8327 9.33366 12.8327H2.91699C2.45286 12.8327 2.00774 12.6483 1.67956 12.3201C1.35137 11.9919 1.16699 11.5468 1.16699 11.0827V4.66602C1.16699 4.20189 1.35137 3.75677 1.67956 3.42858C2.00774 3.10039 2.45286 2.91602 2.91699 2.91602H6.41699C6.73916 2.91602 7.00033 3.17718 7.00033 3.49935C7.00033 3.82152 6.73916 4.08268 6.41699 4.08268H2.91699Z" fill="black" />
                                                                            </svg>
                                                                        </div>
                                                                    </a>
                                                                ) : (
                                                                    <a className='she-plugin-redirect' href={preview_Plugin_url('elementor_free')} target="_blank" rel="noopener noreferrer">
                                                                        <div className="she-widgets-download-template">
                                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fillRule="evenodd" clipRule="evenodd" d="M8.75033 2.33268C8.42816 2.33268 8.16699 2.07152 8.16699 1.74935C8.16699 1.42718 8.42816 1.16602 8.75033 1.16602H12.2502H12.2503C12.3751 1.16602 12.4908 1.20521 12.5856 1.27196C12.7356 1.37752 12.8337 1.55199 12.8337 1.74935V5.24935C12.8337 5.57152 12.5725 5.83268 12.2503 5.83268C11.9282 5.83268 11.667 5.57152 11.667 5.24935V3.15756L6.24606 8.57849C6.01825 8.8063 5.6489 8.8063 5.4211 8.57849C5.19329 8.35069 5.19329 7.98134 5.4211 7.75354L10.842 2.33268H8.75033ZM2.91699 4.08268C2.76228 4.08268 2.61391 4.14414 2.50451 4.25354C2.39512 4.36293 2.33366 4.51131 2.33366 4.66602V11.0827C2.33366 11.2374 2.39512 11.3858 2.50451 11.4952C2.61391 11.6046 2.76228 11.666 2.91699 11.666H9.33366C9.48837 11.666 9.63674 11.6046 9.74614 11.4952C9.85553 11.3858 9.91699 11.2374 9.91699 11.0827V7.58268C9.91699 7.26052 10.1782 6.99935 10.5003 6.99935C10.8225 6.99935 11.0837 7.26052 11.0837 7.58268V11.0827C11.0837 11.5468 10.8993 11.9919 10.5711 12.3201C10.2429 12.6483 9.79779 12.8327 9.33366 12.8327H2.91699C2.45286 12.8327 2.00774 12.6483 1.67956 12.3201C1.35137 11.9919 1.16699 11.5468 1.16699 11.0827V4.66602C1.16699 4.20189 1.35137 3.75677 1.67956 3.42858C2.00774 3.10039 2.45286 2.91602 2.91699 2.91602H6.41699C6.73916 2.91602 7.00033 3.17718 7.00033 3.49935C7.00033 3.82152 6.73916 4.08268 6.41699 4.08268H2.91699Z" fill="black" />
                                                                            </svg>
                                                                        </div>
                                                                    </a>
                                                                )
                                                            )}
                                                        </label>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        {TheplusSowPopup && (
                                            <div className="she-tpae-popup" onClick={() => closePopup('tpae')}>
                                                <div className="she-tpae-popup-bg" onClick={(e) => e.stopPropagation()}>
                                                    <div className='she-tpae-popup-close'>
                                                        <div className="she-tpae-model-close" onClick={() => closePopup('tpae')}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L12 13.4142L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4142 12L18.7071 6.70711Z" fill="white" fillOpacity="0.8" /></svg></div>
                                                    </div>
                                                    <Theplus_Popup />
                                                </div>
                                            </div>
                                        )}


                                        {WdkitPopup && (
                                            <div className="she-tpae-wdkit-popup" onClick={() => closePopup('wdkit')}>
                                                <div className="she-wdkit-content-bg" onClick={(e) => e.stopPropagation()}>
                                                    <div className="she-wdkit-popup-close" onClick={() => closePopup('wdkit')}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L12 13.4142L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4142 12L18.7071 6.70711Z" fill="white" fillOpacity="0.8" /></svg></div>
                                                    <div className='she-wdkit-popup-wdk-body'>
                                                        <Wdesign_popup />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div >
                            );
                        }
                    })
                }
                {null_check && <NotFound />}
            </>
        );
    }

    return (
        <>
            <div className={`she-widgets-inner-main she-main-container ${props?.she_dashboard_data?.success ? '' : 'she-skeleton'}`}>
                <div className='she-section-heading-cover'>
                    <h3 className='she-section-heading'>{__('Header Widgets', 'she-header')}</h3>
                </div>
                <div className='she-widget-categories'>
                    <div className='she-cat-strip-cov-main'>

                        <div className='she-cate-btns-cover'>
                            <span className={`she-category-btn ${FreePro == 'all' ? 'she-act-cat' : ''}`} onClick={() => { setFreePro('all') }}>{__('All', 'she-header')}</span>
                            <span className={`she-category-btn ${FreePro == 'free' ? 'she-act-cat' : ''}`} onClick={() => { setFreePro('free') }}>{__('Free', 'she-header')}</span>
                            <span className={`she-category-btn ${FreePro == 'pro' ? 'she-act-cat' : ''}`} onClick={() => { setFreePro('pro') }}>{__('Pro', 'she-header')}</span>
                        </div>

                        <div className='she-right-search-and-btn-group'>
                            <div className='she-widget-search-box-cover'>
                                <img className='she-search-icon' src={plugin_url + 'assets/svg/search_icon.svg'} draggable={false} />
                                <input type='text' placeholder='Search' className='she-widget-search-box' onChange={(e) => { setsearch_filter(e.target.value) }} />
                            </div>
                        </div>
                    </div>
                    <div className='she-cat-strip-cov-main she-second-strip'>

                        <div className='she-cate-btns-cover'>
                            <span className={ActiveTab == 'she_elementor' ? 'she-category-btn she-act-cat' : 'she-category-btn'} onClick={() => { scroll_to_id('#she_elementor') }}>{__('Elementor', 'she-header')}</span>
                            <span className={ActiveTab == 'she_theplus_addon' ? 'she-category-btn she-act-cat' : 'she-category-btn'} onClick={() => { scroll_to_id('#she_theplus_addon') }}>{__('The Plus Addons for Elementor', 'she-header')}</span>
                            <span className={ActiveTab == 'she_wdesign_kit' ? 'she-category-btn she-act-cat' : 'she-category-btn'} onClick={() => { scroll_to_id('#she_wdesign_kit') }}>{__('WDesignKit', 'she-header')}</span>
                        </div>
                    </div>
                </div>
                {plus_plugin_data()}
            </div>
        </>
    )
}

const get_redux = state => ({
    plugin_check: state.check_plugin.plugin_status_rx,
    she_dashboard_data: state.Dashboard_data.db_rx,
})

export default connect(get_redux)(Header_widgets)