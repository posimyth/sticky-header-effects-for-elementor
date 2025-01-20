import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import { connect } from 'react-redux';
import {
  // Dashboard_a_rx,
  // widgets_a_rx,
  // extra_option_a_rx,
  // plugin_status_a_rx,
  // listing_data_a_rx,
  // custom_code_a_rx,
  // performance_a_rx,
  // white_lable_a_rx,
  // license_a_rx,
  // wdkit_widgets_a_rx
} from '../redux/action';

const CheckUrl = (props) => {

  const { pathname } = useLocation();

  useEffect(() => {
    get_onload_dashboard();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const get_onload_dashboard = async () => {

    // var plugin_url = tpae_db_object.tpae_url;
    // var nonce = tpae_db_object.nonce;
    // var ajax_url = tpae_db_object.ajax_url;

    // let plugin_data = [
    //   {
    //     'plugin_slug': 'wdesignkit/wdesignkit.php',
    //     'status': ''
    //   },
    // ]

    // let form = new FormData();
    // form.append('action', 'tpae_dashboard_ajax_call');
    // form.append('nonce', nonce);
    // form.append('type', 'tpae_onload_data');
    // form.append('plugin_data', JSON.stringify(plugin_data));

    // var response = await axios.post(ajax_url, form);
    // var data = response.data;

    // props.tpae_set_white_lable(data.white_label);
    // props.tpae_set_wdkit_widgets(data.wdk_widgets);
    // props.tpae_set_widgets(data.widgets);
    // props.tpae_set_extra_option(data.extra_option);
    // props.tpae_set_plugins(data.plugin_detail);
    // props.tpae_set_listing(data.listing_data);
    // props.tpae_set_custom_data(data.custom_css_js);
    // props.tpae_set_performance(data.performance);
    // props.tpae_set_license(data.license_details);
    // props.tpae_set_userinfo(data.user_info);
  };

  return null;
};

const get_redux = state => ({
  // tpae_dashboard_data: state.Dashboard_data.db_rx,
})

const set_redux = dispatch => ({
  // tpae_set_userinfo: data => dispatch(Dashboard_a_rx(data)),
  // tpae_set_widgets: data => dispatch(widgets_a_rx(data)),
  // tpae_set_extra_option: data => dispatch(extra_option_a_rx(data)),
  // tpae_set_plugins: data => dispatch(plugin_status_a_rx(data)),
  // tpae_set_listing: data => dispatch(listing_data_a_rx(data)),
  // tpae_set_custom_data: data => dispatch(custom_code_a_rx(data)),
  // tpae_set_performance: data => dispatch(performance_a_rx(data)),
  // tpae_set_white_lable: data => dispatch(white_lable_a_rx(data)),
  // tpae_set_license: data => dispatch(license_a_rx(data)),
  // tpae_set_wdkit_widgets: data => dispatch(wdkit_widgets_a_rx(data)),
})

export default connect(get_redux, set_redux)(CheckUrl)