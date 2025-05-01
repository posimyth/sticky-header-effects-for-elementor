const Dashboard_a_rx = (data) => {
    return {
        type: 'set_dashboard',
        data: data
    }
}

const plugin_status_a_rx = (data) => {
    return {
        type: 'set_plugin_status',
        data: data
    }
}

const she_onbording_a_rx = (data) => {
    
    return {
        type: 'she_onbording',
        data: data
    }
}

const theme_status_a_rx = (data) => {
    return {
        type: 'set_theme_status',
        data: data
    }
}

export {
    Dashboard_a_rx,
    plugin_status_a_rx,
    she_onbording_a_rx,
    theme_status_a_rx,
}