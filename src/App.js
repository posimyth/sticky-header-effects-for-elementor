import React from 'react';
import { connect } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import Dashboard from './dashboard/dashboard_main.jsx';
import CheckUrl from './router/CheckUrl.js';
import SupportToggle from './dashboard/support/support.jsx';


const App = (props) => {

    var check_onboarding = props.she_dashboard_data?.check_onboarding;

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
    she_dashboard_data: state.Dashboard_data.db_rx,
})

export default connect(get_redux)(App); 