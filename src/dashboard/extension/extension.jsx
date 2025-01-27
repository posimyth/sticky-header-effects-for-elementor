import React, { useEffect, useState } from 'react';
import axios from 'axios';
import extension_json from './extension.list.jsx'
import './extension.scss';
import { connect } from 'react-redux';
import NotFound from './not_found.jsx'
import { __ } from '@wordpress/i18n';

const Extension = (props) => {

    var plugin_url = shed_data.shed_url;
    var nonce = shed_data.nonce;
    var ajax_url = shed_data.ajax_url;
    // var pro_plugin = tpae_db_object.tpae_pro;
    var pro_plugin = '1';
    var plugin_status = props.plugin_check;

    // const free_pro = tpae_db_object?.tpae_pro == '1' ? true : false;
    const free_pro = '1';
    const [EnableWidget, setEnableWidget] = useState([]);
    const [FreePro, setFreePro] = useState('all');
    const [search_filter, setsearch_filter] = useState('');
    const [ActiveTab, setActiveTab] = useState('');
    const [Nextercheck, SetNexter] = useState(false);
    const [NShowPopup, NexterPopup] = useState(false);
    const [NexterBtn, SetNexterBtn] = useState('Enable Extensions for WordPress');
    const [activeIndex, setActiveIndex] = useState(0);
    const [Wlabel, setWlabel] = useState(0);

    useEffect(() => {

        const nexterStatus = plugin_status.find((check_status) => check_status.name === 'nexter-extension' && check_status.status === 'active');

        if (nexterStatus) {
            SetNexter(true);
        } else {
            SetNexter(false);
        }
    }, [plugin_status]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [FreePro, search_filter]);

    useEffect(() => {

        document.addEventListener('scroll', () => {
            /**code for activate tabs in menu  */
            let plus_special = document.getElementById('she_utitlies')?.getBoundingClientRect()?.top - 350;
            let plus_global = document.getElementById('she_performance')?.getBoundingClientRect()?.top - 350;
            let plus_columns = document.getElementById('she_security')?.getBoundingClientRect()?.top - 350;
            let plus_effect = document.getElementById('she_admin_Interface')?.getBoundingClientRect()?.top - 350;

            if (plus_effect < 0) {
                setActiveTab('she_admin_Interface')
            } else if (plus_columns < 0) {
                setActiveTab('she_security')
            } else if (plus_global < 0) {
                setActiveTab('she_performance')
            } else if (plus_special < 0) {
                setActiveTab('she_utitlies')
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

    const closePopup = () => {
        NexterPopup(false);
    };

    const nexter_poup_accordian = [
        {
            question: __('What is Nexter Extension? Why Do I Need an Extra Plugin for These Features?', 'she-header'),
            answer: __('Nexter Extension is a unique set of features provided through a separate plugin. We’ve made it independent from The Plus Addons for Elementor widgets. While The Plus Addons focuses on extra Elementor widgets, Nexter Extension helps you prepare your WordPress site for production with better security and higher performance.', 'she-header'),
        },
        {
            question: __('Do I Need to Pay Anything to Use These Features?', 'she-header'),
            answer: __('Most of the Nexter Extensions are free, while only some are paid. These paid features are included for Pro users of The Plus Addons for Elementor. All Pro users also unlock Nexter Extension Pro.', 'she-header'),
        },
        {
            question: __('Will This Affect My Site’s Performance?', 'she-header'),
            answer: __('Not at all! These are great features designed to make your WordPress website more secure, faster, and smarter, saving you a lot of time. It’s a single plugin that eliminates multiple hassles, making it easy to create a powerful WordPress website.', 'she-header'),
        }
    ];

    const CheckIcon = (<svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0C6.15661 -9.78424e-09 6.80679 0.129329 7.41342 0.380602C8.02004 0.631876 8.57124 1.00017 9.03553 1.46447C9.49983 1.92876 9.86812 2.47995 10.1194 3.08658C10.3707 3.69321 10.5 4.34339 10.5 5C10.5 5.65661 10.3707 6.30679 10.1194 6.91342C9.86812 7.52004 9.49983 8.07124 9.03553 8.53553C8.57124 8.99983 8.02004 9.36812 7.41342 9.6194C6.80679 9.87067 6.15661 10 5.5 10C4.17392 10 2.90215 9.47322 1.96447 8.53553C1.02678 7.59785 0.5 6.32608 0.5 5C0.5 3.67392 1.02678 2.40215 1.96447 1.46447C2.90215 0.526784 4.17392 1.97602e-08 5.5 0ZM7.26667 3.47L4.875 5.86833L3.71167 4.705C3.67293 4.66626 3.62694 4.63553 3.57632 4.61456C3.5257 4.5936 3.47145 4.58281 3.41667 4.58281C3.36188 4.58281 3.30763 4.5936 3.25701 4.61456C3.2064 4.63553 3.16041 4.66626 3.12167 4.705C3.08293 4.74374 3.0522 4.78973 3.03123 4.84035C3.01026 4.89096 2.99947 4.94521 2.99947 5C2.99947 5.05479 3.01026 5.10904 3.03123 5.15965C3.0522 5.21027 3.08293 5.25626 3.12167 5.295L4.58 6.75333C4.6187 6.79214 4.66468 6.82292 4.71531 6.84393C4.76593 6.86493 4.82019 6.87574 4.875 6.87574C4.92981 6.87574 4.98407 6.86493 5.03469 6.84393C5.08532 6.82292 5.1313 6.79214 5.17 6.75333L7.85667 4.05833C7.93246 3.97964 7.97432 3.87433 7.97322 3.76508C7.97212 3.65583 7.92815 3.55138 7.85078 3.47423C7.77342 3.39709 7.66884 3.35341 7.55959 3.35262C7.45034 3.35183 7.34514 3.39398 7.26667 3.47Z" fill="white" /></svg>);

    const InstallPopup = () => {
        return (
           <>
            <div className="she-nexter-content">
                <div className="she-nexter-title">{__('Build a Strong, Secure and High-Performance Website with 22+ Unique WordPress Extensions from Nexter.', 'she-header')}</div>
                <div className="she-features-ndic">
                    <ul><li>{CheckIcon}{__('22+ Power up Extensions', 'she-header')}</li>
                        <li>{CheckIcon}{__('Works with Popular WordPress Themes', 'she-header')}</li>
                        <li>{CheckIcon}{__('Performance Booster', 'she-header')}</li>
                        <li>{CheckIcon}{__('Security Hardener', 'she-header')}</li></ul>
                </div>
                <div className="she-install-activate">
                    <a className='she-nexter-btn' onClick={(e) => handleClick(e)}>{NexterBtn}</a>
                    <a href='https://nexterwp.com/nexter-extension/features/?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings' target="_blank" rel="noopener noreferrer" className='she-nexter-learn'>{__('Learn More', 'she-header')}</a>
                </div>
            </div>
            <div className='she-nexter-group'></div>
           </>

        )
    }

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleClick = async () => {

        SetNexterBtn('Instaling Nexter');

        let form = new FormData();
        form.append('action', 'she_dashboard_ajax_call');
        form.append('nonce', nonce);
        form.append('type', 'she_plugin_install');
        form.append('slug', 'nexter-extension/nexter-extension.php');
        form.append('name', 'nexter-extension');

        var response = await axios.post(ajax_url, form);
        var data = response.data;

        if (data.success) {
            SetNexter(true);
            NexterPopup(false)
            SetNexterBtn('Instaling Success');
        } else {
            SetNexterBtn('Instaling Failed');
        }
    };

    const nexter_Plugin_url = () => {
        const fullUrl = window.location.href;
        const baseUrl = fullUrl.split('wp-admin/')[0] + 'wp-admin/';
        return baseUrl + 'admin.php?page=nexter_welcome';
    }

    const plus_extension_data = () => {
        var null_check = true;
        return (
            <>
                {
                    extension_json.plus_extension.map((categoryKey, index) => {

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
                                                <span className='she-ttl-wid-num'>{extension_options.length} {__('Total Extensions', 'she-header')} </span>
                                                {/* •
                                            <span className='tpae-active-widget-numbers'>{Active_widget_count(extension_options, 'extras_elements') + __(' Active')}</span> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='she-wid-box-cover'>
                                        {extension_options.map((data, index) => {
                                            return (
                                                <div className={`she-part-wid-mng-box ${(data?.tag == 'pro') && !free_pro ? 'she-widget-pro' : ''}`} key={index}>
                                                    <div className='she-wid-in-left'>
                                                        <div className={`she-nexter-tag`}>{data.tag}</div>
                                                        <div className='she-wid-name'>{data.label}
                                                            {pro_plugin == '0' && data.status &&
                                                                <span className={`she-wid-sm-tag she-wid-name-hint-text tp-tag-color-${data.status}`}>{data.status}</span>
                                                            }
                                                            {pro_plugin == '1' && data.pro_status &&
                                                                <span className={`she-wid-sm-tag she-wid-name-hint-text tp-tag-color-${data.pro_status}`}>{data.pro_status}</span>
                                                            }
                                                        </div>
                                                            <div className='she-abt-wid-qik-link-cov'>
                                                                <a href={'https://nexterwp.com/nexter-extension/features/?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings'} target="_blank" rel="noopener noreferrer" className='she-nexter-link'>{__('Live Demo', 'she-header')}</a>
                                                                {(data.docUrl) &&
                                                                    <span> | </span>
                                                                }
                                                                {data.docUrl &&
                                                                    <a href={data.docUrl + '?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings'} target="_blank" rel="noopener noreferrer" className='she-nexter-link'>{__('Read Docs', 'she-header')}</a>
                                                                }
                                                            </div>
                                                    </div>
                                                    <div className='she-widget-inner-toggle'>
                                                        <label className="she-nexter-tgl-btn-cover">

                                                            {!Nextercheck ? (
                                                                <div className="she-nexter-download-template" onClick={() => NexterPopup(true)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                                                                        <path d="M6.79116 0.0356951C6.73488 0.0567989 6.64344 0.117764 6.58951 0.171695C6.40192 0.359281 6.41364 0.117764 6.41364 3.55762V6.61995L5.93999 6.1463C5.43351 5.64216 5.34441 5.57885 5.14979 5.57651C4.97862 5.57651 4.86372 5.62575 4.73241 5.75237C4.53779 5.9423 4.49558 6.16271 4.60814 6.40892C4.63627 6.47223 4.92 6.77236 5.50151 7.35154C6.26592 8.11126 6.37144 8.20739 6.50744 8.2707C6.8193 8.41608 7.16164 8.41843 7.48054 8.28008C7.60481 8.22381 7.71736 8.12298 8.48646 7.36091C9.11956 6.7325 9.36342 6.47457 9.39625 6.39954C9.45487 6.27292 9.45722 6.06657 9.40329 5.93995C9.31887 5.73361 9.08205 5.57651 8.86398 5.57651C8.65295 5.57885 8.57322 5.63513 8.06205 6.1463L7.58605 6.61995V3.55762C7.58605 0.117764 7.59778 0.359281 7.41019 0.171695C7.2484 0.00755787 7.01392 -0.0416832 6.79116 0.0356951Z" fill="#19191B" />
                                                                        <path d="M1.37381 5.45235C1.22843 5.50394 1.08305 5.65635 1.03147 5.81111C0.996296 5.91897 0.991606 5.98463 1.00568 6.266C1.05726 7.38214 1.3996 8.42558 2.00926 9.33302C2.46181 10.0107 3.15118 10.6743 3.83353 11.0987C5.46083 12.1069 7.44924 12.2781 9.24302 11.5676C10.0074 11.2652 10.6827 10.8056 11.3018 10.1701C12.3405 9.10323 12.9267 7.75027 12.9947 6.26131C13.0111 5.86738 12.9807 5.74311 12.8259 5.58835C12.5961 5.35856 12.235 5.35856 12.0052 5.58835C11.8763 5.71732 11.8364 5.84628 11.82 6.20973C11.8012 6.5849 11.7543 6.90145 11.6629 7.24145C11.2103 8.93909 9.84564 10.2756 8.14096 10.6883C5.57104 11.312 2.98001 9.75275 2.32112 7.18517C2.23905 6.86159 2.16871 6.35745 2.16871 6.07842C2.16871 5.86035 2.11477 5.71028 1.99284 5.58835C1.83105 5.42421 1.59657 5.37497 1.37381 5.45235Z" fill="#19191B" />
                                                                    </svg>
                                                                </div>
                                                            ) : (
                                                                <a className='she-nexter-redirect' href={nexter_Plugin_url()} target="_blank" rel="noopener noreferrer">
                                                                    <div className="she-nexter-download-template">
                                                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path fillRule="evenodd" clipRule="evenodd" d="M8.75033 2.33268C8.42816 2.33268 8.16699 2.07152 8.16699 1.74935C8.16699 1.42718 8.42816 1.16602 8.75033 1.16602H12.2502H12.2503C12.3751 1.16602 12.4908 1.20521 12.5856 1.27196C12.7356 1.37752 12.8337 1.55199 12.8337 1.74935V5.24935C12.8337 5.57152 12.5725 5.83268 12.2503 5.83268C11.9282 5.83268 11.667 5.57152 11.667 5.24935V3.15756L6.24606 8.57849C6.01825 8.8063 5.6489 8.8063 5.4211 8.57849C5.19329 8.35069 5.19329 7.98134 5.4211 7.75354L10.842 2.33268H8.75033ZM2.91699 4.08268C2.76228 4.08268 2.61391 4.14414 2.50451 4.25354C2.39512 4.36293 2.33366 4.51131 2.33366 4.66602V11.0827C2.33366 11.2374 2.39512 11.3858 2.50451 11.4952C2.61391 11.6046 2.76228 11.666 2.91699 11.666H9.33366C9.48837 11.666 9.63674 11.6046 9.74614 11.4952C9.85553 11.3858 9.91699 11.2374 9.91699 11.0827V7.58268C9.91699 7.26052 10.1782 6.99935 10.5003 6.99935C10.8225 6.99935 11.0837 7.26052 11.0837 7.58268V11.0827C11.0837 11.5468 10.8993 11.9919 10.5711 12.3201C10.2429 12.6483 9.79779 12.8327 9.33366 12.8327H2.91699C2.45286 12.8327 2.00774 12.6483 1.67956 12.3201C1.35137 11.9919 1.16699 11.5468 1.16699 11.0827V4.66602C1.16699 4.20189 1.35137 3.75677 1.67956 3.42858C2.00774 3.10039 2.45286 2.91602 2.91699 2.91602H6.41699C6.73916 2.91602 7.00033 3.17718 7.00033 3.49935C7.00033 3.82152 6.73916 4.08268 6.41699 4.08268H2.91699Z" fill="black" />
                                                                        </svg>
                                                                    </div>
                                                                </a>
                                                            )}
                                                        </label>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {NShowPopup && (
                                            <div className="she-nexter-popup">
                                                <div className="she-nexter-bg">
                                                    <div className="she-model-close" onClick={closePopup}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L12 13.4142L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4142 12L18.7071 6.70711Z" fill="white" fillOpacity="0.8" /></svg></div>
                                                    <InstallPopup />
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
            <div className={`she-widgets-inner-main she-main-container ${props?.tpae_dashboard_data?.success ? '' : 'she-skeleton'}`}>
                <div className='she-section-heading-cover'>
                    <h3 className='she-section-heading'>{__('Extensions', 'she-header')}</h3>
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
                    <div className='she-cat-strip-cov-main theplus-second-strip'>

                        <div className='she-cate-btns-cover'>
                            <span className={ActiveTab == 'she_utitlies' ? 'she-category-btn she-act-cat' : 'she-category-btn'} onClick={() => { scroll_to_id('#she_utitlies') }}>{__('Utitlies', 'she-header')}</span>
                            <span className={ActiveTab == 'she_performance' ? 'she-category-btn she-act-cat' : 'she-category-btn'} onClick={() => { scroll_to_id('#she_performance') }}>{__('Performance', 'she-header')}</span>
                            <span className={ActiveTab == 'she_security' ? 'she-category-btn she-act-cat' : 'she-category-btn'} onClick={() => { scroll_to_id('#she_security') }}>{__('Security', 'she-header')}</span>
                            <span className={ActiveTab == 'she_admin_Interface' ? 'she-category-btn she-act-cat' : 'she-category-btn'} onClick={() => { scroll_to_id('#she_admin_Interface') }}>{__('Admin Interface', 'she-header')}</span>
                        </div>
                    </div>
                </div>
                {plus_extension_data()}
            </div>
        </>
    )
}

const get_redux = state => ({
    plugin_check: state.check_plugin.plugin_status_rx,
    tpae_dashboard_data: state.Dashboard_data.db_rx,
})


export default connect(get_redux)(Extension)