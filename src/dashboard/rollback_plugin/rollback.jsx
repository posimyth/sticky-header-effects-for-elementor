import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import './rollback.scss'
import { __ } from '@wordpress/i18n';

const RollBack = (props) => {

    var plugin_url = shed_data.shed_url;
    var nonce = shed_data.nonce;
    var ajax_url = shed_data.ajax_url;

    const Navigate = useNavigate();
    const [version_list, rollbackver_list] = useState([]);
    const [preloader, setpreloader] = useState('Select Version')
    const [selectedVersion, setSelectedVersion] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        get_prev_versions()
    }, [])

    const get_prev_versions = async () => {
        let form = new FormData();
        form.append('action', 'she_dashboard_ajax_call');
        form.append('nonce', nonce);
        form.append('type', 'she_prev_version');
        form.append('version', 'SHE_HEADER_VERSION');

        var response = await axios.post(ajax_url, form);
        var data = response.data;

        if (data) {
            rollbackver_list(data);
        }
    }

    const select_ver = async (version) => {

        if (version) {
            if (!confirm("Are you sure you want to reinstall the previous version?")) {
                return;
            }
        }

        setLoading(true);

        if (version) {
            let form = new FormData();
            form.append('action', 'she_dashboard_ajax_call');
            form.append('nonce', nonce);
            form.append('type', 'she_rollback_check');
            form.append('version', `${version}`);

            await axios.post(ajax_url, form)
                .then(async () => {
                    var fullUrl = window.location.href;
                    var baseUrl = fullUrl.split('/admin.php')[0];
                    var pluginsUrl = `${baseUrl}/plugins.php`;
                    window.location.href = pluginsUrl;
                })
        }

        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }

    /** custom drop down functionality **/
    const Drop_down_toggle = (e) => {
        let main_object = e.target.closest(".she_ctm_drpdwn")
        let drop_down = main_object.querySelector(".she_ctm_drpdwn_content") ? main_object.querySelector(".she_ctm_drpdwn_content") : "";
        if (drop_down) {
            if (Object.values(drop_down.classList).includes("theplus_wp_show")) {
                drop_down.classList.remove("theplus_wp_show");
            } else {
                drop_down.classList.add("theplus_wp_show");
            }
        }
    }

    return (
        <div className='she_rollback_cover_main she-main-container'>
            <div className='she-section-heading-cover'>
                <div className='she_sec_war_grp'>
                    <h3 className='she-section-heading'>{__('Roll Back Plugin', 'she-header')}</h3>
                </div>
                <div className='she_head_tgl_btn_grp'>

                    {loading ?
                        <button className={`she-purple-common-btn ${!selectedVersion ? 'disabled' : ''}`} disabled={!selectedVersion && !loading}>
                            <span className="she_purple_loader"></span>
                        </button> :
                        <button className={`she-purple-common-btn ${!selectedVersion ? 'disabled' : ''}`} onClick={() => select_ver(selectedVersion)} disabled={!selectedVersion && !loading}>
                            {__('Rollback', 'she-header')}
                        </button>
                    }
                </div>
            </div>
            <div className='she_rollback_content_cover'>
                <div className='she_field_card'>
                    <div className='she_card_top_detail'>
                        <div className='she_field_card_heading_strip'>
                            <label htmlFor="she_lazyload" className='she_field_card_title'>{__('Select Free Version', 'she-header')}</label>
                        </div>
                    </div>
                    <div className='she_field_dropdown'>
                        <div className='she_ctm_drpdwn' onClick={(e) => { Drop_down_toggle(e) }}>
                            <div className='she_ctm_drpdwn_header'>
                                <label htmlFor="she_preloader">{preloader}</label>
                                <img src={plugin_url + 'assets/svg/theplus_chevron_down.svg'} draggable={false} />
                            </div>
                            <div id="she_preloader" className='she_ctm_drpdwn_content'>
                                {version_list.length > 0 && version_list.map((list_data, index) => {
                                    return (
                                        <span value={`${list_data}`} key={index} onClick={() => { setpreloader(list_data); setSelectedVersion(list_data); }}>{list_data}</span>
                                    );
                                })}
                            </div>
                        </div>
                        <div className='she_warning_text'>
                            <img src={plugin_url + 'assets/svg/theplus_warning.svg'} draggable={false} />
                            {__('Warning: Please backup your database before making the rollback.', 'she-header')}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default (RollBack);