import React from 'react';
import { HashRouter } from 'react-router-dom';
import Dashboard from './dashboard/dashboard_main.jsx';
import CheckUrl from './router/CheckUrl.js';
import SupportToggle from './dashboard/support/support.jsx';


const App = () => {

    return  (
        <HashRouter> 
            <CheckUrl />
            <Dashboard />
            <SupportToggle />
        </HashRouter>
    )
}

export default App; 