import React from 'react';
import { connect } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import Dashboard from './dashboard/dashboard_main.jsx';
import CheckUrl from './router/CheckUrl.js';
import SupportToggle from './dashboard/support/support.jsx';


const App = (props) => {

    var check_onboarding = props?.she_onbording_data;

    return (
        <HashRouter>
            <CheckUrl />
            <Dashboard />
            {check_onboarding && (
                <SupportToggle />
            )}
        </HashRouter>
    )
}

const get_redux = state => ({
    she_onbording_data: state.Check_onbording.she_onbording_rx,

})

export default connect(get_redux)(App); 