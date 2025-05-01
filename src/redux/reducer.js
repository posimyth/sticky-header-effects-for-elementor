// Set Dashboard welcome page

const she_dashboard_rx = {
    db_rx: {
        roles: [''],
        user_image: "",
        user_name: "",
    }
}

export function Dashboard_data(state = she_dashboard_rx, action) {
    switch (action.type) {
        case 'set_dashboard':
            return {
                ...StaticRange,
                db_rx: action.data
            }
            break;
        default:
            return state
    }
}

// Set Dashboard widget page

const she_plugin_check = {
    plugin_status_rx: [
        {
            'wdesignkit': false,
        }
    ],
}

export function check_plugin(state = she_plugin_check, action) {
    switch (action.type) {
        case 'set_plugin_status':
            return {
                ...StaticRange,
                plugin_status_rx: action.data
            }
            break;
        default:
            return state
    }
}

const she_onbording_check = {
    she_onbording_rx: {
        'check_onboarding': 'null'
    }
}

export function Check_onbording(state = she_onbording_check, action) {
    switch (action.type) {
        case 'she_onbording':
            return {
                ...StaticRange,
                she_onbording_rx: action.data
            }
            break;
        default:
            return state
    }
}

const she_theme_check = {
    theme_status_rx: [
        {
            'nexter': false,
        }
    ],
}

export function check_theme(state = she_theme_check, action) {
    switch (action.type) {
        case 'set_theme_status':
            return {
                ...StaticRange,
                theme_status_rx: action.data
            }
            break;
        default:
            return state
    }
}