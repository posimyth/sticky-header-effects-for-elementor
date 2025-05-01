import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

const NotFound = (props) => {

    return (
        <div className='she_no_wid_cover'>
            <div className='she_nowid_info she_field_card she-section-heading-cover'>
                <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M13.995 0C21.2523 0 27.1379 5.88553 27.1379 13.1429C27.1379 20.4002 21.2523 26.2857 13.995 26.2857C6.73768 26.2857 0.852142 20.4002 0.852142 13.1429C0.852142 5.88553 6.73768 0 13.995 0ZM12.587 14.2738V7.50935C12.587 6.73386 13.2195 6.10131 13.995 6.10131C14.7705 6.10131 15.403 6.73974 15.403 7.50935V14.2738C15.403 15.0434 14.7705 15.6819 13.995 15.6819C13.2195 15.6819 12.587 15.0493 12.587 14.2738ZM13.9889 17.192C14.8702 17.192 15.5849 17.9068 15.5849 18.7879C15.5849 19.6692 14.8702 20.3839 13.9889 20.3839C13.1078 20.3839 12.393 19.6692 12.393 18.7879C12.393 17.9068 13.1078 17.192 13.9889 17.192Z" fill="#9d1a4f" /></svg>
                <h3 className='she-section-heading'>{__('Oops, No Extension Found!', 'she-header')}</h3>
                <p className='she_card_descrip'>{__('Please try searching with an alternative')} <br /> {__('or more common term!', 'she-header')}</p>
            </div>

            <div className='she_btm_nowid_crds'>
                <div className='she_nowid_info she_field_card she-section-heading-cover'>
                    <svg width="33" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16.665" cy="16" r="15.68" fill="#fff" stroke="#9d1a4f" strokeWidth=".64" /><path  fillRule="evenodd" clipRule="evenodd" d="M18.263 9.334c-.737 0-1.334.596-1.334 1.333V14c0 .736.597 1.334 1.334 1.334h3.333c.736 0 1.333-.598 1.333-1.334v-3.333c0-.737-.597-1.333-1.333-1.333h-3.333Zm0 1.333h3.333V14h-3.333v-3.333ZM10.93 12a1.334 1.334 0 0 0-1.334 1.333v8a1.333 1.333 0 0 0 1.334 1.334h8a1.333 1.333 0 0 0 1.333-1.334V18a1.333 1.333 0 0 0-1.333-1.333h-3.334v-3.334A1.333 1.333 0 0 0 14.263 12H10.93Zm0 9.333V18h3.333v3.333H10.93Zm0-4.666h3.333v-3.334H10.93v3.334Zm4.666 4.666V18h3.334v3.333h-3.334Z" fill="#9d1a4f" /><defs><linearGradient id="a" x1="16.665" y1="0" x2="16.665" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#6D68FE" /><stop offset="1" stopColor="#B446FF" /></linearGradient><linearGradient id="b" x1="16.263" y1="9.334" x2="16.263" y2="22.667" gradientUnits="userSpaceOnUse"><stop stopColor="#6D68FE" /><stop offset="1" stopColor="#B446FF" /></linearGradient></defs></svg>
                    <h3 className='she-section-heading'>{__('WordPress Widgets Library from WDesignKit', 'she-header')}</h3>
                    <p className='she_card_descrip'>{__('Explore our curated selection of pre-built Widgets for Elementor from the WDesignKit Widgets Library.', 'she-header')}</p>
                    <a href='https://wdesignkit.com/widgets?builder=1' target='_blank' rel="noopener noreferrer" className='she-ghost-btn'>{__('View Widgets Library*', 'she-header')}</a>
                    <span className='she_sm_txt'>{__('* WDesignKit Plugin Required', 'she-header')}</span>
                </div>

                <div className='she_nowid_info she_field_card she-section-heading-cover'>
                    <svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="15.995" cy="16" r="15.68" fill="#fff" strokeWidth=".64" stroke="#9d1a4f" /><path fillRule="evenodd" clipRule="evenodd" d="M17.488 10.02c.357.09.575.451.485.809l-2.666 10.666a.667.667 0 1 1-1.294-.323l2.667-10.667a.667.667 0 0 1 .808-.485Zm-4.357 2.842c.26.26.26.682 0 .943L10.936 16l2.195 2.195a.667.667 0 0 1-.943.943l-2.666-2.666a.667.667 0 0 1 0-.943l2.666-2.667c.26-.26.683-.26.943 0Zm5.724 0c.26-.26.683-.26.943 0l2.667 2.667a.667.667 0 0 1 0 .943l-2.667 2.666a.667.667 0 1 1-.943-.943L21.05 16l-2.195-2.195a.667.667 0 0 1 0-.943Z" fill="#9d1a4f" /><defs><linearGradient id="a" x1="15.995" y1="0" x2="15.995" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#6D68FE" /><stop offset="1" stopColor="#B446FF" /></linearGradient><linearGradient id="b" x1="15.993" y1="10" x2="15.993" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#6D68FE" /><stop offset="1" stopColor="#B446FF" /></linearGradient></defs></svg>
                    <h3 className='she-section-heading'>{__('Developer? Create Your Custom Elementor Widget', 'she-header')}</h3>
                    <p className='she_card_descrip'>{__('With WDesignKit, you can easily', 'she-header')}<br />
                    {__('convert your custom code into a', 'she-header')}<br />
                    {__('Elementor Widget.', 'she-header')}</p>
                    <a href='https://wdesignkit.com/widget-builder/elementor-widget-builder' target='_blank' rel="noopener noreferrer" className='she-ghost-btn'>{__('View Widget Builder*', 'she-header')}</a>
                    <span className='she_sm_txt'>{__('*WDesignKit Plugin Required', 'she-header')}</span>
                </div>

                <div className='she_nowid_info she_field_card she-section-heading-cover'>
                    <svg width="33" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16.325" cy="16" r="15.68" fill="#fff" stroke="#9d1a4f" strokeWidth=".64" /><path  stroke="url(#b)" strokeWidth=".08" d="M8.365 8.04h15.92v15.92H8.365z" /><path fill="#9d1a4f" d="M12.325 13.056a.29.29 0 0 0 .023.127c.017.04.043.077.077.108a.381.381 0 0 0 .256.096h1.217a.396.396 0 0 0 .392-.335c.133-.877.797-1.516 1.98-1.516 1.012 0 1.938.459 1.938 1.562 0 .848-.551 1.239-1.423 1.832-.993.654-1.78 1.418-1.723 2.657l.004.29a.32.32 0 0 0 .11.233.39.39 0 0 0 .26.096h1.195a.389.389 0 0 0 .261-.098.319.319 0 0 0 .108-.236v-.14c0-.96.403-1.24 1.49-1.987.899-.62 1.835-1.306 1.835-2.749 0-2.02-1.882-2.996-3.943-2.996-1.869 0-3.916.789-4.057 3.056Zm2.297 7.705c0 .712.627 1.239 1.49 1.239.899 0 1.517-.527 1.517-1.24 0-.737-.62-1.256-1.518-1.256-.862 0-1.489.519-1.489 1.257Z" /><defs><linearGradient id="a" x1="16.325" y1="0" x2="16.325" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#6D68FE" /><stop offset="1" stopColor="#B446FF" /></linearGradient><linearGradient id="b" x1="16.325" y1="8" x2="16.325" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#6D68FE" /><stop offset="1" stopColor="#B446FF" /></linearGradient><linearGradient id="c" x1="16.325" y1="10" x2="16.325" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#6D68FE" /><stop offset="1" stopColor="#B446FF" /></linearGradient></defs></svg>
                    <h3 className='she-section-heading'>{__('Request for Widget', 'she-header')}</h3>
                    <p className='she_card_descrip'>{__("We're always looking to improve our Widget Library. Share your ideas, and we’ll consider adding them based on user demand.")}</p>
                    <a href='https://roadmap.theplusaddons.com/boards/feature-request' target='_blank' rel="noopener noreferrer" className='she-ghost-btn'>{__('Request Widget', 'she-header')}</a>
                </div>

            </div>
        </div>
    )
}

export default NotFound;