import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import routes from '../router/routes.js';
import NavBox from './navigation_box/navbox';
import ElementorWidgetsBanner from './elementor_widgets_banner/elementor_banner';
import { connect } from 'react-redux';
import { __ } from '@wordpress/i18n';

const Dashboard = (props) => {

    
    // var tpae_pro = tpae_db_object.tpae_pro;

    const Outside_click = (e) => {

        let drop_down = document.querySelectorAll(".tpae_ctm_drpdwn_content.theplus_wp_show")
        if (!e.target.closest(".tpae_ctm_drpdwn_header") && drop_down) {
            drop_down.forEach((content) => {
                content.classList.remove("theplus_wp_show");
            })
        }
    }

    return (
        <>
            <div className='theplus_dashboard_main_cover' onClick={(e) => { Outside_click(e); }}>
                <div className='tpae_main_cover'>
                    <div className='theplus_navbox_cover'>
                        <NavBox />
                    </div>
                    <div className='tpae_dash_inner_main_cover'>
                        <Routes>
                            {routes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />))
                            }
                        </Routes>
                    </div>
                </div>

                {/* {'0' == tpae_pro && */}
                    <ElementorWidgetsBanner />
                {/* } */}
            </div>
        </>
    )
}

const get_redux = state => ({
    plugin_check: state.check_plugin.plugin_status_rx,
})

export default connect(get_redux)(Dashboard);