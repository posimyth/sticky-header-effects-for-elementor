import './pro-notice.scss';
import { __ } from '@wordpress/i18n';

const ProNotice = (props) => {
    var plugin_url = tpae_db_object.tpae_url;

    return (
        <>
            <div className={props.parent_class}>
                {props.parent_class == 'tpae_whitlabel_overlay' &&
                    <div className='tpae-pro-overlay-con'></div>
                }
                <div className={props.inner_class}>
                    <span className='theplus-pro-header'>
                        <h4 className='theplus_section_heading'>{props.heading}</h4>
                        {props.close_svg || ''}
                    </span>
                    <ul className='theplus_popup_style_list'>
                        <li className='theplus_popup_list_icon'><img src={plugin_url + 'assets/svg/upgrade_table/theplus_white_check.svg'} alt="Check Icon" />{__('Performance Optimized', 'tpebl')}</li>
                        <li className='theplus_popup_list_icon'><img src={plugin_url + 'assets/svg/upgrade_table/theplus_white_check.svg'} alt="Check Icon" />{__('120+ WordPress Widgets', 'tpebl')}</li>
                        <li className='theplus_popup_list_icon'><img src={plugin_url + 'assets/svg/upgrade_table/theplus_white_check.svg'} alt="Check Icon" />{__('100% Whitelabel Plugin', 'tpebl')}</li>
                    </ul>
                    <a className="she-purple-common-btn" target="_blank" rel="noopener noreferrer" href='https://theplusaddons.com/pricing'><img className='theplus_pro_icon' src={plugin_url + 'assets/svg/premium_icon.svg'} draggable={false} /><span>{__('Upgrade Now', 'tpebl')} </span></a>
                    <p className='theplus_btm_sm_txt'>{__("Use Code 'FIRST20' for FLAT 20%. (Offer applicable for 1st time only)", 'tpebl')}</p>
                </div>
            </div>
        </>
    )
}

export default ProNotice;