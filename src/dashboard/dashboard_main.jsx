import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import routes from '../router/routes.js';
import NavBox from './navigation_box/navbox';
import { connect } from 'react-redux';
import { __ } from '@wordpress/i18n';
import Onboarding from './onboarding/onboarding.jsx';


const Dashboard = (props) => {

    var check_onboarding = props.she_dashboard_data?.check_onboarding;

    const Outside_click = (e) => {

        let drop_down = document.querySelectorAll(".she_ctm_drpdwn_content.theplus_wp_show")
        if (!e.target.closest(".she_ctm_drpdwn_header") && drop_down) {
            drop_down.forEach((content) => {
                content.classList.remove("theplus_wp_show");
            })
        }
    }

    return (
        <>
            {typeof check_onboarding === 'boolean' && !check_onboarding ? (
                <Onboarding />
            ) : (
                <div className='she_dashboard_main_cover' onClick={(e) => { Outside_click(e); }}>
                    <div className='she_main_cover'>
                        <div className='she_navbox_cover'>
                            <NavBox />
                        </div>
                        <div className='she_dash_inner_main_cover'>
                            <Routes>
                                {routes.map((route, index) => (
                                    <Route key={index} path={route.path} element={route.element} />
                                ))}
                            </Routes>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}

const get_redux = state => ({
    plugin_check: state.check_plugin.plugin_status_rx,
    she_dashboard_data: state.Dashboard_data.db_rx,
})

export default connect(get_redux)(Dashboard);