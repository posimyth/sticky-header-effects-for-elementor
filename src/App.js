import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import Dashboard from './dashboard/dashboard_main.jsx';
import CheckUrl from './router/CheckUrl.js';
import SupportToggle from './dashboard/support/support.jsx';


const App = (props) => {

    // const r_get_onboridng = props?.she_onbording_data;
    // const get_onboridng = shed_data.onboarding_setup;

    // const [show_obording, setsetShow_obording] = useState(false);

    // useEffect(() => {
    //     setsetShow_obording(false);

    //     if (get_onboridng) {
    //         setsetShow_obording(true);
    //     }
    // }, [get_onboridng]);
    
    // useEffect(() => {
    //     if (r_get_onboridng?.check_onboarding) {
    //         setsetShow_obording(true);
    //     }
    // }, [r_get_onboridng]);

    return (
        <HashRouter>
            <CheckUrl />
            <Dashboard />
            {/* {show_obording && (
                <SupportToggle />
            )} */}
        </HashRouter>
    )
}

const get_redux = state => ({
    she_onbording_data: state.Check_onbording.she_onbording_rx,

})

export default connect(get_redux)(App); 