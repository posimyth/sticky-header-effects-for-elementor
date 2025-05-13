import React, { useState, useEffect, useRef } from 'react';
import './support.scss'
import { connect } from 'react-redux';
import { __ } from '@wordpress/i18n';

const SupportToggle = (props) => {

    var she_version = shed_data.shed_wp_version;
    var she_wp_version = shed_data.she_wp_version;

    const supportUrl = 'https://wordpress.org/support/plugin/sticky-header-effects-for-elementor/';
    const youtubeUrl = 'https://www.youtube.com/c/POSIMYTHInnovations/?sub_confirmation=1';
    const twitterUrl = 'https://twitter.com/posimyth';
    const instagramUrl = 'https://www.instagram.com/posimyth';

    const [isOpen, setIsOpen] = useState(false);
    const [showBackTop, setShowBackTop] = useState(false);
    const lastScrollTop = useRef(0);

    const animSvg = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="14" fill="none" stroke="#727272"> <path className="arrow-one" d="M1 15l7-7-7-7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /> <path className="arrow-two" d="M1 15l7-7-7-7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /> <path className="arrow-three" d="M1 15l7-7-7-7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScrollTop > 100 && currentScrollTop < lastScrollTop.current) {
                setShowBackTop(true);
            } else {
                setShowBackTop(false);
            }
            lastScrollTop.current = currentScrollTop <= 0 ? 0 : currentScrollTop;
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.she-dashsu-toggle') && !event.target.closest('.she-sup-top') && !event.target.closest('.she-sup-inner')) {
                setIsOpen(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.body.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.body.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    return (
        <>
            {/* {(window.location.hash == '#/widgets') &&
                <div className={'tpae-back-top' + (showBackTop ? ' visible' : '')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none" viewBox="0 0 50 50"><rect width="50" height="50" fill="#6c5cff" rx="25" /><path fill="#fff" d="M32.798 26.587a1.37 1.37 0 0 1-.972-.41l-6.773-6.774-6.774 6.774a1.368 1.368 0 0 1-1.93-1.861l7.732-7.745a1.368 1.368 0 0 1 1.935-.008l.008.008 7.732 7.745c.53.534.53 1.396 0 1.93a1.37 1.37 0 0 1-.958.341Z" /><path fill="#fff" d="M25.053 38a1.368 1.368 0 0 1-1.369-1.368V17.474a1.368 1.368 0 1 1 2.737 0v19.158c0 .755-.613 1.368-1.368 1.368ZM33.263 14.737h-16.42a1.368 1.368 0 1 1 0-2.737h16.42a1.368 1.368 0 1 1 0 2.737Z" /></svg>
                </div>
            } */}

            <div className="she-dashsu-toggle" onClick={handleToggle} title={__('Need Help?', 'tpebl')} >
                {isOpen ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none" viewBox="0 0 320 512"><path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z"></path></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none" viewBox="0 0 384 512"><path d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z" /></svg>
                }
            </div>

            {isOpen &&
                <a href="https://posimyth.com/?utm_source=wpbackend&utm_medium=dashboard&utm_campaign=plussettings" className="she-support-bottom" target="_blank" rel="noopener noreferrer"> Powered by POSIMYTH Innovations </a>
            }

            <div className={`she-dashsu-content ${isOpen ? 'active' : ''}`}>
                <div className="she-sup-top">
                    <h3 className="she-section-heading"> {__('Quick Support', 'tpebl')}</h3>
                    <span className="she-sup-label">
                       {__('FREE VERSION', 'tpebl')}
                    </span>
                </div>
                <div className="she-sup-inner">
                    <div className="she-sup-wrap">
                        <div className="she-sup-list">
                            <a href={supportUrl} target="_blank" className="tpae-sup-link" rel="noopener noreferrer">
                                <span className="she-title-wrap">
                                    {__('Get Free Support', 'tpebl')}
                                </span>
                                {animSvg}
                            </a>
                        </div>
                        <div className="she-sup-list">
                            <a href='https://wordpress.org/plugins/sticky-header-effects-for-elementor/#developers' target="_blank" className="tpae-sup-link" rel="noopener noreferrer">
                                <span className="she-title-wrap">{__('What\'s New?', 'tpebl')} </span>
                                {animSvg}
                            </a>
                        </div>
                        <div className="she-sup-list">
                            <a href="https://www.facebook.com/groups/theplus4elementor" target="_blank" className="tpae-sup-link" rel="noopener noreferrer">
                                <span className="she-title-wrap"> {__('Join Facebook Community', 'tpebl')} </span>
                                {animSvg}
                            </a>
                        </div>
                        <div className="she-sup-list">
                            <a href="https://roadmap.theplusaddons.com/boards/feature-request" target="_blank" className="tpae-sup-link" rel="noopener noreferrer">
                                <span className="she-title-wrap"> {__('Suggest New Features', 'tpebl')} </span>
                                {animSvg}
                            </a>
                        </div>
                        <div className="she-sup-list">
                            <a href="https://roadmap.theplusaddons.com/boards/feature-request" target="_blank" className="tpae-sup-link" rel="noopener noreferrer">
                                <span className="she-title-wrap">  {__('Report Bug', 'tpebl')} </span>
                                {animSvg}
                            </a>
                        </div>
                    </div>

                    <div className="she-panel-row">
                        <a href={youtubeUrl} className="tpae-panel-col tpae-social-link" title="Youtube" target="_blank" rel="noopener noreferrer">
                            <span>
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0C21.732 0 28 6.26801 28 14ZM20.8613 8.84305C21.1047 9.08822 21.2794 9.39305 21.368 9.727C21.696 10.959 21.697 13.529 21.697 13.529C21.697 13.529 21.697 16.1 21.369 17.332C21.2795 17.6632 21.104 17.9647 20.8602 18.2061C20.6164 18.4474 20.3131 18.6199 19.981 18.706C18.757 19.036 13.849 19.036 13.849 19.036C13.849 19.036 8.94 19.036 7.716 18.706C7.041 18.525 6.508 18.012 6.328 17.332C6 16.099 6 13.529 6 13.529C6 13.529 6 10.959 6.328 9.727C6.41664 9.39293 6.59153 9.08802 6.83513 8.84284C7.07874 8.59765 7.38251 8.4208 7.716 8.33C8.94 8 13.849 8 13.849 8C13.849 8 18.757 8 19.981 8.33C20.3143 8.42095 20.6179 8.59787 20.8613 8.84305ZM12.243 11.196V15.863L16.346 13.529L12.243 11.196Z" fill="rgb(157, 26, 79)" /></svg>
                            </span>
                        </a>
                        <a href={twitterUrl} className="tpae-panel-col tpae-social-link" title="Twitter" target="_blank" rel="noopener noreferrer">
                            <span>
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0C21.732 0 28 6.26801 28 14ZM20.91 6L15.173 12.67L21.413 21.751H16.823L12.621 15.636L7.361 21.751H6.001L12.018 14.757L6 6.001H10.59L14.569 11.792L19.55 6H20.91ZM12.701 13.963L13.311 14.835L17.463 20.774H19.551L14.463 13.496L13.853 12.624L9.939 7.024H7.851L12.701 13.963Z" fill="rgb(157, 26, 79)" /></svg>
                            </span>
                        </a>
                        <a href='https://www.facebook.com/tpaelementor' className="tpae-panel-col tpae-social-link" title="Facebook" target="_blank" rel="noopener noreferrer">
                            <span>
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0C21.732 0 28 6.26801 28 14ZM15.3273 6.22222L17.3172 6.22567C17.4898 6.22602 17.6296 6.37741 17.6296 6.56401V9.09701C17.6296 9.28378 17.4896 9.43534 17.3169 9.43534L15.9764 9.43586C15.0523 9.43586 14.8832 9.82528 14.8832 10.5924V12.1884H17.2233C17.3064 12.1884 17.3862 12.2242 17.4448 12.2877C17.5034 12.3512 17.5364 12.4372 17.5364 12.5269L17.5354 15.2548C17.5354 15.4418 17.3954 15.5932 17.2225 15.5932H14.8832V22.4765C14.8832 22.6633 14.7432 22.8148 14.5703 22.8148H11.9599C11.787 22.8148 11.647 22.6634 11.647 22.4765V15.5932H9.64623C9.4735 15.5932 9.33333 15.4418 9.33333 15.2548V12.5269C9.33333 12.34 9.47334 12.1884 9.64623 12.1884H11.647V10.3057C11.647 7.82498 13.0917 6.22222 15.3273 6.22222Z" fill="rgb(157, 26, 79)" /></svg>
                            </span>
                        </a>
                        <a href={instagramUrl} className="tpae-panel-col tpae-social-link" title="Instagram" target="_blank" rel="noopener noreferrer">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="none" viewBox="0 0 27 27"><circle cx="13.5" cy="13.5" r="13.5" fill="rgb(157, 26, 79)" /><path fill="#ffffff" d="M13.503 9.962a3.529 3.529 0 0 0-3.534 3.535 3.529 3.529 0 0 0 3.534 3.535 3.529 3.529 0 0 0 3.535-3.535 3.529 3.529 0 0 0-3.535-3.535Zm0 5.833a2.302 2.302 0 0 1-2.297-2.298 2.3 2.3 0 0 1 2.297-2.298 2.3 2.3 0 0 1 2.298 2.298 2.302 2.302 0 0 1-2.298 2.298Zm4.504-5.977c0 .458-.37.824-.825.824a.824.824 0 1 1 .824-.824Zm2.34.837c-.051-1.105-.304-2.083-1.113-2.889-.806-.806-1.784-1.058-2.888-1.114-1.138-.064-4.55-.064-5.688 0-1.101.053-2.08.305-2.889 1.11-.809.807-1.058 1.785-1.113 2.89-.065 1.138-.065 4.55 0 5.687.052 1.105.304 2.083 1.113 2.889.81.806 1.785 1.058 2.889 1.113 1.138.065 4.55.065 5.688 0 1.104-.052 2.082-.304 2.888-1.113.806-.806 1.058-1.784 1.114-2.889.065-1.138.065-4.546 0-5.684Zm-1.47 6.906a2.326 2.326 0 0 1-1.31 1.31c-.907.36-3.06.277-4.064.277-1.002 0-3.159.08-4.063-.277a2.326 2.326 0 0 1-1.31-1.31c-.36-.908-.278-3.061-.278-4.064 0-1.003-.08-3.16.277-4.064a2.326 2.326 0 0 1 1.31-1.31c.908-.36 3.062-.277 4.064-.277 1.003 0 3.16-.08 4.064.277.603.24 1.067.704 1.31 1.31.36.908.277 3.061.277 4.064 0 1.003.083 3.16-.276 4.064Z" /></svg>
                            </span>
                        </a>
                        <a href='https://store.posimyth.com/affiliate-program' className="tpae-panel-col tpae-social-link" title="Affiliate" target="_blank" rel="noopener noreferrer">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="none" viewBox="0 0 27 27"><circle cx="13.5" cy="13.5" r="13.5" fill="rgb(157, 26, 79)" /><g clipPath="url(#a)"><path fill="#ffffff" d="M7.687 11.16a.706.706 0 0 0-.748.652.703.703 0 0 0 .656.748c3.519.23 6.612 3.301 6.844 6.843.025.375.332.66.675.66l.047-.002a.703.703 0 0 0 .656-.747c-.249-4.223-3.908-7.882-8.13-8.155Zm.188-4.223a.937.937 0 1 0 0 1.875c5.687 0 10.313 4.626 10.313 10.313a.937.937 0 1 0 1.875 0c0-6.72-5.467-12.188-12.188-12.188Zm.911 9.372c-1.01 0-1.848.841-1.848 1.878 0 1.038.838 1.875 1.848 1.875 1.01 0 1.878-.838 1.878-1.875a1.862 1.862 0 0 0-1.878-1.878Z" /></g><defs><clipPath id="a"><path fill="#fff" d="M6 6h15v15H6z" /></clipPath></defs></svg>
                            </span>
                        </a>
                        <a href='https://theplusaddons.com/blog/' className="tpae-panel-col tpae-social-link" title="blog" target="_blank" rel="noopener noreferrer">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="none" viewBox="0 0 27 27"><circle cx="13.5" cy="13.5" r="13.5" fill="rgb(157, 26, 79)" /><path fill="#ffffff" d="M13.994 18.135a5.613 5.613 0 0 1-1.633-.22 3.999 3.999 0 0 1-1.386-.804 1.025 1.025 0 0 1-.26-.324.805.805 0 0 1-.09-.363c0-.199.07-.371.207-.518a.719.719 0 0 1 .545-.234c.164 0 .31.052.44.156.329.268.652.47.972.61.328.137.73.206 1.205.206.32 0 .614-.047.882-.142.267-.104.483-.238.648-.402a.826.826 0 0 0 .246-.583.98.98 0 0 0-.234-.66c-.155-.182-.393-.333-.712-.454-.32-.13-.726-.23-1.218-.299a5.687 5.687 0 0 1-1.232-.31 3.126 3.126 0 0 1-.894-.545 2.268 2.268 0 0 1-.531-.777 2.7 2.7 0 0 1-.181-1.011c0-.562.142-1.041.427-1.439.294-.397.687-.7 1.18-.907a4.167 4.167 0 0 1 1.632-.31c.562 0 1.08.086 1.555.258.484.165.877.376 1.18.635.25.2.375.428.375.687 0 .19-.073.363-.22.519a.69.69 0 0 1-.518.233.568.568 0 0 1-.35-.117 2.21 2.21 0 0 0-.557-.337 4.183 4.183 0 0 0-.739-.272 2.762 2.762 0 0 0-1.672.026c-.25.095-.44.225-.57.389a.894.894 0 0 0-.194.57c0 .26.073.475.22.648.155.164.376.298.66.402a8.33 8.33 0 0 0 1.025.259c.518.095.972.207 1.36.337.398.13.726.298.985.505.26.199.454.454.583.765.13.302.195.674.195 1.114 0 .562-.156 1.046-.467 1.452a2.98 2.98 0 0 1-1.23.933 4.08 4.08 0 0 1-1.634.324Zm.933.7c0 .224-.077.41-.233.557a.734.734 0 0 1-.557.233.719.719 0 0 1-.544-.233.755.755 0 0 1-.22-.558V8.416a.776.776 0 0 1 .79-.79c.224-.001.406.077.544.232.147.147.22.333.22.558v10.418Z" /></svg>
                            </span>
                        </a>

                    </div>
                    <div className="she-panel-row" style={{ justifyContent: 'center', columnGap: '10px' }}>
                        <span className="she-version-info"> {__('WordPress Version: ', 'tpebl') + she_wp_version} </span><span>|</span>
                        <span className="she-version-info"> {__('Plugin Version: ', 'tpebl') + she_version} </span>
                    </div>
                </div>

            </div>
        </>
    )
}


export default SupportToggle;