import { connect } from "react-redux";
import axios from 'axios';
import './onboarding.scss'
import React, { useEffect, useState } from 'react';
import { __ } from "@wordpress/i18n";
import { redirect } from "react-router-dom";
import { she_onbording_a_rx } from '../../redux/action.js';


const Onboarding = (props) => {

    const [onBoardingStep, setOnBoardingStep] = useState(1)
    const [selectElementor, SetElemetor] = useState('')
    const [activeIndex, setActiveIndex] = useState(0);
    const [email, setEmail] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [subscribeBtn, setSubscribeBtn] = useState('Subscribe');
    const [subscribeBtncheck, setSubscribeBtncheck] = useState(false);
    const [NexterBtn, SetNexterBtn] = useState('Enable Theme Builder');
    const [Nextercheck, SetNexter] = useState(false);
    const [createheaderBtn, SetcreateheaderBtn] = useState({
        btn_one: 'Create Header',
        btn_two: 'Create Header',
    });

    const [ElementPro, SetElementPro] = useState(false);


    useEffect(() => {
        setEmail(props.she_dashboard_data?.user_email || '');
    }, [props.she_dashboard_data]);

    const [TrueStep, setTrueStep] = useState([
        { id: 'select_mode', step_number: 1, step_name: __('Select Mode', 'she-header'), active: false },
        { id: 'get_updates', step_number: 2, step_name: __('Get Updates', 'she-header'), active: false },
        { id: 'install_free_theme_builder', step_number: 3, step_name: __('Install Free Theme Builder', 'she-header'), active: false },
        { id: 'create_header', step_number: 4, step_name: __('Create Header', 'she-header'), active: false },
    ]);

    var nonce = shed_data.nonce;
    var ajax_url = shed_data.ajax_url;
    var plugin_status = props.plugin_check;

    useEffect(() => {

        const nexterStatus = plugin_status.find((check_status) => check_status.name === 'nexter-extension' && check_status.status === 'active');

        if (nexterStatus) {
            SetNexter(true);
        } else {
            SetNexter(false);
        }

        const hasElementor = plugin_status.some(
            (check_status) => check_status?.name === 'elementor-pro'
        );

        if (!hasElementor) return;

        const element_pro = plugin_status.find((check_status) => check_status?.name === 'elementor-pro' && check_status.status === 'active');

        if (element_pro) {
            SetElementPro(true);
            SetElemetor('elementor_pro');
        } else {
            SetElementPro(false);
            SetElemetor('elementor_free');
        }

    }, [plugin_status]);

    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    var resolutions = (screenWidth + ' x ' + screenHeight);

    const handleOnboarding = () => {
        if (1 == onBoardingStep) {
            return (
                select_mode()
            )
        } else if (2 == onBoardingStep) {
            return (
                get_updates()
            )
        } else if (3 == onBoardingStep) {
            return (
                install_theme_bulider()
            )
        } else if (4 == onBoardingStep) {
            return (
                create_header()
            )
        }
    }

    const Hendalclick = (id) => {
        setTrueStep(prevSteps =>
            prevSteps.map(step =>
                step.id === id ? { ...step, active: true } : step
            )
        );
    }

    const HendalBackclick = (id) => {
        setTrueStep(prevSteps =>
            prevSteps.map(step =>
                step.id === id ? { ...step, active: false } : step
            )
        );
    }

    const getClassName = (step) => {

        if (step == onBoardingStep) {
            return "she-step-box she-step-active";
        } else if (step <= onBoardingStep) {
            return "she-step-box she-step-completed";
        }
        return "she-step-box";
    }

    const create_header_temp = async (post_type) => {

        if (post_type === 'nxt_builder') {
            SetcreateheaderBtn({ btn_one: 'Loading...' })
        }

        if (post_type === 'elementor_library') {
            SetcreateheaderBtn({ btn_two: 'Loading...' })
        }

        let form = new FormData();
        form.append('action', 'she_dashboard_ajax_call');
        form.append('nonce', nonce);
        form.append('type', 'she_create_page');
        form.append('post_type', post_type);

        var response = await axios.post(ajax_url, form);

        var page_data = response.data;

        if (page_data.success) {

            if (post_type === 'nxt_builder') {
                SetcreateheaderBtn({ btn_one: 'Create Header' })
            }

            if (post_type === 'elementor_library') {
                SetcreateheaderBtn({ btn_two: 'Create Header' })
            }

            setTrueStep(prevSteps =>
                prevSteps.map(step => {
                    if (step.id === 'create_header') {
                        return { ...step, active: true };
                    }
                    if (step.id === 'install_free_theme_builder') {
                        return { ...step, active: true };
                    }
                    return step;
                })
            );

            let editUrl = page_data.data.edit_url.replace(/&amp;/g, '&');
            window.location.href = editUrl;
            // window.open(editUrl);

            let form = new FormData();
            form.append('action', 'she_dashboard_ajax_call');
            form.append('nonce', nonce);
            form.append('type', 'she_onboarding_setup');

            var response = await axios.post(ajax_url, form);

            if (response.data.success) {
                props.she_onbording_({ check_onboarding: 'hide' });
            }
        }
    }

    const subscribe_she = async () => {

        // if (!isFormValid) {
        //     return;
        // }

        // setSubscribeBtn('Submitted !');

        if (isChecked) {
            let form = new FormData();
            form.append('action', 'she_dashboard_ajax_call');
            form.append('nonce', nonce);
            form.append('type', 'she_user_meta_data');
            // form.append('resolutions', resolutions);
            var axiosResponse = await axios.post(ajax_url, form);
        }

        if (isValidEmail(email)) {
            const encodedEmail = encodeURIComponent(email);

            const welcomeEmailUrl = `https://store.posimyth.com/?fluentcrm=1&route=contact&hash=f808721e-d3c0-4554-9146-2bc6a63a2974&email=${encodedEmail}`;

            const response = await fetch(welcomeEmailUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost/',
                },
                mode: 'no-cors',
            });

            if (response) {
                // if (selectElementor === 'elementor_pro') {
                //     setOnBoardingStep(onBoardingStep + 2);
                // } else {
                //     setOnBoardingStep(onBoardingStep + 1);
                // }
            }
        }

    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // const isFormValid = isValidEmail(email) && isChecked;


    const select_mode = () => {
        return (
            <div className="she-start-crd-main she-onbsec-cover she-step-one">
                <h2 className="she-onbrd-crd-h">{__('Select Your Elementor Version', 'she-header')}</h2>
                <h2 className="she-onbrd-crd-d">{__('We’ve detected your Elementor setup. Choose the right mode to proceed with Sticky Header onboarding.', 'she-header')}</h2>

                <div className="she-strt-crd-cover she-whitebg-cover">

                    <div className={`she-main-cover ${selectElementor === 'elementor_pro' ? 'no-elementor-free' : ''}`}>

                        {selectElementor === 'elementor_free' &&
                            <div className={`she-main-cover-select`}>
                                <div className="she-main-svg">
                                    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0C6.15661 -9.78424e-09 6.80679 0.129329 7.41342 0.380602C8.02004 0.631876 8.57124 1.00017 9.03553 1.46447C9.49983 1.92876 9.86812 2.47995 10.1194 3.08658C10.3707 3.69321 10.5 4.34339 10.5 5C10.5 5.65661 10.3707 6.30679 10.1194 6.91342C9.86812 7.52004 9.49983 8.07124 9.03553 8.53553C8.57124 8.99983 8.02004 9.36812 7.41342 9.6194C6.80679 9.87067 6.15661 10 5.5 10C4.17392 10 2.90215 9.47322 1.96447 8.53553C1.02678 7.59785 0.5 6.32608 0.5 5C0.5 3.67392 1.02678 2.40215 1.96447 1.46447C2.90215 0.526784 4.17392 1.97602e-08 5.5 0ZM7.26667 3.47L4.875 5.86833L3.71167 4.705C3.67293 4.66626 3.62694 4.63553 3.57632 4.61456C3.5257 4.5936 3.47145 4.58281 3.41667 4.58281C3.36188 4.58281 3.30763 4.5936 3.25701 4.61456C3.2064 4.63553 3.16041 4.66626 3.12167 4.705C3.08293 4.74374 3.0522 4.78973 3.03123 4.84035C3.01026 4.89096 2.99947 4.94521 2.99947 5C2.99947 5.05479 3.01026 5.10904 3.03123 5.15965C3.0522 5.21027 3.08293 5.25626 3.12167 5.295L4.58 6.75333C4.6187 6.79214 4.66468 6.82292 4.71531 6.84393C4.76593 6.86493 4.82019 6.87574 4.875 6.87574C4.92981 6.87574 4.98407 6.86493 5.03469 6.84393C5.08532 6.82292 5.1313 6.79214 5.17 6.75333L7.85667 4.05833C7.93246 3.97964 7.97432 3.87433 7.97322 3.76508C7.97212 3.65583 7.92815 3.55138 7.85078 3.47423C7.77342 3.39709 7.66884 3.35341 7.55959 3.35262C7.45034 3.35183 7.34514 3.39398 7.26667 3.47Z"
                                        fill="#ffffff" /></svg>
                                </div>
                                <div className="she-main-text">Detected</div>
                            </div>
                        }
                        <div className={`she-strat-card`}>
                            <div className="she-icon-box">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="41" viewBox="0 0 40 41" fill="none">
                                    <path d="M20 0.101562C8.95321 0.101562 0 9.05477 0 20.1016C0 31.1447 8.95321 40.1016 20 40.1016C31.0468 40.1016 40 31.1484 40 20.1016C39.9964 9.05477 31.0431 0.101562 20 0.101562ZM15.0009 28.4322H11.6694V11.7674H15.0009V28.4322ZM28.3306 28.4322H18.3324V25.1007H28.3306V28.4322ZM28.3306 21.7655H18.3324V18.434H28.3306V21.7655ZM28.3306 15.0989H18.3324V11.7674H28.3306V15.0989Z" fill="#ffff" />
                                </svg>
                            </div>
                            <h3 className="she-crd-h">{__('Elementor Free', 'she-header')}</h3>
                            <div className="she-elementor-button">
                                <span>Installed</span>
                            </div>
                        </div>
                    </div>

                    <div className={`she-main-cover ${selectElementor === 'elementor_free' ? 'no-elementor-pro' : ''}`}>
                        {selectElementor === 'elementor_pro' &&
                            <div className={`she-main-cover-select`}>
                                <div className="she-main-svg">
                                    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0C6.15661 -9.78424e-09 6.80679 0.129329 7.41342 0.380602C8.02004 0.631876 8.57124 1.00017 9.03553 1.46447C9.49983 1.92876 9.86812 2.47995 10.1194 3.08658C10.3707 3.69321 10.5 4.34339 10.5 5C10.5 5.65661 10.3707 6.30679 10.1194 6.91342C9.86812 7.52004 9.49983 8.07124 9.03553 8.53553C8.57124 8.99983 8.02004 9.36812 7.41342 9.6194C6.80679 9.87067 6.15661 10 5.5 10C4.17392 10 2.90215 9.47322 1.96447 8.53553C1.02678 7.59785 0.5 6.32608 0.5 5C0.5 3.67392 1.02678 2.40215 1.96447 1.46447C2.90215 0.526784 4.17392 1.97602e-08 5.5 0ZM7.26667 3.47L4.875 5.86833L3.71167 4.705C3.67293 4.66626 3.62694 4.63553 3.57632 4.61456C3.5257 4.5936 3.47145 4.58281 3.41667 4.58281C3.36188 4.58281 3.30763 4.5936 3.25701 4.61456C3.2064 4.63553 3.16041 4.66626 3.12167 4.705C3.08293 4.74374 3.0522 4.78973 3.03123 4.84035C3.01026 4.89096 2.99947 4.94521 2.99947 5C2.99947 5.05479 3.01026 5.10904 3.03123 5.15965C3.0522 5.21027 3.08293 5.25626 3.12167 5.295L4.58 6.75333C4.6187 6.79214 4.66468 6.82292 4.71531 6.84393C4.76593 6.86493 4.82019 6.87574 4.875 6.87574C4.92981 6.87574 4.98407 6.86493 5.03469 6.84393C5.08532 6.82292 5.1313 6.79214 5.17 6.75333L7.85667 4.05833C7.93246 3.97964 7.97432 3.87433 7.97322 3.76508C7.97212 3.65583 7.92815 3.55138 7.85078 3.47423C7.77342 3.39709 7.66884 3.35341 7.55959 3.35262C7.45034 3.35183 7.34514 3.39398 7.26667 3.47Z"
                                        fill="#ffffff" /></svg>
                                </div>
                                <div className="she-main-text">Detected</div>
                            </div>
                        }
                        <div className={`she-strat-card`}>
                            <div className="she-icon-box">
                                <svg className="she-element-pro" xmlns="http://www.w3.org/2000/svg" width="8" height="7" viewBox="0 0 8 7" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.666812 1.46893L1.07235 4.54743H6.92245L7.32798 1.46893C7.35794 1.24145 7.13632 1.08631 6.97867 1.2244L5.71523 2.33106C5.57656 2.45249 5.37901 2.41299 5.28287 2.24456L4.23103 0.401903C4.11987 0.207178 3.8749 0.207178 3.76374 0.401903L2.7119 2.24456C2.61577 2.41299 2.41821 2.45252 2.27954 2.33106L1.0161 1.2244C0.858456 1.08631 0.636834 1.24145 0.666812 1.46893ZM1.37741 6.25589H6.61749C6.78594 6.25589 6.92249 6.09641 6.92251 5.89969V5.11721H1.07241V5.89969C1.07241 6.09641 1.20896 6.25589 1.37741 6.25589Z" fill="white" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="41" viewBox="0 0 40 41" fill="none">
                                    <path d="M20 0.101562C8.95321 0.101562 0 9.05477 0 20.1016C0 31.1447 8.95321 40.1016 20 40.1016C31.0468 40.1016 40 31.1484 40 20.1016C39.9964 9.05477 31.0431 0.101562 20 0.101562ZM15.0009 28.4322H11.6694V11.7674H15.0009V28.4322ZM28.3306 28.4322H18.3324V25.1007H28.3306V28.4322ZM28.3306 21.7655H18.3324V18.434H28.3306V21.7655ZM28.3306 15.0989H18.3324V11.7674H28.3306V15.0989Z" fill="#ffff" />
                                </svg>
                            </div>

                            <h3 className="she-crd-h">{__('Elementor Pro', 'she-header')}</h3>
                            <div className="she-elementor-button">
                                {ElementPro ? (
                                    <span>Installed</span>
                                ) : (
                                    <>
                                        <a className="she-elem-pro" target='_blank' href="https://elementor.com/pro/?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=stickyheader">Get Pro</a>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="#ffff" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M8.75033 2.33268C8.42816 2.33268 8.16699 2.07152 8.16699 1.74935C8.16699 1.42718 8.42816 1.16602 8.75033 1.16602H12.2502H12.2503C12.3751 1.16602 12.4908 1.20521 12.5856 1.27196C12.7356 1.37752 12.8337 1.55199 12.8337 1.74935V5.24935C12.8337 5.57152 12.5725 5.83268 12.2503 5.83268C11.9282 5.83268 11.667 5.57152 11.667 5.24935V3.15756L6.24606 8.57849C6.01825 8.8063 5.6489 8.8063 5.4211 8.57849C5.19329 8.35069 5.19329 7.98134 5.4211 7.75354L10.842 2.33268H8.75033ZM2.91699 4.08268C2.76228 4.08268 2.61391 4.14414 2.50451 4.25354C2.39512 4.36293 2.33366 4.51131 2.33366 4.66602V11.0827C2.33366 11.2374 2.39512 11.3858 2.50451 11.4952C2.61391 11.6046 2.76228 11.666 2.91699 11.666H9.33366C9.48837 11.666 9.63674 11.6046 9.74614 11.4952C9.85553 11.3858 9.91699 11.2374 9.91699 11.0827V7.58268C9.91699 7.26052 10.1782 6.99935 10.5003 6.99935C10.8225 6.99935 11.0837 7.26052 11.0837 7.58268V11.0827C11.0837 11.5468 10.8993 11.9919 10.5711 12.3201C10.2429 12.6483 9.79779 12.8327 9.33366 12.8327H2.91699C2.45286 12.8327 2.00774 12.6483 1.67956 12.3201C1.35137 11.9919 1.16699 11.5468 1.16699 11.0827V4.66602C1.16699 4.20189 1.35137 3.75677 1.67956 3.42858C2.00774 3.10039 2.45286 2.91602 2.91699 2.91602H6.41699C6.73916 2.91602 7.00033 3.17718 7.00033 3.49935C7.00033 3.82152 6.73916 4.08268 6.41699 4.08268H2.91699Z" fill="#ffff" />
                                        </svg>
                                    </>
                                )}
                            </div>
                            {/* <p className="tpar-crd-desc">{__('Create your design with our highly customisable widgets', 'she-header')}</p> */}
                        </div>
                    </div>
                </div>

                {selectElementor ?

                    < span className="she-pink-common-btn" onClick={() => { setOnBoardingStep(onBoardingStep + 1); Hendalclick('select_mode'); }}>Next</span>
                    :
                    <span className="she-pink-common-btn she-disable-element">Next</span>}
            </div>
        )
    }

    const get_updates = () => {

        return (

            <div className="she-stay-upcover she-onbsec-cover she-step-two">

                <h2 className="she-onbrd-crd-h">{__('Get Exclusive Elementor Tips, Tricks and Resources Delivered Straight to Your Inbox!', 'she-header')}</h2>

                <div className="she-whinf-cover she-whitebg-cover">
                    <div className="she-top-stxt">
                        <p className="she-sm-txt">{__('Join our 500K+ Business Owners, Marketers, WordPress users.', 'she-header')}</p>

                        <div className="she-grp-txtico">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M12.3849 2.28878L7.10652 0.101255C6.9725 0.0457194 6.74473 0 6.59958 0C6.45354 0 6.22707 0.0457194 6.09209 0.101255L0.814019 2.28878C0.321649 2.49086 0 2.96938 0 3.47525C0 10.5328 5.20136 14 6.59518 14C8.00273 14 13.1959 10.4945 13.1959 3.47525C13.1959 2.96938 12.8742 2.49086 12.3849 2.28878ZM9.2371 5.46863C9.2371 5.61987 9.18484 5.77188 9.07817 5.89575L6.439 8.95829C6.25428 9.17376 6.00961 9.16282 5.93813 9.16282C5.76373 9.16282 5.59532 9.09362 5.47161 8.97057L4.15202 7.65805C4.02199 7.55499 3.95876 7.38546 3.95876 7.19405C3.95876 6.84432 4.24192 6.53779 4.61855 6.53779C4.78737 6.53779 4.95614 6.60188 5.08508 6.73004L5.9013 7.54189L8.07669 5.01694C8.20752 4.86567 8.39229 4.78828 8.57813 4.78828C9.08315 4.81237 9.2371 5.26629 9.2371 5.46863Z" fill="#1ECB2B" />
                            </svg>
                            <p className="she-icotxt">{__('NO SPAM GUARANTEE', 'she-header')}</p>
                        </div>
                    </div>

                    <input
                        className="she-in-boxfield"
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="she-staywid-list">
                        <input
                            type="checkbox"
                            id="she-agree-ch"
                            className="she-chkbox-style"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                        />
                        <label className="she-wid-chk-name" htmlFor="she-agree-ch">
                            {__('Agree to contribute to make Sticky Header better by sharing non-sensitive details.', 'she-header')}
                        </label>
                    </div>
                </div>

                <div className="she-btmsm-btn">
                    <span className="she-link-btn" onClick={() => { setOnBoardingStep(onBoardingStep - 1); HendalBackclick('select_mode'); }}>Back</span>
                    <div className="she-rit-btn-cover">
                        <span className="she-link-btn" onClick={() => { setOnBoardingStep(onBoardingStep + (selectElementor === 'elementor_pro' ? 2 : 1)); }}>Skip</span>
                        <a className="she-pink-common-btn"
                            onClick={() => { setOnBoardingStep(onBoardingStep + (selectElementor === 'elementor_pro' ? 2 : 1)); Hendalclick('get_updates'); subscribe_she(); }}
                        >Subscribe</a>

                    </div>
                </div>

            </div>
        )
    }

    const she_skip_onbording = async () => {

        props.she_onbording_({ check_onboarding: 'hide' });

        let form = new FormData();
        form.append('action', 'she_dashboard_ajax_call');
        form.append('nonce', nonce);
        form.append('type', 'she_onboarding_setup');

        await axios.post(ajax_url, form);
    }

    const install_theme_bulider = () => {

        const handleToggle = (index) => {
            setActiveIndex(activeIndex === index ? null : index);
        };

        const wdkit_poup_accordian = [
            {
                question: __('Why do I need the Nexter Extension?', 'she-header'),
                answer: __('Elementor’s free version doesn’t include a Theme Builder. The Nexter Extension fills this gap, allowing you to design and customize your website’s header, footer, and other theme components without upgrading to Elementor Pro.', 'she-header'),
            },
            {
                question: __('Will this work with any WordPress theme?', 'she-header'),
                answer: __('Yes, the Nexter Extension is designed to work with any classic WordPress theme. However, for optimal performance, we recommend using it with themes like Hello Elementor, Nexter Theme, Astra, or GeneratePress. If you encounter any issues, please connect with us via our website’s live chat.', 'she-header'),
            },
            {
                question: __('Will it break my current website?', 'she-header'),
                answer: __('Not at all. The Nexter Extension is designed to integrate seamlessly with your existing website. Your current design and content will remain intact unless you choose to overwrite them with new Theme Builder templates from Nexter.', 'she-header'),
            }
        ];

        const CheckIcon = (<svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0C6.15661 -9.78424e-09 6.80679 0.129329 7.41342 0.380602C8.02004 0.631876 8.57124 1.00017 9.03553 1.46447C9.49983 1.92876 9.86812 2.47995 10.1194 3.08658C10.3707 3.69321 10.5 4.34339 10.5 5C10.5 5.65661 10.3707 6.30679 10.1194 6.91342C9.86812 7.52004 9.49983 8.07124 9.03553 8.53553C8.57124 8.99983 8.02004 9.36812 7.41342 9.6194C6.80679 9.87067 6.15661 10 5.5 10C4.17392 10 2.90215 9.47322 1.96447 8.53553C1.02678 7.59785 0.5 6.32608 0.5 5C0.5 3.67392 1.02678 2.40215 1.96447 1.46447C2.90215 0.526784 4.17392 1.97602e-08 5.5 0ZM7.26667 3.47L4.875 5.86833L3.71167 4.705C3.67293 4.66626 3.62694 4.63553 3.57632 4.61456C3.5257 4.5936 3.47145 4.58281 3.41667 4.58281C3.36188 4.58281 3.30763 4.5936 3.25701 4.61456C3.2064 4.63553 3.16041 4.66626 3.12167 4.705C3.08293 4.74374 3.0522 4.78973 3.03123 4.84035C3.01026 4.89096 2.99947 4.94521 2.99947 5C2.99947 5.05479 3.01026 5.10904 3.03123 5.15965C3.0522 5.21027 3.08293 5.25626 3.12167 5.295L4.58 6.75333C4.6187 6.79214 4.66468 6.82292 4.71531 6.84393C4.76593 6.86493 4.82019 6.87574 4.875 6.87574C4.92981 6.87574 4.98407 6.86493 5.03469 6.84393C5.08532 6.82292 5.1313 6.79214 5.17 6.75333L7.85667 4.05833C7.93246 3.97964 7.97432 3.87433 7.97322 3.76508C7.97212 3.65583 7.92815 3.55138 7.85078 3.47423C7.77342 3.39709 7.66884 3.35341 7.55959 3.35262C7.45034 3.35183 7.34514 3.39398 7.26667 3.47Z" fill="#9d1a4f" /></svg>);

        const install_nexter = async () => {

            SetNexterBtn('Installing Nexter Extension');

            let form = new FormData();
            form.append('action', 'she_dashboard_ajax_call');
            form.append('nonce', nonce);
            form.append('type', 'she_plugin_install');
            form.append('slug', 'nexter-extension/nexter-extension.php');
            form.append('name', 'nexter-extension');

            var response = await axios.post(ajax_url, form);
            var data = response.data;

            if (data.success) {
                // setTrueStep(prevSteps =>
                //     prevSteps.map(step =>
                //         step.id === 'install_free_theme_builder' ? { ...step, active: true } : step
                //     )
                // );
                SetNexter(true);
                SetNexterBtn('Create Header');
            } else {
                SetNexterBtn('Installing Failed');
            }
        }


        return (

            <>
                <div className="she-accodion-main-cover">
                    <div className="she-onbsec-cover she-step-three">
                        <div className="she-theme-content-bg">
                            {/* <div className="she-wdkit-popup-close" ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L12 13.4142L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4142 12L18.7071 6.70711Z" fill="white" fillOpacity="0.8" /></svg></div> */}
                            <div className='she-onbording-accordion'>
                                <div className="she-wdkit-popup-content">
                                    <div className="she-wdkit-popup-title">Get Free Theme Builder for Elementor <br /> With Nexter Extension</div>
                                    <div className="she-wdkit-features-dic">
                                        <ul>
                                            <li>{CheckIcon}{__('Free Elementor Header & Footer Builder', 'she-header')}</li>
                                            <li>{CheckIcon}{__('Free Single, Archive & 404 Page Builder', 'she-header')}</li>
                                            <li>{CheckIcon}{__('Pre-Made Theme Builder Section Templates', 'she-header')}</li>
                                            <li>{CheckIcon}{__('100% Customisable with Widgets', 'she-header')}</li>
                                        </ul>
                                    </div>
                                    {/* <div className="she-wdkit-install-activate">
                            <a className='she-wdkit-install-btn' >{'buttonText'}</a>
                            <a className='she-wdkit-learn-more' href='https://wdesignkit.com/' target='_blank' rel="noopener noreferrer">Learn More</a>
                             </div> */}

                                    <div className="she-wdkit-popup-accordion">
                                        {wdkit_poup_accordian.map((item, index) => (
                                            <div key={index} className="she-wdkit-accordion-item">
                                                <div className={`she-wdkit-accordio-content ${activeIndex === index ? "she-tpae-content-opan" : ""}`} onClick={() => handleToggle(index)}>
                                                    <div className="she-wdkit-accd-qui">{item.question}</div>
                                                    <div className="she-wdkit-accd-icon">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            {activeIndex !== index && (<path d="M10 4.16675V15.8334" stroke="black" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />)}
                                                            <path d="M4.16797 10H15.8346" stroke="black" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className={`she-wdkit-accd-ans ${activeIndex === index ? "opan-accordion" : ""}`}>{item.answer}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="she-btmsm-btn she-step-three-btn">
                        <div className="she-btmsm-btn theme-bulider-sections">
                            <span className="she-link-btn" onClick={() => { setOnBoardingStep(onBoardingStep - 1); HendalBackclick('get_updates'); }}>Back</span>
                            <div className="she-rit-btn-cover">
                                <span className="she-link-btn" onClick={() => she_skip_onbording()}>Skip</span>
                                {!Nextercheck ? (
                                    <a className="she-pink-common-btn" onClick={(e) => install_nexter(e)}>{NexterBtn}</a>
                                ) : (
                                    <a className="she-pink-common-btn" onClick={(e) => create_header_temp('nxt_builder')}>{createheaderBtn.btn_one}</a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const create_header = () => {

        return (
            <div className="she-enbltempl-cover she-onbsec-cover she-step-foure">

                <div className="she-header-main-cover">
                    <div className="she-header-main-cover-left">
                        <h2 className="she-onbrd-crd-h">{__('You\'re All Set!', 'she-header')}</h2>
                        <h2 className="she-onbrd-crd-h">{__('Now, Create Your Sticky Header', 'she-header')}</h2>
                        <p className="she-sm-txt">{__('Everything is set up! Click below to open Elementor Theme Builder and ', 'she-header')}</p>
                        <p className="she-sm-txt she-last-child">{__('create your Sticky Header effortlessly.', 'she-header')}</p>
                    </div>
                </div>

                <div className="she-btn-wreper she-step-foure-btn">
                    <a className="she-link-btn" onClick={() => {
                        setOnBoardingStep(onBoardingStep + (selectElementor === 'elementor_pro' ? -2 : -1)); HendalBackclick('get_updates');
                    }}>Back</a>
                    <div className="she-rit-btn-cover step-foure-btn">
                        <span className="she-link-btn" onClick={() => she_skip_onbording()}>{__('Skip', 'she-header')}</span>
                        <a className="she-pink-common-btn" onClick={(e) => create_header_temp('elementor_library')}>{createheaderBtn.btn_two}</a>
                    </div>
                </div>
            </div>
        )
    }

    return (

        <div className="she-onboarding-cover">
            <div className="she-onbording-close">
                <span className="she-onbording-btn" onClick={() => she_skip_onbording()}>Skip Setup
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="#666" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.667" d="M15 5 5 15M5 5l10 10"></path></svg>
                </span>
            </div>
            <div className="she-steps-cover">
                {TrueStep
                    .filter(step => {
                        if (selectElementor === 'elementor_pro' && step.id === 'install_free_theme_builder') {
                            return false;
                        }
                        return true;
                    })
                    .map((data, index) => {
                        return (
                            <React.Fragment key={index}>
                                <div className={getClassName(data.step_number)}>
                                    {data?.active ? (
                                        <svg viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0C6.15661 -9.78424e-09 6.80679 0.129329 7.41342 0.380602C8.02004 0.631876 8.57124 1.00017 9.03553 1.46447C9.49983 1.92876 9.86812 2.47995 10.1194 3.08658C10.3707 3.69321 10.5 4.34339 10.5 5C10.5 5.65661 10.3707 6.30679 10.1194 6.91342C9.86812 7.52004 9.49983 8.07124 9.03553 8.53553C8.57124 8.99983 8.02004 9.36812 7.41342 9.6194C6.80679 9.87067 6.15661 10 5.5 10C4.17392 10 2.90215 9.47322 1.96447 8.53553C1.02678 7.59785 0.5 6.32608 0.5 5C0.5 3.67392 1.02678 2.40215 1.96447 1.46447C2.90215 0.526784 4.17392 1.97602e-08 5.5 0ZM7.26667 3.47L4.875 5.86833L3.71167 4.705C3.67293 4.66626 3.62694 4.63553 3.57632 4.61456C3.5257 4.5936 3.47145 4.58281 3.41667 4.58281C3.36188 4.58281 3.30763 4.5936 3.25701 4.61456C3.2064 4.63553 3.16041 4.66626 3.12167 4.705C3.08293 4.74374 3.0522 4.78973 3.03123 4.84035C3.01026 4.89096 2.99947 4.94521 2.99947 5C2.99947 5.05479 3.01026 5.10904 3.03123 5.15965C3.0522 5.21027 3.08293 5.25626 3.12167 5.295L4.58 6.75333C4.6187 6.79214 4.66468 6.82292 4.71531 6.84393C4.76593 6.86493 4.82019 6.87574 4.875 6.87574C4.92981 6.87574 4.98407 6.86493 5.03469 6.84393C5.08532 6.82292 5.1313 6.79214 5.17 6.75333L7.85667 4.05833C7.93246 3.97964 7.97432 3.87433 7.97322 3.76508C7.97212 3.65583 7.92815 3.55138 7.85078 3.47423C7.77342 3.39709 7.66884 3.35341 7.55959 3.35262C7.45034 3.35183 7.34514 3.39398 7.26667 3.47Z"
                                            fill="#14C38E" /></svg>
                                    ) : (
                                        <svg viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0C6.15661 -9.78424e-09 6.80679 0.129329 7.41342 0.380602C8.02004 0.631876 8.57124 1.00017 9.03553 1.46447C9.49983 1.92876 9.86812 2.47995 10.1194 3.08658C10.3707 3.69321 10.5 4.34339 10.5 5C10.5 5.65661 10.3707 6.30679 10.1194 6.91342C9.86812 7.52004 9.49983 8.07124 9.03553 8.53553C8.57124 8.99983 8.02004 9.36812 7.41342 9.6194C6.80679 9.87067 6.15661 10 5.5 10C4.17392 10 2.90215 9.47322 1.96447 8.53553C1.02678 7.59785 0.5 6.32608 0.5 5C0.5 3.67392 1.02678 2.40215 1.96447 1.46447C2.90215 0.526784 4.17392 1.97602e-08 5.5 0ZM7.26667 3.47L4.875 5.86833L3.71167 4.705C3.67293 4.66626 3.62694 4.63553 3.57632 4.61456C3.5257 4.5936 3.47145 4.58281 3.41667 4.58281C3.36188 4.58281 3.30763 4.5936 3.25701 4.61456C3.2064 4.63553 3.16041 4.66626 3.12167 4.705C3.08293 4.74374 3.0522 4.78973 3.03123 4.84035C3.01026 4.89096 2.99947 4.94521 2.99947 5C2.99947 5.05479 3.01026 5.10904 3.03123 5.15965C3.0522 5.21027 3.08293 5.25626 3.12167 5.295L4.58 6.75333C4.6187 6.79214 4.66468 6.82292 4.71531 6.84393C4.76593 6.86493 4.82019 6.87574 4.875 6.87574C4.92981 6.87574 4.98407 6.86493 5.03469 6.84393C5.08532 6.82292 5.1313 6.79214 5.17 6.75333L7.85667 4.05833C7.93246 3.97964 7.97432 3.87433 7.97322 3.76508C7.97212 3.65583 7.92815 3.55138 7.85078 3.47423C7.77342 3.39709 7.66884 3.35341 7.55959 3.35262C7.45034 3.35183 7.34514 3.39398 7.26667 3.47Z"
                                        /></svg>
                                    )}
                                    <div className="she-step-name">{data.step_name}</div>
                                </div>

                                {!(index === 3 || (selectElementor === 'elementor_pro' && index === 2)) && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M7.70832 6.34396C7.89579 6.53149 8.00111 6.7858 8.00111 7.05096C8.00111 7.31613 7.89579 7.57043 7.70832 7.75796L2.05132 13.415C1.95907 13.5105 1.84873 13.5867 1.72672 13.6391C1.60472 13.6915 1.4735 13.7191 1.34072 13.7202C1.20794 13.7214 1.07626 13.6961 0.953366 13.6458C0.83047 13.5955 0.718817 13.5212 0.624924 13.4274C0.531032 13.3335 0.456778 13.2218 0.406498 13.0989C0.356217 12.976 0.330915 12.8443 0.332069 12.7116C0.333223 12.5788 0.360809 12.4476 0.413218 12.3256C0.465627 12.2036 0.541809 12.0932 0.637319 12.001L5.58732 7.05096L0.637319 2.10096C0.455161 1.91236 0.354367 1.65976 0.356645 1.39756C0.358924 1.13536 0.464092 0.884551 0.6495 0.699143C0.834909 0.513735 1.08572 0.408566 1.34792 0.406288C1.61011 0.404009 1.86272 0.504804 2.05132 0.686962L7.70832 6.34396Z" fill="#D9D9D9" />
                                    </svg>
                                )}
                            </React.Fragment>
                        );
                    })}


            </div>
            <div className="she-steps-tab-cover she-onbsec-cover">
                {handleOnboarding()}
            </div>

        </div>
    );

}

const get_redux = state => ({
    plugin_check: state.check_plugin.plugin_status_rx,
    she_dashboard_data: state.Dashboard_data.db_rx,
    she_onbording_data: state.Check_onbording.she_onbording_rx,
})

const set_redux = (dispatch) => ({
    she_onbording_: (data) => dispatch(she_onbording_a_rx(data)),
})
export default connect(get_redux, set_redux)(Onboarding)