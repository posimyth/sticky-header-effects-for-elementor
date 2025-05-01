import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import routes from '../router/routes.js';
import NavBox from './navigation_box/navbox';
import { connect } from 'react-redux';
import { __ } from '@wordpress/i18n';
import Onboarding from './onboarding/onboarding.jsx';
import SupportToggle from './support/support.jsx';


const Dashboard = (props) => {

    const r_get_onboridng = props?.she_onbording_data;
    const get_onboridng = shed_data.onboarding_setup;

    const [show_obording, setShow_obording] = useState('null');

    useEffect(() => {
        if (get_onboridng == 'hide') {
            setShow_obording('hide');
        }else{
            setShow_obording('show');
        }
    }, [get_onboridng]);
    
    useEffect(() => {
       
        if ( r_get_onboridng?.check_onboarding == 'hide' ) {
            setShow_obording('hide');
        }

        if ( r_get_onboridng?.check_onboarding == 'show' ) {
            setShow_obording('show');
        }
    }, [r_get_onboridng]);

    const Outside_click = (e) => {
        let drop_down = document.querySelectorAll(".she_ctm_drpdwn_content.theplus_wp_show");
        if (!e.target.closest(".she_ctm_drpdwn_header") && drop_down) {
            drop_down.forEach((content) => {
                content.classList.remove("theplus_wp_show");
            });
        }
    };


    return (
        <>
            { show_obording == 'null' ? (
                ''
            ): show_obording !== 'hide' ? (
                <Onboarding />
            ) : (
                <>
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
                 <SupportToggle />
                </>
            )}
        </>
    );
};

const get_redux = state => ({
    plugin_check: state.check_plugin.plugin_status_rx,
    she_dashboard_data: state.Dashboard_data.db_rx,
    she_onbording_data: state.Check_onbording.she_onbording_rx,
});

export default connect(get_redux)(Dashboard);
