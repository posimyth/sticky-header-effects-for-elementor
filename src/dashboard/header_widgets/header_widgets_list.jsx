import { __ } from '@wordpress/i18n';

const plugin_widgets = [
    {
        name: 'elementor',
        label: __('Elementor', 'she-header'),
        widgets: [
            {
                name: 'she_wodpress_menu',
                label: __('WordPress Menu', 'she-header'),
                demoUrl: '',
                docUrl: 'https://elementor.com/help/nav-menu-widget-pro/',
                videoUrl: '',
                tag: 'pro',
                labelIcon: '',
                type:'elementor',
                keyword: ['elementor menu', 'menu'],
            },
            {
                name: 'she_menu',
                label: __('Menu', 'she-header'),
                demoUrl: '',
                docUrl: 'https://elementor.com/help/the-menu-widget/',
                videoUrl: '',
                tag: 'free',
                labelIcon: '',
                type:'elementor',
                keyword: ['elementor menu', 'menu'],
            },
        ],
    },
    {
        name: 'theplus_addon',
        label: __('The Plus Addons for Elementor', 'she-header'),
        widgets: [
            {
                name: 'she_navigation_menu',
                label: __('Navigation Menu', 'she-header'),
                demoUrl: 'https://theplusaddons.com/widgets/navigation-menu/',
                docUrl: 'https://theplusaddons.com/docs/navigation-menu-widget-settings-overview/',
                videoUrl: 'https://www.youtube.com/embed/ozRGPdEu9qQ',
                tag: 'pro',
                labelIcon: '',
                type:'tpae',
                keyword: ['Navigation', 'Menu', 'Nav', 'Navbar', 'Navigation bar', 'Navigation menu', 'Menu widget', 'Navigation widget', 'Horizontal Mega Menu', 'Horizontal Menu', 'Elementor Menu Widget', 'Vertical Mega Menu', 'Vertical Menu', 'Mega Menu', 'Elementor Menu', 'Elementor Mega Menu', 'Elementor Vertical Menu', 'Vertical Navigation', 'Vertical Navigation Menu', 'Vertical Toggle Menu', 'Vertical Accordion Menu', 'Vertical Collapsible Menu', 'Vertical Expandable Menu', 'Vertical Dropdown Menu', 'Vertical Toggle Navigation', 'Vertical Toggle Menu Widget', 'Elementor Vertical Toggle Menu', 'Elementor Vertical Accordion Menu', 'Elementor Vertical Collapsible Menu', 'Elementor Vertical Expandable Menu', 'Elementor Vertical Dropdown Menu', 'Elementor Vertical Navigation Menu', 'Elementor Vertical Toggle Navigation', 'Sticky navigation', 'Fixed navigation', 'Floating navigation', 'Persistent navigation', 'Scrollable navigation', 'Header navigation', 'Menu bar', 'Sticky menu']
            },
            {
                name: 'she_navigation_menu_lite',
                label: __('Navigation Menu Lite', 'she-header'),
                demoUrl: 'https://theplusaddons.com/widgets/elementor-header-navigation-builder/',
                docUrl: 'https://theplusaddons.com/docs/navigation-menu-lite-widget-settings-overview/',
                videoUrl: 'https://www.youtube.com/embed/ozRGPdEu9qQ',
                tag: 'free',
                labelIcon: '',
                type:'tpae',
                keyword: ['Navigation', 'Menu', 'Nav', 'Navbar', 'Navigation bar', 'Navigation menu', 'Menu bar', 'Menu widget', 'Navigation widget']
            },
        ],
    },
    {
        name:'wdesign_kit',
        label: __('WDesignkit', 'she-header'),
        widgets: [
            {
                name: 'side_sticky_header_menu',
                label: __('Side Sticky Header Menu', 'she-header'),
                demoUrl: 'https://etemplates.wdesignkit.com/widgets/side-sticky-header-menu/?',
                docUrl: '',
                videoUrl: '',
                tag: 'pro',
                labelIcon: '',
                type:'wdkit',
                keyword: ['Side Sticky Header Menu'],
            },
            {
                name: 'toggle_menu',
                label: __('Toggle Menu', 'she-header'),
                demoUrl: 'https://etemplates.wdesignkit.com/widgets/toggle-menu/',
                docUrl: '',
                videoUrl: 'https://www.youtube.com/watch?v=FGbtmXRsKwE',
                tag: 'free',
                labelIcon: '',
                type:'wdkit',
                keyword: ['Toggle Menu'],
            },
        ],
    },
]

export default {plugin_widgets };