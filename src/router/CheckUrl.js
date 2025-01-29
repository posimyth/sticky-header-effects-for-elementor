import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import { connect } from 'react-redux';
import {
  Dashboard_a_rx,
  plugin_status_a_rx,
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

    var plugin_url = shed_data.shed_url;
    var nonce = shed_data.nonce;
    var ajax_url = shed_data.ajax_url;

    let form = new FormData();
    form.append('action', 'she_dashboard_ajax_call');
    form.append('nonce', nonce);
    form.append('type', 'shed_onload_data');

    var response = await axios.post(ajax_url, form);
    var data = response.data;

    props.tpae_set_plugins(data.plugin_detail);
    props.tpae_set_userinfo(data.user_info);
  };

  return null;
};

const get_redux = state => ({

})

const set_redux = dispatch => ({
  tpae_set_userinfo: data => dispatch(Dashboard_a_rx(data)),
  tpae_set_plugins: data => dispatch(plugin_status_a_rx(data)),
})

export default connect(get_redux, set_redux)(CheckUrl)