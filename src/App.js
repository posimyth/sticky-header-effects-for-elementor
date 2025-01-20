import React from 'react';
import { HashRouter } from 'react-router-dom';
// import Dashboard from './dashboard/dashboard_main.jsx';
import CheckUrl from './router/CheckUrl.js';

const App = () => {

    return  (
        <HashRouter> 
            <CheckUrl />
            {/* <Dashboard /> */}

            <h2 className='app-title'>Job Place App</h2>
            <hr />
        </HashRouter>
    )
}

export default App; 