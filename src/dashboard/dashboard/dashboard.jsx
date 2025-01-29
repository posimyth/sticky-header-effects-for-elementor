import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './dashboard.scss';
import { connect } from 'react-redux';
import { __ } from '@wordpress/i18n';

const DashboardInnerMain = (props) => {


    var plugin_url = shed_data.shed_url;
    var nonce = shed_data.nonce;
    var ajax_url = shed_data.ajax_url;

    const slides = [
        {
            key: 'tpae',
            heading: __('Best Elementor Addon with 120+ Widgets', 'she-header'),
            subheading: __('', 'she-header'),
            buttonLabel: __('Install', 'she-header'),
            buttonLinkLabel: __('Learn More', 'she-header'),
            status: 'unavailable',
            learnLink: 'https://wdesignkit.com/?utm_source=wpbackend&utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings ',
            imgSrc: plugin_url + 'assets/images/banner/tpae.png',
            imgAlt: __('WdesignKit Image', 'she-header'),
            browseLink: '?page=wdesign-kit#/browse',
            bg_color: 'linear-gradient(rgba(109, 104, 254, 1),rgba(180, 70, 255, 1))',
            bt_color: '#FF5A6E',
            bt_txt_color: '#ffffff'
        },
        {
            key: 'nexter-theme',
            heading: __('Lightest Starter Theme for Page Builders', 'she-header'),
            subheading: __('Page Builders', 'she-header'),
            buttonLabel: __('Install Theme', 'she-header'),
            buttonLinkLabel: __('Theme Customizer', 'she-header'),
            status: 'unavailable',
            learnLink: 'https://nexterwp.com/nexter-theme?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings ',
            imgSrc: plugin_url + 'assets/images/banner/nexter-theme.png',
            imgAlt: __('Nexter Theme Image', 'she-header'),
            browseLink: 'customize.php?theme=nexter',
            bg_color: '#1717cc',
            bt_color: '#f12d2d',
            bt_txt_color: '#ffffff'
        },
        {
            key: 'wdesignkit',
            heading: __('Get 1000+ Pre-Designed WordPress Pages & Templates.', 'she-header'),
            subheading: __('WordPress Pages & Templates.', 'she-header'),
            buttonLabel: __('Install WDesignKit', 'she-header'),
            buttonLinkLabel: __('Open Templates', 'she-header'),
            status: 'unavailable',
            learnLink: 'https://wdesignkit.com/?utm_source=wpbackend&utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings ',
            imgSrc: plugin_url + 'assets/images/banner/wdesinKit.png',
            imgAlt: __('WdesignKit Image', 'she-header'),
            browseLink: '?page=wdesign-kit#/browse',
            bg_color: '#040483',
            bt_color: '#c22076',
            bt_txt_color: '#ffffff'
        },
        {
            key: 'nexter-extension',
            heading: __('50+ WordPress Extensions to Make Site More Secure, Performant & Smart', 'she-header'),
            subheading: __('Site More Secure, Performant & Smart', 'she-header'),
            buttonLabel: __('Enable Extension', 'she-header'),
            buttonLinkLabel: __('Extension Setting', 'she-header'),
            status: 'unavailable',
            learnLink: 'https://nexterwp.com/nexter-extension?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings ',
            imgSrc: plugin_url + 'assets/images/banner/nexter-extension.png',
            imgAlt: __('Nexter Theme Image', 'she-header'),
            browseLink: 'edit.php?post_type=nxt_builder',
            bg_color: '#1717cc',
            bt_color: '#f12d2d',
            bt_txt_color: '#ffffff'
        },
        {
            key: 'uichemy',
            heading: __('Convert Figma to WordPress in Minutes', 'she-header'),
            subheading: __('Site More Secure, Performant & Smart', 'she-header'),
            buttonLabel: __('Install UiChemy', 'she-header'),
            buttonLinkLabel: __('UiChemy Setting', 'she-header'),
            status: 'unavailable',
            learnLink: 'https://uichemy.com?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings ',
            imgSrc: plugin_url + 'assets/images/banner/uichemy.png',
            imgAlt: __('UiChemy', 'she-header'),
            browseLink: '?page=uichemy-welcome',
            bg_color: 'linear-gradient(180deg,#000 11%,#421eb2)',
            bt_color: '#e3ed5d',
            bt_txt_color: '#000000'
        },
        {
            key: 'the-plus-addons-for-block-editor',
            heading: __('90+ Best WordPress Blocks for Gutenberg Editor', 'she-header'),
            subheading: __('Site More Secure, Performant & Smart', 'she-header'),
            buttonLabel: __('Enable Blocks', 'she-header'),
            buttonLinkLabel: __('Open Nexter', 'she-header'),
            status: 'unavailable',
            learnLink: 'https://nexterwp.com/nexter-blocks/',
            imgSrc: plugin_url + 'assets/images/banner/nexter-new.png',
            imgAlt: __('Nexter Theme Image', 'she-header'),
            browseLink: 'edit.php?page=nexter_welcome_page',
            bg_color: 'rgba(23, 23, 204, 1)',
            bt_color: 'rgba(241, 45, 45, 1)',
            bt_txt_color: 'rgba(255, 255, 255, 1)'
        },
    ];

    const [slideLeft, setSlideLeft] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userImage, setUserImage] = useState('');
    const [tpaeuser_name, setTpaeuser_name] = useState('');
    const [tpaeuser_email, setTpaeuser_email] = useState('');
    const [subscribe_btn, setSubscribe_btn] = useState('Subscribe Now');
    const [ErrorTooltip, setErrorTooltip] = useState({ 'tpaeName': false, 'tpaeEmail': false });
    const [plugin_detail, setplugin_detail] = useState(slides);
    const stopSlider = useRef('');

    const [whatsnew, setwhatsnew] = useState([]);

    const [hoveredIndex, setHoveredIndex] = useState(5);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        const stars = document.querySelectorAll('.tpae-star path');
        stars.forEach((star, index) => {
            if (selectedIndex !== null && index <= selectedIndex) {
                star.setAttribute('fill', '#F9B744');
            } else if (hoveredIndex !== null && index <= hoveredIndex) {
                star.setAttribute('fill', '#F9B744');
            } else {
                star.setAttribute('fill', '#C9C7CE');
            }
        });
    }, [hoveredIndex, selectedIndex]);

    useEffect(() => {
        setUserName(props.tpae_dashboard_data?.user_name || '');
        setUserEmail(props.tpae_dashboard_data?.user_email || '');
        setUserImage(props.tpae_dashboard_data?.user_image || '');
        setTpaeuser_name(props.tpae_dashboard_data?.user_name || '');
        setTpaeuser_email(props.tpae_dashboard_data?.user_email || '');
    }, [props.tpae_dashboard_data]);



    useEffect(() => {

        let plugin_slider = [...slides];
        plugin_slider.map((plugin) => {

            if (props.plugin_check.length > 0) {
                let index = props.plugin_check.findIndex((pl_data) => pl_data.name == plugin.key)

                let pl_detail = props.plugin_check[index];
                plugin.status = pl_detail?.status ? pl_detail.status : 'unavailable';
            }
        })

        setplugin_detail(plugin_slider);

    }, [props.plugin_check]);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, [slideIndex]);

    var ratingSvg = [
        {
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 30 30"><path fill="#C9C7CE" fillRule="evenodd" d="m17.208 7.611 1.808 2.51 2.5.774c3.096.956 3.837 1.346 3.837 2.02 0 .29-.884 1.51-1.965 2.71l-1.965 2.182.204 3.308c.273 4.441.273 4.442-3.856 3.108l-3.095-1-3.095 1c-4.128 1.334-4.129 1.333-3.855-3.108l.204-3.308-1.965-2.182C4.885 14.425 4 13.194 4 12.888c0-.635 1.472-1.362 4.375-2.164 1.822-.504 1.888-.558 3.791-3.162 1.547-2.114 2.068-2.63 2.586-2.555.421.06 1.285.976 2.456 2.604Zm-5.365 6.56c-.306.495.382 1.062.79.653.343-.342.129-.975-.33-.975-.143 0-.35.145-.46.322Zm4.745 0c-.306.495.382 1.062.79.653.343-.342.129-.975-.33-.975-.143 0-.35.145-.46.322Zm-3.32 3.005c-.367.177-.668.45-.668.605 0 .163.22.182.52.044.285-.132.985-.24 1.556-.24.571 0 1.272.108 1.557.24.297.137.52.12.52-.041 0-.38-1.357-.974-2.165-.95-.36.012-.953.166-1.32.342Z" clipRule="evenodd" /></svg>
        },
        {
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 30 30"><path fill="#C9C7CE" fillRule="evenodd" d="M17.15 7.619c1.92 2.616 1.924 2.62 4.075 3.292 2.852.892 3.781 1.39 3.781 2.03 0 .292-.877 1.503-1.948 2.693l-1.948 2.163.203 3.304c.27 4.39.27 4.389-3.682 3.093l-2.966-.972-3.094 1c-4.127 1.334-4.127 1.334-3.854-3.098l.203-3.3-1.96-2.177C4.882 14.451 4 13.233 4 12.941c0-.654.987-1.177 3.81-2.015 2.397-.712 2.784-1.026 4.842-3.94C13.578 5.676 14.256 5 14.642 5c.394 0 1.212.854 2.507 2.619Zm-5.326 6.578c-.304.494.381 1.06.79.651.34-.341.127-.972-.33-.972-.143 0-.35.144-.46.321Zm4.734 0c-.305.494.38 1.06.79.651.34-.341.127-.972-.33-.972-.144 0-.35.144-.46.321Z" clipRule="evenodd" /></svg>
        },
        {
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 30 30"><path fill="#C9C7CE" fillRule="evenodd" d="M13.57 5.88c-.406.549-1.286 1.752-1.955 2.674-1.1 1.517-1.399 1.73-3.134 2.243C5.299 11.74 4 12.375 4 12.993c0 .307.898 1.556 1.996 2.774l1.995 2.216-.208 3.212c-.282 4.35-.259 4.367 3.926 3.015l3.146-1.017 3.147 1.017c4.194 1.355 4.223 1.333 3.938-3.027l-.21-3.212 1.99-2.21c1.095-1.215 1.99-2.451 1.99-2.747 0-.685-.752-1.082-3.905-2.056l-2.549-.787-1.844-2.552C15.28 4.671 14.67 4.395 13.57 5.88Zm-.658 8.412c.31.503-.388 1.08-.805.663-.348-.348-.13-.991.336-.991.146 0 .357.147.469.328Zm4.824 0c.31.503-.388 1.08-.804.663-.348-.348-.13-.991.336-.991.146 0 .357.147.468.328Zm-1.071 2.989c0 .167-.804.301-1.81.301-1.005 0-1.809-.134-1.809-.301 0-.168.804-.302 1.81-.302 1.005 0 1.809.134 1.809.302Z" clipRule="evenodd" /></svg>
        },
        {
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 30 30"><path fill="#C9C7CE" fillRule="evenodd" d="m12.162 7.543-1.93 2.628-2.763.827c-1.519.454-2.929.964-3.133 1.133-.701.58-.366 1.316 1.59 3.488l1.96 2.176-.206 3.307c-.278 4.452-.272 4.458 3.867 3.12l3.095-1 3.096 1c4.129 1.334 4.13 1.334 3.855-3.108l-.203-3.309 1.965-2.182c1.08-1.2 1.965-2.419 1.965-2.71 0-.67-.68-1.027-3.812-2l-2.527-.783-1.82-2.516c-1.133-1.568-2.054-2.55-2.444-2.608-.49-.072-1.049.483-2.556 2.537Zm.569 6.627c.305.495-.382 1.062-.791.652-.343-.342-.128-.975.33-.975.144 0 .35.146.46.323Zm4.745 0c.306.495-.382 1.062-.79.652-.343-.342-.129-.975.33-.975.143 0 .35.146.46.323Zm-3.09 3.159c.43.074 1.056-.012 1.39-.191.336-.18.68-.212.767-.072.187.302-1.098.934-1.9.934-.754 0-2.077-.618-2.077-.97 0-.154.234-.18.52-.058.285.122.87.283 1.3.357Z" clipRule="evenodd" /></svg>
        },
        {
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 30 30"><path fill="#C9C7CE" fillRule="evenodd" d="M15.61 5.707c.319.37 1.23 1.536 2.027 2.59 1.438 1.904 1.469 1.925 4.584 2.996 2.096.72 3.168 1.241 3.229 1.569.05.27-.8 1.507-1.887 2.75l-1.978 2.258.359 3.187c.5 4.446.47 4.47-3.873 3.16l-3.273-.986-2.874.958c-4.115 1.37-4.086 1.392-4.086-3.04v-3.613l-1.965-2.082C4.74 14.25 3.95 13.16 4.003 12.872c.063-.34 1.098-.846 3.226-1.578l3.132-1.077 1.444-2.068c2.455-3.516 2.73-3.693 3.805-2.442Zm-4.03 8.314c-.625.69-.39 1.171.294.603.368-.306.545-.306.913 0 .685.568.92.087.294-.603-.299-.33-.636-.601-.75-.601-.114 0-.452.27-.75.6Zm5.092 0c-.625.69-.39 1.171.294.603.365-.303.547-.304.906-.006.608.504.59-.117-.021-.728-.584-.584-.526-.59-1.179.13Zm-3.443 3.096c0 .573.99 1.395 1.68 1.395.767 0 1.915-.818 1.915-1.365 0-.329-.43-.432-1.797-.432-1.306 0-1.798.11-1.798.402Z" clipRule="evenodd" /></svg>
        },
    ];

    const install_widgets = async (key, index) => {

        stopSlider.current = true;
        let updatedLabels = [...plugin_detail];
        updatedLabels[index].buttonLabel = 'Installing..';
        setplugin_detail(updatedLabels);

        var ajax_url = shed_data.ajax_url;
        var tp_slug = '';
        var tp_widgets_name = '';
        if ('tpae' === key) {
            tp_slug = 'the-plus-addons-for-elementor-page-builder/theplus-elementor-addon.php'
            tp_widgets_name = 'the-plus-addons-for-elementor-page-builder';
        } else if ('wdesignkit' === key) {
            tp_slug = 'wdesignkit/wdesignkit.php'
            tp_widgets_name = 'wdesignkit';
        } else if ('uichemy' === key) {
            tp_slug = 'uichemy/uichemy.php'
            tp_widgets_name = 'uichemy';
        } else if ('nexter-extension' === key) {
            tp_slug = 'nexter-extension/nexter-extension.php'
            tp_widgets_name = 'nexter-extension';
        } else if ('the-plus-addons-for-block-editor' === key) {
            tp_slug = 'the-plus-addons-for-block-editor/the-plus-addons-for-block-editor.php'
            tp_widgets_name = 'the-plus-addons-for-block-editor';
        } else if ('nexter-theme' === key) {
            var form = new FormData();
            form.append('action', 'she_dashboard_ajax_call');
            form.append('nonce', nonce);
            form.append('type', 'she_theme_install');
            form.append('name', 'nexter');
        }

        if ('wdesignkit' === key || 'uichemy' === key || 'nexter-extension' === key || 'the-plus-addons-for-block-editor' === key || 'tpae' === key) {

            var form = new FormData();
            form.append('action', 'she_dashboard_ajax_call');
            form.append('nonce', nonce);
            form.append('type', 'she_plugin_install');
            form.append('slug', tp_slug);
            form.append('name', tp_widgets_name);
        }

        var response = await axios.post(ajax_url, form);

        if (response.data.success) {
            let old_data = [...plugin_detail];
            old_data[index].status = 'active';
            setplugin_detail(old_data);
        }

        setTimeout(() => {
            stopSlider.current = false;
        }, 2000);
    }

    const Notification_validation = async (e) => {

        let OriginalOBJ = ErrorTooltip;
    
        if (!tpaeuser_name.trim() || !tpaeuser_email.trim()) {

            var newOBJ = {
                'tpaeName': false,
                'tpaeEmail': false
            };

            if (!tpaeuser_name.trim()) {
                newOBJ = Object.assign({}, newOBJ, { 'tpaeName': true })
            }

            if (!tpaeuser_email.trim()) {
                newOBJ = Object.assign({}, newOBJ, { 'tpaeEmail': true })
            }

            setErrorTooltip(newOBJ);

            setTimeout(() => {
                setErrorTooltip(OriginalOBJ)
            }, 3000);

            return false;

        } else if (!(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(tpaeuser_email))) {
            let newOBJ = {
                'tpaeName': false,
                'tpaeEmail': true
            };

            setErrorTooltip(newOBJ);

            setTimeout(() => {
                setErrorTooltip(OriginalOBJ)
            }, 3000);

            return false;
        }

        let btn = e.target;
        setSubscribe_btn('. . .');
        btn.style.pointerEvents = 'none';
        const encodedName = encodeURIComponent(tpaeuser_name);
        const encodedEmail = encodeURIComponent(tpaeuser_email);

        const welcomeEmailUrl = `https://store.posimyth.com/?fluentcrm=1&route=contact&hash=30275c78-0cf5-42f1-adb0-32901bb25b90&full_name=${encodedName}&email=${encodedEmail}`;

        setTpaeuser_email('');
        setTpaeuser_name('');

        const response = await fetch(welcomeEmailUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost/',
            },
            mode: 'no-cors',
        });

        if (response) {
            setSubscribe_btn('Submited !');

            setTimeout(() => {
                setSubscribe_btn('Subscribe Now');
                btn.removeAttribute('style');
            }, 2000);
        }
    }

    const whats_new_btn = async () => {

        setSlideLeft(true);

        let form = new FormData();
        form.append('action', 'tpae_dashboard_ajax_call');
        form.append('type', 'tpae_transient_manage');
        form.append('nonce', nonce);
        form.append('key', 'tp_dashboard_overview');
        form.append('operation', 'get');

        var response = await axios.post(ajax_url, form);

        if (response?.data?.data) {
            setwhatsnew(response.data.data);
        }

    }

    const nextSlide = () => {
        if (!stopSlider.current) {
            setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }
    };

    const currentSlide = (n) => {
        setSlideIndex(n - 1);
    };

    return (
        <div className={`she_dash_inner_main she-main-container ${props?.tpae_dashboard_data?.success ? '' : 'she-skeleton'}`}>
            <div className='she-section-heading-cover'>
                <h3 className='she-section-heading'>{__('Dashboard', 'she-header')}</h3>
            </div>

            <div className='she_wlcm_sec_cover'>
                <div className='she_wlcm_sec_in'>
                    <div className='she_user_img_wn'>
                        <div className='she_user_img_cover'>
                            <img className='she_user_img' src={userImage || plugin_url + 'assets/images/tp-placeholder.jpg'} draggable={false} />
                            {/* {tpae_pro == '1' &&
                                <span className='tpae-pro-check'>
                                    <img src={plugin_url + 'assets/svg/premium_icon.svg'} draggable={false} />
                                </span>
                            } */}
                        </div>
                        <h3 className='she_user_name'>{__('Welcome,', 'she-header')} {userName || '...'}</h3>
                    </div>
                    <div className='tpae_whats_new' onClick={() => whats_new_btn()}>
                        {props.tpae_dashboard_data?.whatsnew?.data?.length > 0 &&
                            <span className='tpae_whats_new_count'>{props.tpae_dashboard_data.whatsnew.data.length}</span>
                        }
                        <span className='tpae_whats_new_txt'>{__("What's New?")}</span>
                    </div>
                </div>

                <div className='she_slide_form_sec'>
                    <div className='she_numinfo_wdkit_cover'>
                        <div className='she_numeric_info_cover'>
                            <div className='she_numeric_card'>
                                <div className='she_sm_abt_num'>{__('Watch How it Works ', 'she-header')}</div>
                                <div className='shw_arrow'>
                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 18.0518L18 6.05176M18 6.05176H10M18 6.05176V14.0518" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className='she_product_slider'>
                            {props?.tpae_dashboard_data?.success ?
                                <div className="slideshow-container">
                                    {plugin_detail.map((slide, index) => (
                                        <div className={`she_main_slider slide_animation ${index === slideIndex ? 'active' : ''}`} key={index} style={{ background: slide.bg_color }}>
                                            <div className='she-slider-text-content'>
                                                <h3 className="she_banner_heading">{slide.heading}</h3>
                                                <div className="she_nxt_wdesignkit_btn_group">
                                                    <div className="she_install_wdesignkit_btn" style={{ background: slide.bt_color }}>
                                                        {slide?.status == 'active' ?
                                                            <a target="_blank" href={slide?.browseLink} rel="noopener noreferrer" style={{ color: slide.bt_txt_color }}>
                                                                {slide.buttonLinkLabel}
                                                            </a>
                                                            :
                                                            <button style={{ color: slide.bt_txt_color }} onClick={() => install_widgets(slide.key, index)}>
                                                                {slide.buttonLabel}
                                                            </button>
                                                        }
                                                    </div>
                                                    <a className="she_learn_btn_link" target="_blank" rel="noopener noreferrer" href={slide.learnLink}> Learn More </a>
                                                </div>
                                            </div>
                                            <img className='she_slider_image' src={slide.imgSrc} alt={`Slide ${index + 1}`} />
                                        </div>
                                    ))}
                                    <div className='she_slider_dot'>
                                        {slides.map((_, index) => (
                                            <span
                                                className={`dot ${index === slideIndex ? 'active' : ''}`}
                                                onClick={() => currentSlide(index + 1)}
                                                key={index}
                                            ></span>
                                        ))}
                                    </div>
                                </div>
                                :
                                <div className='she-slideshow-skeleton'></div>
                            }
                        </div>
                    </div>
                    <div className='she_sub_form_cover'>
                        <h3 className='she_subscribe_form_h'>{__('Stay Update with Elementor News & Plugin Updates.', 'she-header')}</h3>
                        <span className='she-name-container'>

                            <input
                                className='she_subscribe_input'
                                type='text'
                                value={!tpaeuser_name ? userName : tpaeuser_name}
                                onChange={(e) => { setTpaeuser_name(e.target.value); setErrorTooltip({ 'tpaeName': false, 'tpaeEmail': false }) }}
                                placeholder={__('Your Name', 'she-header')} />
                            {
                                ErrorTooltip.tpaeName &&
                                <span className='she-username-tooltip'>{__('Please enter valid Name', 'she-header')}</span>
                            }
                        </span>
                        <span className='she-name-container'>
                            <input
                                className='she_subscribe_input'
                                type='email'
                                value={!tpaeuser_email ? userEmail : tpaeuser_email}
                                onChange={(e) => { setTpaeuser_email(e.target.value); setErrorTooltip({ 'tpaeName': false, 'tpaeEmail': false }) }}
                                placeholder={__('Your Email', 'she-header')} />
                            {ErrorTooltip.tpaeEmail &&
                                <span className='she-username-tooltip'>{__('Please enter valid email', 'she-header')}</span>
                            }
                        </span>
                        <a className='she_subscribe_btn' onClick={(e) => { Notification_validation(e) }}>{subscribe_btn}</a>
                    </div>
                </div>
            </div>
            <div className='she_qik_infocrd_main'>
                <div className='she_qikinfo_grp_cover'>
                    <div className='she_qik_infocrd_cover she_docs'>
                        <h4 className='she_qik_info_crd_title'>{__('Documentation', 'she-header')}</h4>
                        <a target='_blank' rel="noopener noreferrer" href='https://theplusaddons.com/docs?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings' className='she-ghost-btn'>{__('Read Now', 'she-header')}</a>
                    </div>

                    <div className='she_qik_infocrd_cover she_help'>
                        <h4 className='she_qik_info_crd_title'>{__('Need Help?', 'she-header')}</h4>
                        <a target='_blank' rel="noopener noreferrer" href='https://wordpress.org/support/plugin/sticky-header-effects-for-elementor/?utm_source=wpbackend&utm_medium=stickyheader&utm_campaign=plugindashboard' className='she-ghost-btn'>{__('Raise Ticket', 'she-header')}</a>
                    </div>

                    <div className='she_qik_infocrd_cover'>
                        <h4 className='she_qik_info_crd_title'>{__('Join Community', 'she-header')}</h4>
                        <a target='_blank' rel="noopener noreferrer" href='https://www.facebook.com/groups/theplus4elementor??utm_source=wpbackend&utm_medium=stickyheader&utm_campaign=plugindashboard' className='she-ghost-btn'>{__('Join Now', 'she-header')}</a>
                    </div>

                    <div className='she_qik_infocrd_cover'>
                        <h4 className='she_qik_info_crd_title'>{__('Request Feature', 'she-header')}</h4>
                        <a target='_blank' rel="noopener noreferrer" href='https://wordpress.org/support/plugin/sticky-header-effects-for-elementor/?utm_source=wpbackend&utm_medium=stickyheader&utm_campaign=plugindashboard' className='she-ghost-btn'>{__('Suggest Now', 'she-header')}</a>
                    </div>
                </div>

                <div className='she_qikinfo_grp_cover'>

                    <div className='she_qik_infocrd_cover she_ratings_box'>
                        <h4 className='she_qik_info_crd_title'>{__('Rate Sticky Header Effects', 'she-header')}</h4>
                        <div className='she_rating_box'>
                            {ratingSvg.map((obj, index) => (
                                <a key={index} href={(index == 4 ? 'https://wordpress.org/support/plugin/the-plus-addons-for-elementor-page-builder/reviews/?filter=5#new-post&utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings' : 'https://go.posimyth.com/review-tpae?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings')} target="_blank" rel="noopener noreferrer" className='tpae-star' onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onClick={() => setSelectedIndex(index)} > {obj.svg} </a>
                            ))}
                        </div>
                    </div>

                    <div className='she_qik_infocrd_cover'>
                        <h4 className='she_qik_info_crd_title'>{__('Video Tutorials', 'she-header')}</h4>
                        <a target='_blank' rel="noopener noreferrer" href="https://www.youtube.com/watch?v=DfkjFCRhqNE&list=PLFRO-irWzXaLK9H5opSt88xueTnRhqvO5&utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings" className='she-ghost-btn'>{__('Watch Now', 'she-header')}</a>
                    </div>

                    <div className='she_qik_infocrd_cover she_dashboard_social_icons_card_box'>
                        <h4 className='she_qik_info_crd_title'>{__("We're Active on", 'she-header')}</h4>
                        <div className='she_icon_bx_cover'>
                            <a target='_blank' rel="noopener noreferrer" href='https://www.facebook.com/posimyth?utm_source=wpbackend&utm_medium=stickyheader&utm_campaign=plugindashboard' className='theplus_icon_cover'>
                                <img src={plugin_url + 'assets/svg/dashboard_tab/facebook_icon.svg'} draggable={false} />
                            </a>
                            <a target='_blank' rel="noopener noreferrer" href='https://x.com/posimyth?utm_source=wpbackend&utm_medium=stickyheader&utm_campaign=plugindashboard' className='theplus_icon_cover'>
                                <img src={plugin_url + 'assets/svg/dashboard_tab/X_icon.svg'} draggable={false} />
                            </a>
                            <a target='_blank' rel="noopener noreferrer" href='https://www.instagram.com/posimyth/?utm_source=wpbackend&utm_medium=stickyheader&utm_campaign=plugindashboard' className='theplus_icon_cover'>
                                <img src={plugin_url + 'assets/svg/dashboard_tab/instagram_icon.svg'} draggable={false} />
                            </a>
                            <a target='_blank' rel="noopener noreferrer" href='https://t.me/posimyth?utm_source=wpbackend&utm_medium=stickyheader&utm_campaign=plugindashboard' className='theplus_icon_cover'>
                                <img src={plugin_url + 'assets/svg/dashboard_tab/telegram_icon.svg'} draggable={false} />
                            </a>
                            <a target='_blank' rel="noopener noreferrer" href='https://in.linkedin.com/company/posimyth?utm_source=wpbackend&utm_medium=stickyheader&utm_campaign=plugindashboard' className='theplus_icon_cover'>
                                <img src={plugin_url + 'assets/svg/dashboard_tab/linkedin_icon.svg'} draggable={false} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/*---------------------------------- what's New Button Slider Start ---------------------------------- */}

            <div className={slideLeft ? 'she_whats_new_cover she_whats_new_box_opened' : 'she_whats_new_cover she_whats_new_box_closed'}>
                <div className='she-whats-new-outer' onClick={(e) => setSlideLeft(false)}></div>
                <div className='she-whats-new-inner'>
                    <div className='she_heading_icon_strip'>
                        <h4 className='she_whats_new_heading'>{__("What's New?")}</h4>
                        <img className='she_whats_new_close_btn' onClick={(e) => setSlideLeft(false)} src={plugin_url + 'assets/svg/dashboard_tab/close_icon.svg'} draggable={false} />
                    </div>

                    {whatsnew.length > 0 ?
                        whatsnew?.map((data, index) => (
                            <div className='she_whats_new_card_info_cover'>
                                <div className='she_whats_new_img_cover'>
                                    <img className='she_whatsn_new_img' src={Tpae_card_bg} draggable={false} />
                                    <img className='she_whatsn_new_img' src={data?.image || plugin_url + 'assets/images/tp-placeholder.jpg'} draggable={false} style={{ position: 'absolute', left: 0, top: 0 }}></img>
                                </div>
                                <h4 className='she_img_heading_info'>{data.title}</h4>
                                <p className='she_text_info'>{data.description}</p>
                                <div className='she_whats_new_btn_group'>
                                    {data?.demo &&
                                        <a href={data.demo} target="_blank" rel="noopener noreferrer" className='she_whats_new_info_cta_btn'>{__('Live Demo')}</a>
                                    }
                                    {data?.link &&
                                        <a href={data.link} target="_blank" rel="noopener noreferrer" className='she_whats_new_btn_link'>{__('Learn More')}</a>
                                    }
                                </div>
                            </div>
                        ))
                        :
                        <div className='she-data-loader'>
                            <svg viewBox="25 25 50 50"><circle r="20" cy="50" cx="50"></circle></svg>
                        </div>
                    }

                    <a href='https://roadmap.theplusaddons.com/updates/' target='_blank' rel='noopener noreferrer' className='she-ghost-btn tpae_wht_ghst_cmn_btn'>
                        {__('Read Full Changelog')}
                    </a>
                </div>
            </div>

        </div>
    )
}

const get_redux = state => ({
    tpae_dashboard_data: state.Dashboard_data.db_rx,
    plugin_check: state.check_plugin.plugin_status_rx,
})

export default connect(get_redux)(DashboardInnerMain)