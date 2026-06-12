import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import './activate_license.scss';
import { __ } from '@wordpress/i18n';

/**
 * Activate License tab.
 *
 * UI mirrors The Plus Addons "Activate PRO" screen: a license key field with
 * an Activate button, plus "how to find your key" steps. The Activate /
 * Deactivate calls post to the `she_pro_licence_ajax_call` admin-ajax action,
 * which is provided by the Pro plugin's license manager (EDD Software
 * Licensing). When the Pro plugin is not active, the screen still renders and
 * guides the user to install/activate Pro.
 */
const ActivateLicense = (props) => {

    var plugin_url = shed_data.shed_url;
    var nonce = shed_data.nonce;
    var ajax_url = shed_data.ajax_url;
    var pro_installed = shed_data.shed_pro_installed; // 1 = Pro plugin active.

    const [licenseKey, setLicenseKey] = useState('');
    const [status, setStatus] = useState(null);      // 'valid' | 'invalid' | null
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [activated, setActivated] = useState(false);
    const [expires, setExpires] = useState('');
    const [initialLoading, setInitialLoading] = useState(true); // gate first render until status is fetched

    // Apply a status payload (from the backend) to local UI state.
    const applyStatus = (st) => {
        if (st && st.is_valid) {
            setActivated(true);
            setStatus('valid');
            setExpires(st.expires || '');
            if (st.masked_key) {
                setLicenseKey(st.masked_key);
            }
        } else {
            setActivated(false);
            setStatus(null);
            setExpires('');
        }
    };

    // Fetch the current license status on mount. Silently ignores failure
    // (e.g. Pro plugin inactive → no AJAX handler) so the tab still renders.
    useEffect(() => {
        const fetchStatus = async () => {
            let form = new FormData();
            form.append('action', 'she_pro_licence_ajax_call');
            form.append('nonce', nonce);
            form.append('type', 'status');
            try {
                const response = await axios.post(ajax_url, form);
                const res = response?.data;
                if (res && res.success && res.data?.status) {
                    applyStatus(res.data.status);
                }
            } catch (e) {
                // No-op.
            } finally {
                setInitialLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const callLicenseAjax = async (type) => {
        if (type === 'activate_license' && !licenseKey.trim()) {
            setStatus('invalid');
            setMessage(__('Please enter your license key.', 'she-header'));
            return;
        }

        setLoading(true);
        setMessage('');

        let form = new FormData();
        form.append('action', 'she_pro_licence_ajax_call');
        form.append('nonce', nonce);
        form.append('type', type);
        form.append('license', licenseKey.trim());

        try {
            const response = await axios.post(ajax_url, form);
            const res = response?.data;

            if (res && res.success) {
                setMessage(res.data?.message || '');
                if (res.data?.status) {
                    applyStatus(res.data.status);
                }
                if (type === 'deactivate_license') {
                    setLicenseKey('');
                    setExpires('');
                }
                // Keep the sidebar "Activated" label in sync immediately (no refresh).
                const nowLicensed = type !== 'deactivate_license' && !!(res.data?.status && res.data.status.is_valid);
                shed_data.shed_pro = nowLicensed ? 1 : 0;
                window.dispatchEvent(new CustomEvent('she-license-changed', { detail: { licensed: nowLicensed } }));
            } else {
                setStatus('invalid');
                setMessage(
                    (res && res.data && res.data.message)
                        ? res.data.message
                        : __('Could not verify the license. Please check the key and try again.', 'she-header')
                );
            }
        } catch (e) {
            setStatus('invalid');
            setMessage(__('Something went wrong while contacting the license server.', 'she-header'));
        }

        setLoading(false);
    };

    const storeDashboardUrl = 'https://store.posimyth.com/dashboard/';
    const pricingUrl = 'https://stickyheadereffects.com/pricing/?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=upgrade';
    const steps = [
        { text: __('Visit POSIMYTH Store Dashboard', 'she-header'), link: storeDashboardUrl },
        { text: __('Copy the License Key', 'she-header'), link: '' },
        { text: __('Paste the Key here & Hit Activate', 'she-header'), link: '' },
    ];

    // Pro plugin NOT active → show the "Upgrade Now" screen instead of the
    // license form (mirrors The Plus Addons free-version tab). The Free vs Pro
    // comparison table is intentionally skipped for now.
    if (pro_installed != 1) {
        return (
            <div className='she-activate-license-main she-main-container'>
                <div className='she-section-heading-cover'>
                    <h3 className='she-section-heading'>{__('Upgrade Now', 'she-header')}</h3>
                    <a className='she-purple-common-btn' href={pricingUrl} target='_blank' rel='noopener noreferrer'>
                        {__('Upgrade Now', 'she-header')}
                    </a>
                </div>

                <div className='she_license_box_cover_main she_upgrade_box'>
                    <h3 className='she-in-sec-heading'>{__('Unlock Sticky Header Effects Pro', 'she-header')}</h3>
                    <p className='she_upgrade_text'>
                        {__('Upgrade to Pro to unlock 11 powerful features — Display Conditions, Sticky Until, Reveal Animations, Header Replace, Logo Swap, Sticky Menu Styling, and more.', 'she-header')}
                    </p>
                    <a className='she-purple-common-btn she_upgrade_btn' href={pricingUrl} target='_blank' rel='noopener noreferrer'>
                        {__('Upgrade Now', 'she-header')} <span>&rarr;</span>
                    </a>
                </div>
            </div>
        );
    }

    // Pro is active but the license status hasn't returned yet — show a
    // skeleton instead of briefly flashing the "enter key" form.
    if (initialLoading) {
        return (
            <div className='she-activate-license-main she-main-container'>
                <div className='she-section-heading-cover'>
                    <div className='she-main-sections-heading'>
                        <h3 className='she-section-heading'>{__('Activate License', 'she-header')}</h3>
                    </div>
                </div>
                <div className='she_license_box_cover_main she-skeleton'>
                    <div className='she_sk_line she_sk_title'></div>
                    <div className='she_sk_row'>
                        <div className='she_sk_input'></div>
                        <div className='she_sk_btn'></div>
                    </div>
                    <div className='she_sk_line she_sk_msg'></div>
                </div>
            </div>
        );
    }

    return (
        <div className='she-activate-license-main she-main-container'>

            <div className='she-section-heading-cover'>
                <div className='she-main-sections-heading'>
                    <h3 className='she-section-heading'>{__('Activate License', 'she-header')}</h3>
                </div>
            </div>

            <div className='she_license_box_cover_main'>

                <h3 className='she-in-sec-heading she_license_card_title'>
                    {__('Licence Activation', 'she-header')}
                </h3>

                <div className='she_license_field_row'>
                    <input
                        type='text'
                        className='she_license_input'
                        placeholder={__('Enter Your License Key', 'she-header')}
                        value={licenseKey}
                        disabled={activated || loading}
                        onChange={(e) => { setLicenseKey(e.target.value); }}
                    />
                    {!activated ? (
                        <button
                            className={`she-purple-common-btn she_license_btn ${loading ? 'disable' : ''}`}
                            disabled={loading}
                            onClick={() => { callLicenseAjax('activate_license'); }}
                        >
                            {loading ? __('Activating…', 'she-header') : __('Activate', 'she-header')}
                        </button>
                    ) : (
                        <button
                            className={`she-ghost-btn she_license_btn she_license_deactivate ${loading ? 'disable' : ''}`}
                            disabled={loading}
                            onClick={() => {
                                if (!window.confirm(__('Are you sure you want to deactivate Sticky Header Effects for Elementor Pro License Key?', 'she-header'))) { return; }
                                callLicenseAjax('deactivate_license');
                            }}
                        >
                            {loading ? __('Deactivating…', 'she-header') : __('Deactivate', 'she-header')}
                        </button>
                    )}
                </div>

                {activated ? (
                    <p className='she_license_message is-valid'>
                        <span className='she_license_check' aria-hidden='true'>&#10003;</span>
                        {__('Congratulations! License successfully activated.', 'she-header')}
                    </p>
                ) : message ? (
                    <p className='she_license_message is-invalid'>{message}</p>
                ) : null}

                {activated && expires && (
                    <p className='she_license_expiry'>
                        {expires === 'lifetime'
                            ? __('Lifetime license — never expires.', 'she-header')
                            : `${__('Valid until', 'she-header')} ${String(expires).split(' ')[0]}`}
                    </p>
                )}

                {!activated && (
                    <div className='she_license_steps_cover'>
                        <h4 className='she-in-sec-heading'>{__('How to Find the Activation Key?', 'she-header')}</h4>
                        <ul className='she_license_steps'>
                            {steps.map((step, index) => (
                                <li className='she_license_step' key={index}>
                                    <span className='she_license_step_num'>{index + 1}</span>
                                    <span className='she_license_step_text'>
                                        {step.link ? (
                                            <a href={step.link} target='_blank' rel='noopener noreferrer'>{step.text}</a>
                                        ) : step.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p className='she_license_trouble'>
                            {__('Facing Issues?', 'she-header')}{' '}
                            <a
                                href='https://stickyheadereffects.com/docs/?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=license'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {__('Check our troubleshooting guide', 'she-header')}
                            </a>
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

const get_redux = state => ({
    plugin_check: state.check_plugin.plugin_status_rx,
});

export default connect(get_redux)(ActivateLicense);
