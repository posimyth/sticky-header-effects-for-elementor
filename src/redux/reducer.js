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

const she_widgets_rx = {
    widgets_rx: [],
}

export function widgets_data(state = she_widgets_rx, action) {
    switch (action.type) {
        case 'set_widgets':
            return {
                ...StaticRange,
                widgets_rx: action.data
            }
            break;
        default:
            return state
    }
}

// Set Dashboard Extra Option

const she_extra_option_rx = {
    extra_option_rx: [],
}

export function extra_option_data(state = she_extra_option_rx, action) {
    switch (action.type) {
        case 'set_extra_option':
            return {
                ...StaticRange,
                extra_option_rx: action.data
            }
            break;
        default:
            return state
    }
}

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

const she_lising_data = {
    lising_data_rx: {
        'client_post_type': 'disable',
        'testimonial_post_type': 'disable',
        'team_member_post_type': 'disable',
    },
}

export function Listing_data(state = she_lising_data, action) {
    switch (action.type) {
        case 'set_lising_data':
            return {
                ...StaticRange,
                lising_data_rx: action.data
            }
            break;
        default:
            return state
    }
}

const she_custom_code = {
    custom_code_rx: {
        'custom_css': '',
        'custom_js': '',
    },
}

export function Custom_code(state = she_custom_code, action) {
    switch (action.type) {
        case 'set_custom_code':
            return {
                ...StaticRange,
                custom_code_rx: action.data
            }
            break;
        default:
            return state
    }
}

const she_performance = {
    performance_rx: {
        'plus_cache_option': 'external',
    },
}

export function Performance_data(state = she_performance, action) {
    switch (action.type) {
        case 'set_performance':
            return {
                ...StaticRange,
                performance_rx: action.data
            }
            break;
        default:
            return state
    }
}

const she_white_lable = {
    white_lable_rx: {
        'white_label': '',
    },
}

export function White_label(state = she_white_lable, action) {
    switch (action.type) {
        case 'set_white_lable':
            return {
                ...StaticRange,
                white_lable_rx: action.data
            }
            break;
        default:
            return state
    }
}

const she_wdkit_widgets = {
    wdkit_widgets_rx: [],
}

export function Wdkit_widgets_list(state = she_wdkit_widgets, action) {
    switch (action.type) {
        case 'wdkit_widgets':
            return {
                ...StaticRange,
                wdkit_widgets_rx: action.data
            }
            break;
        default:
            return state
    }
}

const she_license = {
    license_rx: {
        'activations_left': 0,
        'customer_email': '',
        'customer_name': '',
        'is_local': false,
        'item_id': false,
        'expires': '',
        'item_name': '',
        'license': '',
        'license_key': '',
        'license_limit': 0,
        'price_id': 0,
        'site_count': 0,
        'success': 0,
    },
}

export function license_data(state = she_license, action) {
    switch (action.type) {
        case 'set_license':
            return {
                ...StaticRange,
                license_rx: action.data
            }
            break;
        default:
            return state
    }
}