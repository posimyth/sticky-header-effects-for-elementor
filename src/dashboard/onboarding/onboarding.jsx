import { connect } from "react-redux";
import axios from 'axios';
import './onboarding.scss'
import React, { useEffect, useState } from 'react';
import { __ } from "@wordpress/i18n";
import { redirect } from "react-router-dom";

const Onboarding = (props) => {

    const [onBoardingStep, setOnBoardingStep] = useState(1)
    const [accordionIndex, setAccordionIndex] = useState(0)
    const [selectElementor, SetElemetor] = useState('')

    const [activeIndex, setActiveIndex] = useState(0);

    const [email, setEmail] = useState('');
    const [isChecked, setIsChecked] = useState(true);
    const [subscribeBtn, setSubscribeBtn] = useState('Subscribe and Continue');
    const [subscribeBtncheck, setSubscribeBtncheck] = useState(false);

    const [NexterBtn, SetNexterBtn] = useState('Enable Theme Builder');
    const [Nextercheck, SetNexter] = useState(false);
    const [createheaderBtn, SetcreateheaderBtn] = useState({
        btn_one: 'Create Header',
        btn_two: 'Open Free Elementor Header Builder',
    });

    const [ElementPro, SetElementPro] = useState(false);

    var plugin_url = shed_data.shed_url;
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

        const element_pro = plugin_status.find((check_status) => check_status.name === 'elementor-pro' && check_status.status === 'active');

        if (element_pro) {
            SetElementPro(true);
        } else {
            SetElementPro(false);
        }

    }, [plugin_status]);

    const [TrueStep, setTrueStep] = useState([
        { id: 'select_mode', step_number: 1, step_name: __('Select Mode', 'she-header'), active: false },
        { id: 'get_updates', step_number: 2, step_name: __('Get Updates', 'she-header'), active: false },
        { id: 'install_free_theme_builder', step_number: 3, step_name: __('Install Free Theme Builder', 'she-header'), active: false },
        { id: 'create_header', step_number: 4, step_name: __('Create Header', 'she-header'), active: false },
    ]);

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

    const getClassName = (step) => {
        if (step <= onBoardingStep) {
            return "she-step-box she-step-active";
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
                SetcreateheaderBtn({ btn_two: 'Open Free Elementor Header Builder' })
            }

            setTrueStep(prevSteps =>
                prevSteps.map(step =>
                    step.id === 'create_header' ? { ...step, active: true } : step
                )
            );

            let editUrl = page_data.data.edit_url.replace(/&amp;/g, '&');
            window.open(editUrl, '_blank');

            let form = new FormData();
            form.append('action', 'she_dashboard_ajax_call');
            form.append('nonce', nonce);
            form.append('type', 'she_onboarding_setup');

            var response = await axios.post(ajax_url, form);

            if (response.data.success) {
                window.location.reload();
            }
        }
    }

    const subscribe_she = async () => {

        setSubscribeBtn('Submitted !');
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

            setSubscribeBtncheck(true);
            setSubscribeBtn('Success !');

            setTimeout(() => {
                setSubscribeBtn('Next');
            }, 2000);
        }

    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isFormValid = isValidEmail(email) && isChecked;

    const select_mode = () => {
        return (
            <div className="she-start-crd-main she-onbsec-cover">
                <h2 className="she-onbrd-crd-h">{__('Select Your Elementor Version', 'she-header')}</h2>
                <h2 className="she-onbrd-crd-d">{__('We’ve detected your Elementor setup. Choose the right mode to proceed with Sticky Header onboarding.', 'she-header')}</h2>

                <div className="she-strt-crd-cover she-whitebg-cover">

                    <div className="she-main-cover">

                        {selectElementor === 'elementor_free' &&
                            <div className={`she-main-cover-select ${selectElementor === 'elementor_free' ? 'show' : ''}`}>
                                <div className="she-main-svg">
                                    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0C6.15661 -9.78424e-09 6.80679 0.129329 7.41342 0.380602C8.02004 0.631876 8.57124 1.00017 9.03553 1.46447C9.49983 1.92876 9.86812 2.47995 10.1194 3.08658C10.3707 3.69321 10.5 4.34339 10.5 5C10.5 5.65661 10.3707 6.30679 10.1194 6.91342C9.86812 7.52004 9.49983 8.07124 9.03553 8.53553C8.57124 8.99983 8.02004 9.36812 7.41342 9.6194C6.80679 9.87067 6.15661 10 5.5 10C4.17392 10 2.90215 9.47322 1.96447 8.53553C1.02678 7.59785 0.5 6.32608 0.5 5C0.5 3.67392 1.02678 2.40215 1.96447 1.46447C2.90215 0.526784 4.17392 1.97602e-08 5.5 0ZM7.26667 3.47L4.875 5.86833L3.71167 4.705C3.67293 4.66626 3.62694 4.63553 3.57632 4.61456C3.5257 4.5936 3.47145 4.58281 3.41667 4.58281C3.36188 4.58281 3.30763 4.5936 3.25701 4.61456C3.2064 4.63553 3.16041 4.66626 3.12167 4.705C3.08293 4.74374 3.0522 4.78973 3.03123 4.84035C3.01026 4.89096 2.99947 4.94521 2.99947 5C2.99947 5.05479 3.01026 5.10904 3.03123 5.15965C3.0522 5.21027 3.08293 5.25626 3.12167 5.295L4.58 6.75333C4.6187 6.79214 4.66468 6.82292 4.71531 6.84393C4.76593 6.86493 4.82019 6.87574 4.875 6.87574C4.92981 6.87574 4.98407 6.86493 5.03469 6.84393C5.08532 6.82292 5.1313 6.79214 5.17 6.75333L7.85667 4.05833C7.93246 3.97964 7.97432 3.87433 7.97322 3.76508C7.97212 3.65583 7.92815 3.55138 7.85078 3.47423C7.77342 3.39709 7.66884 3.35341 7.55959 3.35262C7.45034 3.35183 7.34514 3.39398 7.26667 3.47Z"
                                        fill="#ffffff" /></svg>
                                </div>
                                <div className="she-main-text">Selected</div>
                            </div>
                        }
                        <div className={`she-strat-card ${'import_web' === selectElementor ? 'tpae-active-board-card' : ''} `} onClick={() => { SetElemetor('elementor_free') }}>
                            <div className="she-icon-box">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="41" viewBox="0 0 40 41" fill="none">
                                    <path d="M20 0.101562C8.95321 0.101562 0 9.05477 0 20.1016C0 31.1447 8.95321 40.1016 20 40.1016C31.0468 40.1016 40 31.1484 40 20.1016C39.9964 9.05477 31.0431 0.101562 20 0.101562ZM15.0009 28.4322H11.6694V11.7674H15.0009V28.4322ZM28.3306 28.4322H18.3324V25.1007H28.3306V28.4322ZM28.3306 21.7655H18.3324V18.434H28.3306V21.7655ZM28.3306 15.0989H18.3324V11.7674H28.3306V15.0989Z" fill="#ffff" />
                                </svg>
                            </div>
                            <h3 className="she-crd-h">{__('Elementor Free', 'she-header')}</h3>
                        </div>
                    </div>

                    <div className={`she-main-cover ${!ElementPro ? 'no-elementor-pro' : ''}`} data-tooltip={!ElementPro ? 'Add Elementor Pro ' : ''}>
                        {selectElementor === 'elementor_pro' &&
                            <div className={`she-main-cover-select ${selectElementor === 'elementor_pro' ? 'show' : ''}`}>
                                <div className="she-main-svg">
                                    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0C6.15661 -9.78424e-09 6.80679 0.129329 7.41342 0.380602C8.02004 0.631876 8.57124 1.00017 9.03553 1.46447C9.49983 1.92876 9.86812 2.47995 10.1194 3.08658C10.3707 3.69321 10.5 4.34339 10.5 5C10.5 5.65661 10.3707 6.30679 10.1194 6.91342C9.86812 7.52004 9.49983 8.07124 9.03553 8.53553C8.57124 8.99983 8.02004 9.36812 7.41342 9.6194C6.80679 9.87067 6.15661 10 5.5 10C4.17392 10 2.90215 9.47322 1.96447 8.53553C1.02678 7.59785 0.5 6.32608 0.5 5C0.5 3.67392 1.02678 2.40215 1.96447 1.46447C2.90215 0.526784 4.17392 1.97602e-08 5.5 0ZM7.26667 3.47L4.875 5.86833L3.71167 4.705C3.67293 4.66626 3.62694 4.63553 3.57632 4.61456C3.5257 4.5936 3.47145 4.58281 3.41667 4.58281C3.36188 4.58281 3.30763 4.5936 3.25701 4.61456C3.2064 4.63553 3.16041 4.66626 3.12167 4.705C3.08293 4.74374 3.0522 4.78973 3.03123 4.84035C3.01026 4.89096 2.99947 4.94521 2.99947 5C2.99947 5.05479 3.01026 5.10904 3.03123 5.15965C3.0522 5.21027 3.08293 5.25626 3.12167 5.295L4.58 6.75333C4.6187 6.79214 4.66468 6.82292 4.71531 6.84393C4.76593 6.86493 4.82019 6.87574 4.875 6.87574C4.92981 6.87574 4.98407 6.86493 5.03469 6.84393C5.08532 6.82292 5.1313 6.79214 5.17 6.75333L7.85667 4.05833C7.93246 3.97964 7.97432 3.87433 7.97322 3.76508C7.97212 3.65583 7.92815 3.55138 7.85078 3.47423C7.77342 3.39709 7.66884 3.35341 7.55959 3.35262C7.45034 3.35183 7.34514 3.39398 7.26667 3.47Z"
                                        fill="#ffffff" /></svg>
                                </div>
                                <div className="she-main-text">Selected</div>
                            </div>
                        }
                        <div className={`she-strat-card ${'ele_widgets' === selectElementor ? 'tpae-active-board-card' : ''}`} onClick={() => { if (ElementPro) { SetElemetor('elementor_pro'); } }}>
                            <div className="she-icon-box">
                                <svg className="she-element-pro" xmlns="http://www.w3.org/2000/svg" width="8" height="7" viewBox="0 0 8 7" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.666812 1.46893L1.07235 4.54743H6.92245L7.32798 1.46893C7.35794 1.24145 7.13632 1.08631 6.97867 1.2244L5.71523 2.33106C5.57656 2.45249 5.37901 2.41299 5.28287 2.24456L4.23103 0.401903C4.11987 0.207178 3.8749 0.207178 3.76374 0.401903L2.7119 2.24456C2.61577 2.41299 2.41821 2.45252 2.27954 2.33106L1.0161 1.2244C0.858456 1.08631 0.636834 1.24145 0.666812 1.46893ZM1.37741 6.25589H6.61749C6.78594 6.25589 6.92249 6.09641 6.92251 5.89969V5.11721H1.07241V5.89969C1.07241 6.09641 1.20896 6.25589 1.37741 6.25589Z" fill="white" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="41" viewBox="0 0 40 41" fill="none">
                                    <path d="M20 0.101562C8.95321 0.101562 0 9.05477 0 20.1016C0 31.1447 8.95321 40.1016 20 40.1016C31.0468 40.1016 40 31.1484 40 20.1016C39.9964 9.05477 31.0431 0.101562 20 0.101562ZM15.0009 28.4322H11.6694V11.7674H15.0009V28.4322ZM28.3306 28.4322H18.3324V25.1007H28.3306V28.4322ZM28.3306 21.7655H18.3324V18.434H28.3306V21.7655ZM28.3306 15.0989H18.3324V11.7674H28.3306V15.0989Z" fill="#ffff" />
                                </svg>
                            </div>

                            <h3 className="she-crd-h">{__('Elementor Pro', 'she-header')}</h3>
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

            <div className="she-stay-upcover she-onbsec-cover">

                <h2 className="she-onbrd-crd-h">{__('Get Exclusive Elementor Tips, Tricks and Resources Delivered Straight to Your Inbox!', 'she-header')}</h2>

                <div className="she-whinf-cover she-whitebg-cover">
                    <div className="she-top-stxt">
                        <p className="she-sm-txt">{__('Join our 500K+ Business Owners, Marketers, WordPress users.', 'she-header')}</p>

                        <div className="she-grp-txtico">
                            <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.9552 2.9486L9.15521 0.130446C8.98255 0.0588995 8.68913 0 8.50212 0C8.31399sh 0 8.02223 0.0588995 7.84833 0.130446L1.04869 2.9486C0.414375 3.20893 0 3.8254 0 4.4771C0 13.5692 6.70083 18.036 8.49646 18.036C10.3098 18.036 17 13.5199 17 4.4771C17 3.8254 16.5856 3.20893 15.9552 2.9486ZM11.9 7.04515C11.9 7.23999 11.8327 7.43582 11.6953 7.5954L8.29526 11.5408C8.05729 11.8184 7.74208 11.8043 7.65 11.8043C7.42532 11.8043 7.20835 11.7152 7.04898 11.5566L5.34898 9.86574C5.18146 9.73297 5.1 9.51456 5.1 9.26797C5.1 8.81742 5.46479 8.42253 5.95 8.42253C6.16749 8.42253 6.38492 8.5051 6.55102 8.67021L7.60254 9.7161L10.4051 6.46324C10.5736 6.26836 10.8116 6.16867 11.0511 6.16867C11.7017 6.1997 11.9 6.78447 11.9 7.04515Z" fill="#1ECB2B" />
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
                    <span className="she-link-btn" onClick={() => { setOnBoardingStep(onBoardingStep - 1) }}>Back</span>
                    <div className="she-rit-btn-cover">
                        <span
                            className="she-link-btn"
                            onClick={() => {
                                setOnBoardingStep(onBoardingStep + (selectElementor === 'elementor_pro' ? 2 : 1));
                                Hendalclick('get_updates');
                            }}>
                            Skip
                        </span>

                        {
                            !subscribeBtncheck ? (
                                isFormValid ? (
                                    <a className="she-pink-common-btn" onClick={() => subscribe_she()}>{subscribeBtn}</a>
                                ) : (
                                    <a className="she-pink-common-btn"
                                        style={{ pointerEvents: 'none', cursor: 'not-allowed', opacity: 0.6, }}>
                                        {__('Subscribe and Continue', 'she-header')}
                                    </a>
                                )
                            ) : (
                                <a className="she-pink-common-btn"
                                    onClick={() => {
                                        setOnBoardingStep(onBoardingStep + (selectElementor === 'elementor_pro' ? 2 : 1));
                                        Hendalclick('get_updates');
                                    }}
                                >
                                    {subscribeBtn}
                                </a>
                            )
                        }

                    </div>
                </div>

            </div>
        )
    }

    const install_theme_bulider = () => {

        const handleToggle = (index) => {
            setActiveIndex(activeIndex === index ? null : index);
        };
        
        const wdkit_poup_accordian = [
            {
                question: __('Why do I need the Nexter Extension?','she-header'),
                answer:   __('Elementor’s free version doesn’t include a Theme Builder. The Nexter Extension fills this gap, allowing you to design and customize your website’s header, footer, and other theme components without upgrading to Elementor Pro.','she-header'),
            },
            {
                question:  __('Will this work with any WordPress theme?','she-header'),
                answer: __('Yes, the Nexter Extension is designed to work with any classic WordPress theme. However, for optimal performance, we recommend using it with themes like Hello Elementor, Nexter Theme, Astra, or GeneratePress. If you encounter any issues, please connect with us via our website’s live chat.','she-header'),
            },
            {
                question: __('Will it break my current website?','she-header'),
                answer: __('Not at all. The Nexter Extension is designed to integrate seamlessly with your existing website. Your current design and content will remain intact unless you choose to overwrite them with new Theme Builder templates from Nexter.','she-header'),
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
                setTrueStep(prevSteps =>
                    prevSteps.map(step =>
                        step.id === 'install_free_theme_builder' ? { ...step, active: true } : step
                    )
                );
                SetNexter(true);
                SetNexterBtn('Create Header');
            } else {
                SetNexterBtn('Instaling Failed');
            }
        }


        return (

            <>
                <div className="she-theme-content-bg">
                    {/* <div className="she-wdkit-popup-close" ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L12 13.4142L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4142 12L18.7071 6.70711Z" fill="white" fillOpacity="0.8" /></svg></div> */}
                    <div className='she-onbording-accordion'>
                        <div className="she-wdkit-popup-content">
                            <div className="she-wdkit-popup-title">Get Free Theme Builder for Elementor with Nexter Extension</div>
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
                                            <div>
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


                <div className="she-btmsm-btn theme-bulider-sections">
                    <span className="she-link-btn" onClick={() => { setOnBoardingStep(onBoardingStep - 1) }}>Back</span>
                    <div className="she-rit-btn-cover">
                        {!Nextercheck ? (
                            <a className="she-pink-common-btn" onClick={(e) => install_nexter(e)}>{NexterBtn}</a>
                        ) : (
                            <a className="she-pink-common-btn" onClick={(e) => create_header_temp('nxt_builder')}>{createheaderBtn.btn_one}</a>
                        )}
                    </div>
                </div>
            </>
        )
    }

    const create_header = () => {

        return (
            <div className="she-enbltempl-cover she-onbsec-cover">

                <div className="she-header-main-cover">
                    <div className="she-header-main-cover-left">
                        <h2 className="she-onbrd-crd-h">{__('You\'re All Set! Now, Create Your Sticky Header', 'she-header')}</h2>
                        <p className="she-sm-txt">{__('Everything is set up! Click below to open Elementor Theme Builder and create your Sticky Header effortlessly.', 'she-header')}</p>
                    </div>
                </div>
                <div className="she-btmsm-btn">
                    <a className="she-link-btn" onClick={() => {
                        setOnBoardingStep(onBoardingStep + (selectElementor === 'elementor_pro' ? -2 : -1));
                        Hendalclick('get_updates');
                    }}>Back</a>
                    <div className="she-rit-btn-cover">
                        <a className="she-pink-common-btn" onClick={(e) => create_header_temp('elementor_library')}>{createheaderBtn.btn_two}</a>
                    </div>
                </div>
            </div>
        )
    }




    return (

        <div className="she-onboarding-cover">
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
                                        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0C6.15661 -9.78424e-09 6.80679 0.129329 7.41342 0.380602C8.02004 0.631876 8.57124 1.00017 9.03553 1.46447C9.49983 1.92876 9.86812 2.47995 10.1194 3.08658C10.3707 3.69321 10.5 4.34339 10.5 5C10.5 5.65661 10.3707 6.30679 10.1194 6.91342C9.86812 7.52004 9.49983 8.07124 9.03553 8.53553C8.57124 8.99983 8.02004 9.36812 7.41342 9.6194C6.80679 9.87067 6.15661 10 5.5 10C4.17392 10 2.90215 9.47322 1.96447 8.53553C1.02678 7.59785 0.5 6.32608 0.5 5C0.5 3.67392 1.02678 2.40215 1.96447 1.46447C2.90215 0.526784 4.17392 1.97602e-08 5.5 0ZM7.26667 3.47L4.875 5.86833L3.71167 4.705C3.67293 4.66626 3.62694 4.63553 3.57632 4.61456C3.5257 4.5936 3.47145 4.58281 3.41667 4.58281C3.36188 4.58281 3.30763 4.5936 3.25701 4.61456C3.2064 4.63553 3.16041 4.66626 3.12167 4.705C3.08293 4.74374 3.0522 4.78973 3.03123 4.84035C3.01026 4.89096 2.99947 4.94521 2.99947 5C2.99947 5.05479 3.01026 5.10904 3.03123 5.15965C3.0522 5.21027 3.08293 5.25626 3.12167 5.295L4.58 6.75333C4.6187 6.79214 4.66468 6.82292 4.71531 6.84393C4.76593 6.86493 4.82019 6.87574 4.875 6.87574C4.92981 6.87574 4.98407 6.86493 5.03469 6.84393C5.08532 6.82292 5.1313 6.79214 5.17 6.75333L7.85667 4.05833C7.93246 3.97964 7.97432 3.87433 7.97322 3.76508C7.97212 3.65583 7.92815 3.55138 7.85078 3.47423C7.77342 3.39709 7.66884 3.35341 7.55959 3.35262C7.45034 3.35183 7.34514 3.39398 7.26667 3.47Z"
                                            fill="#14C38E" /></svg>
                                    ) : (
                                        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0C6.15661 -9.78424e-09 6.80679 0.129329 7.41342 0.380602C8.02004 0.631876 8.57124 1.00017 9.03553 1.46447C9.49983 1.92876 9.86812 2.47995 10.1194 3.08658C10.3707 3.69321 10.5 4.34339 10.5 5C10.5 5.65661 10.3707 6.30679 10.1194 6.91342C9.86812 7.52004 9.49983 8.07124 9.03553 8.53553C8.57124 8.99983 8.02004 9.36812 7.41342 9.6194C6.80679 9.87067 6.15661 10 5.5 10C4.17392 10 2.90215 9.47322 1.96447 8.53553C1.02678 7.59785 0.5 6.32608 0.5 5C0.5 3.67392 1.02678 2.40215 1.96447 1.46447C2.90215 0.526784 4.17392 1.97602e-08 5.5 0ZM7.26667 3.47L4.875 5.86833L3.71167 4.705C3.67293 4.66626 3.62694 4.63553 3.57632 4.61456C3.5257 4.5936 3.47145 4.58281 3.41667 4.58281C3.36188 4.58281 3.30763 4.5936 3.25701 4.61456C3.2064 4.63553 3.16041 4.66626 3.12167 4.705C3.08293 4.74374 3.0522 4.78973 3.03123 4.84035C3.01026 4.89096 2.99947 4.94521 2.99947 5C2.99947 5.05479 3.01026 5.10904 3.03123 5.15965C3.0522 5.21027 3.08293 5.25626 3.12167 5.295L4.58 6.75333C4.6187 6.79214 4.66468 6.82292 4.71531 6.84393C4.76593 6.86493 4.82019 6.87574 4.875 6.87574C4.92981 6.87574 4.98407 6.86493 5.03469 6.84393C5.08532 6.82292 5.1313 6.79214 5.17 6.75333L7.85667 4.05833C7.93246 3.97964 7.97432 3.87433 7.97322 3.76508C7.97212 3.65583 7.92815 3.55138 7.85078 3.47423C7.77342 3.39709 7.66884 3.35341 7.55959 3.35262C7.45034 3.35183 7.34514 3.39398 7.26667 3.47Z"
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
})

export default connect(get_redux)(Onboarding)