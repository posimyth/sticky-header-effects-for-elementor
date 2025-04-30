import { combineReducers } from 'redux';
import { 
    Dashboard_data, 
    widgets_data, 
    extra_option_data, 
    check_plugin,
    check_theme, 
    Listing_data, 
    Custom_code,
    Performance_data,
    White_label,
    license_data,
    Wdkit_widgets_list,
    Check_onbording,
} from "./reducer";

export default combineReducers({
    Dashboard_data,
    widgets_data,
    extra_option_data,
    check_plugin,
    check_theme,
    Listing_data,
    Custom_code,
    Performance_data,
    White_label,
    license_data,
    Wdkit_widgets_list,
    Check_onbording,
});