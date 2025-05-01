import { combineReducers } from 'redux';
import { 
    Dashboard_data, 
    check_plugin,
    Check_onbording,
    check_theme,
} from "./reducer";

export default combineReducers({
    Dashboard_data,
    check_plugin,
    Check_onbording,
    check_theme,
});