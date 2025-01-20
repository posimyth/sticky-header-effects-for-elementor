import App from "./App";
import { createRoot } from 'react-dom';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux/index';

/**
 * Import the stylesheet for the plugin.
 */
import './style/main.scss';

// Render the App component into the DOM

const store = createStore(rootReducer);
const rootElement = document.getElementById('she-app');

if ( rootElement ) {
    const root = createRoot(rootElement);

    root.render(
        <Provider store={store}>
            <App />
        </Provider>
    );
}

/**
 * Import the stylesheet for the plugin.
 */
// import './style/main.scss';

// Render the App component into the DOM
// render(<App />, document.getElementById('she-app'));
