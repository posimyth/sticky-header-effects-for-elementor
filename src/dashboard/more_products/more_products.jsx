import React, { useEffect, useState, useRef } from 'react';
import productsData from './product_list.jsx';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import './more_products.scss'
import axios from 'axios';
import { plugin_status_a_rx } from '../../redux/action.js';
import { theme_status_a_rx } from '../../redux/action.js';
import { __ } from '@wordpress/i18n';

const MoreProducts = (props) => {

    const [Btnloader, setBtnloader] = useState({
        'the-plus-addons-for-elementor-page-builder': 'done',
        'the-plus-addons-for-block-editor': 'done',
        'uichemy': 'done',
        'wdesignkit': 'done',
        'nexter-extension': 'done',
        'nexter': 'done'
    })
    const [ThemeBtnloader, setThemeBtnloader] = useState(false);
    const [BtnInstallName, setBtnInstallName] = useState('Install');
    const [BtnActivelName, setActiveName] = useState('Active Now');

    const pluginInstaller = useRef([]);
    const pluginStatus = useRef(Btnloader);

    var plugin_url = shed_data.shed_url;
    var nonce = shed_data.nonce;
    var ajax_url = shed_data.ajax_url;

    const Navigate = useNavigate();

    useEffect(() => {
        var new_obj = Object.assign({}, Btnloader)


        props?.plugin_check?.length > 0 && props?.plugin_check.map((data) => {
            if (new_obj[data.name]) {
                new_obj = Object.assign({}, new_obj, { [data.name]: data.status })
            }
        })

        if (props?.theme_check) {
            new_obj = Object.assign({}, new_obj, { 'nexter': props?.theme_check?.status });
        }

        setBtnloader(new_obj);

        pluginStatus.current = new_obj;

    }, [props?.plugin_check, props?.theme_check])

    const Get_install_list = async (name, slug) => {
        pluginStatus.current = Object.assign({}, pluginStatus.current, { [name]: 'loading' });
        setBtnloader(pluginStatus.current);

        let loader_array = pluginInstaller.current.filter((p_data) => p_data.status == 'loading')

        if (loader_array.length > 0) {
            pluginInstaller.current.push({ 'status': 'pending', 'data': name, 'type': slug })
        } else {
            pluginInstaller.current.push({ 'status': 'loading', 'data': name, 'type': slug })
            await Install_Plugin(name, slug).then(async (res) => {

                if (undefined != res && pluginInstaller.current.length > 0) {
                    let index = pluginInstaller.current.findIndex((id) => id.status == 'loading');
                    await pluginInstaller.current.splice(index, 1)

                    if (pluginInstaller.current.length > 0) {
                        let next_data = pluginInstaller.current[0].data;
                        let next_type = pluginInstaller.current[0].type;

                        await pluginInstaller.current.splice(0, 1)
                        await Get_install_list(next_data, next_type);
                    }
                }
            })
        }
    }

    const Install_Plugin = async (p_name, p_slug) => {

        let form = new FormData();
        form.append('action', 'she_dashboard_ajax_call');
        form.append('nonce', nonce);
        form.append('type', 'she_plugin_install');
        form.append('slug', p_slug);
        form.append('name', p_name);

        let response = await axios.post(ajax_url, form);

        if (response.success) {
            let old_data = Object.assign({}, pluginStatus.current, { [p_name]: response.status })
            pluginStatus.current = old_data;
            setBtnloader(pluginStatus.current);
        } else {
            let old_data = Object.assign({}, pluginStatus.current, { [p_name]: 'activated' })

            pluginStatus.current = old_data;
            setBtnloader(pluginStatus.current);
        }

        const updatedPluginCheck = props?.plugin_check.map(plugin => {
            const newStatus = pluginStatus.current[plugin.name];
            return {
                ...plugin,
                status: newStatus
            };
        });
        props.tpae_set_plugin_status(updatedPluginCheck);
        return true;
    }

    const get_install_theme = async (name) => {

        setThemeBtnloader(true);

        var form = new FormData();
        form.append('action', 'she_dashboard_ajax_call');
        form.append('nonce', nonce);
        form.append('type', 'she_theme_install');
        form.append('name', name);

        var res = await axios.post(ajax_url, form);

        if (res.data.success) {
            setThemeBtnloader(false);
            setBtnInstallName('Installed');
        } else {
            setThemeBtnloader(false);
            setBtnInstallName('Failed');
        }
    }

    const nexter_theme_active = async (name) => {

        setThemeBtnloader(true);

        let form = new FormData();
        form.append('action', 'she_dashboard_ajax_call');
        form.append('nonce', nonce);
        form.append('type', 'she_activate_theme');
        form.append('theme_slug', name);

        let response = await axios.post(ajax_url, form);

        console.log(response.status);

        if (response.status === 200) {
            setThemeBtnloader(false);
            setActiveName('Activated');
        } else {
            setThemeBtnloader(false);
            setActiveName('Failed');
        }
    }

    const PluginStatusBtn = (name, slug) => {

        if (Btnloader[name] === 'unavailable') {

            return (
                <button className='she-install-btn' onClick={() => { Get_install_list(name, slug) }}>{__('Install & Activate', 'she-header')}</button>
            )

        } else if (Btnloader[name] === 'inactive') {

            return (
                <button className='she-install-btn' onClick={() => { Get_install_list(name, slug) }}>{__('Activate Now', 'she-header')}</button>
            )

        } else if (Btnloader[name] === 'loading') {
            return (
                <button className='she-install-btn'>
                    <span className='she-loading-circle'></span>
                </button>
            )
        } else {
            return (
                <button className='she-install-btn she-success'>
                    {__('Activated', 'she-header')}
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
                        <path d="M9.24735 0.0195866C7.79655 0.156374 6.69379 0.465122 5.48936 1.07089C3.9017 1.86425 2.43135 3.21257 1.46546 4.76021C0.76548 5.87796 0.257115 7.32008 0.0498588 8.7661C-0.0166196 9.22727 -0.0166196 10.7671 0.0498588 11.2283C0.2141 12.3812 0.519118 13.3895 0.996199 14.3548C1.53194 15.4491 2.05985 16.1838 2.92798 17.0554C3.7922 17.9152 4.53911 18.4506 5.59103 18.9665C6.3262 19.326 6.79938 19.5019 7.54628 19.6895C9.50153 20.1819 11.4646 20.0881 13.3729 19.412C13.9595 19.2049 14.9684 18.6968 15.4846 18.3529C16.6656 17.5634 17.7253 16.477 18.4918 15.2732C18.7733 14.8316 19.2269 13.8936 19.4107 13.3739C20.3297 10.7866 20.1694 8.01182 18.961 5.58484C18.4761 4.60779 17.9326 3.83788 17.17 3.05234C16.3332 2.18472 15.4885 1.57114 14.3896 1.0279C13.2321 0.457304 12.1528 0.148558 10.8702 0.031311C10.4713 -0.00386238 9.56801 -0.0116787 9.24735 0.0195866Z" fill="#14C38E" />
                        <path d="M13.8261 6.73158C13.7733 6.75427 12.4461 8.05869 10.8776 9.63534L8.01967 12.4975L6.95643 11.4313C5.80646 10.2819 5.79892 10.2781 5.46712 10.3424C5.28238 10.3764 5.05615 10.6033 5.02222 10.7885C4.95812 11.1288 4.9355 11.1023 6.39087 12.5618C7.84624 14.0212 7.81607 13.9985 8.15918 13.9343C8.28737 13.9116 8.65687 13.5562 11.4432 10.7658C13.7243 8.47837 14.5914 7.58607 14.6216 7.49155C14.7046 7.23822 14.6141 6.966 14.3841 6.79586C14.2672 6.70889 13.9656 6.67487 13.8261 6.73158Z" fill="white" />
                    </svg>
                </button>
            )
        }
    }

    return (
        <div className={`she_products_cover_main she-main-container ${props?.she_dashboard_data?.success ? '' : 'she-skeleton'}`}>
            <div className='she-section-heading-cover'>
                <h3 className='she-section-heading'>{__('More Products', 'she-header')}</h3>

                <div className='she_head_tgl_btn_grp'>
                    <a href='https://posimyth.com/' target='_blank' rel="noopener noreferrer" className='she-purple-common-btn'>{__('Visit Official Website', 'she-header')}</a>
                </div>
            </div>

            {Object.entries(productsData).map(([key, product]) => {

                let index = props.plugin_check.findIndex(item => item.name === product.id),
                    slug = props.plugin_check[index]?.plugin_slug,
                    name = props.plugin_check[index]?.name

                return (
                    <div key={key} className='she_products_box_cover_main'>
                        <div className='she_product_box'>
                            <div className='she_product_logo_title_cover'>
                                <div className='she_product_logo'>
                                    <img src={plugin_url + 'assets/images/products/' + product.logo} draggable={false} />
                                </div>
                                <h4 className='she_product_name she-in-sec-heading'>{product.product_txt}</h4>
                            </div>
                            <div className='she-installation'>

                                {product.id &&
                                    PluginStatusBtn(name, slug)
                                }

                                <a href={product.Product_Url} target='_blank' rel="noopener noreferrer" className='she-ghost-btn'>{__('Learn More', 'she-header')}</a>
                            </div>
                        </div>
                    </div>

                )
            })}

            <div className='she_products_box_cover_main'>
                <div className='she_product_box'>
                    <div className='she_product_logo_title_cover'>
                        <div className='she_product_logo'>
                            <img src={plugin_url + 'assets/images/products/nexter-theme-product-logo.png'} draggable={false} />
                        </div>
                        <h4 className='she_product_name she-in-sec-heading'>{__('Nexter WP Theme', 'she-header')}</h4>
                    </div>
                    <div className='she-installation'>

                        {props?.theme_check?.status === 'unavailable' ? (
                            <button className='she-install-btn' onClick={() => get_install_theme('nexter')}>
                                {ThemeBtnloader ? <span className='she-loading-circle'></span> : BtnInstallName}
                            </button>
                        ) : props?.theme_check?.status === 'inactive' ? (
                            <button className='she-install-btn' onClick={() => nexter_theme_active('nexter')}>
                                {ThemeBtnloader ? <span className='she-loading-circle'></span> : BtnActivelName}
                            </button>
                        ) : (
                            <button className='she-install-btn she-success'>
                                {__('Activated', 'she-header')}
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
                                    <path d="M9.24735 0.0195866C7.79655 0.156374 6.69379 0.465122 5.48936 1.07089C3.9017 1.86425 2.43135 3.21257 1.46546 4.76021C0.76548 5.87796 0.257115 7.32008 0.0498588 8.7661C-0.0166196 9.22727 -0.0166196 10.7671 0.0498588 11.2283C0.2141 12.3812 0.519118 13.3895 0.996199 14.3548C1.53194 15.4491 2.05985 16.1838 2.92798 17.0554C3.7922 17.9152 4.53911 18.4506 5.59103 18.9665C6.3262 19.326 6.79938 19.5019 7.54628 19.6895C9.50153 20.1819 11.4646 20.0881 13.3729 19.412C13.9595 19.2049 14.9684 18.6968 15.4846 18.3529C16.6656 17.5634 17.7253 16.477 18.4918 15.2732C18.7733 14.8316 19.2269 13.8936 19.4107 13.3739C20.3297 10.7866 20.1694 8.01182 18.961 5.58484C18.4761 4.60779 17.9326 3.83788 17.17 3.05234C16.3332 2.18472 15.4885 1.57114 14.3896 1.0279C13.2321 0.457304 12.1528 0.148558 10.8702 0.031311C10.4713 -0.00386238 9.56801 -0.0116787 9.24735 0.0195866Z" fill="#14C38E" />
                                    <path d="M13.8261 6.73158C13.7733 6.75427 12.4461 8.05869 10.8776 9.63534L8.01967 12.4975L6.95643 11.4313C5.80646 10.2819 5.79892 10.2781 5.46712 10.3424C5.28238 10.3764 5.05615 10.6033 5.02222 10.7885C4.95812 11.1288 4.9355 11.1023 6.39087 12.5618C7.84624 14.0212 7.81607 13.9985 8.15918 13.9343C8.28737 13.9116 8.65687 13.5562 11.4432 10.7658C13.7243 8.47837 14.5914 7.58607 14.6216 7.49155C14.7046 7.23822 14.6141 6.966 14.3841 6.79586C14.2672 6.70889 13.9656 6.67487 13.8261 6.73158Z" fill="white" />
                                </svg>
                            </button>
                        )}
                        <a href={'https://nexterwp.com/nexter-theme/'} target='_blank' rel="noopener noreferrer" className='she-ghost-btn'>{__('Learn More', 'she-header')}</a>
                    </div>
                </div>
            </div>
        </div>

    )
}

const get_redux = state => ({
    plugin_check: state.check_plugin.plugin_status_rx,
    theme_check: state.check_theme.theme_status_rx,
    she_dashboard_data: state.Dashboard_data.db_rx,
})

const set_redux = dispatch => ({
    tpae_set_plugin_status: data => dispatch(plugin_status_a_rx(data)),
    tpae_set_theme_status: data => dispatch(theme_status_a_rx(data)),
})

export default connect(get_redux, set_redux)(MoreProducts);