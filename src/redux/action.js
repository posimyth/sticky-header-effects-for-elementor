const Dashboard_a_rx = (data) => {
    return {
        type: 'set_dashboard',
        data: data
    }
}

const widgets_a_rx = (data) => {
    return {
        type: 'set_widgets',
        data: data
    }
}

const extra_option_a_rx = (data) => {
    return {
        type: 'set_extra_option',
        data: data
    }
}

const plugin_status_a_rx = (data) => {
    return {
        type: 'set_plugin_status',
        data: data
    }
}

const theme_status_a_rx = (data) => {
    return {
        type: 'set_theme_status',
        data: data
    }
}

const listing_data_a_rx = (data) => {
    return {
        type: 'set_lising_data',
        data: data
    }
}

const custom_code_a_rx = (data) => {
    return {
        type: 'set_custom_code',
        data: data
    }
}

const performance_a_rx = (data) => {
    return {
        type: 'set_performance',
        data: data
    }
}

const white_lable_a_rx = (data) => {
    return {
        type: 'set_white_lable',
        data: data
    }
}

const license_a_rx = (data) => {
    return {
        type: 'set_license',
        data: data
    }
}

const wdkit_widgets_a_rx = (data) => {
    return {
        type: 'wdkit_widgets',
        data: data
    }
}

const she_onbording_a_rx = (data) => {
    
    return {
        type: 'she_onbording',
        data: data
    }
}

export {
    Dashboard_a_rx,
    widgets_a_rx,
    extra_option_a_rx,
    plugin_status_a_rx,
    theme_status_a_rx,
    listing_data_a_rx,
    custom_code_a_rx,
    performance_a_rx,
    white_lable_a_rx,
    license_a_rx,
    wdkit_widgets_a_rx,
    she_onbording_a_rx,
}