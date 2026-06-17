import DashboardInnerMain from '../dashboard/dashboard/dashboard';
import MoreProducts from '../dashboard/more_products/more_products';
import ThemeBuilder from '../dashboard/theme_builder/theme_builder';
import RollBack from '../dashboard/rollback_plugin/rollback';
import ElementorTemplates from '../dashboard/elementor_templates/elementor_templates';
import Extension from '../dashboard/extension/extension';
import Header_widgets from '../dashboard/header_widgets/header_widgets';
import ActivateLicense from '../dashboard/activate_license/activate_license';


const routes = [
  {
    path: '/dashboard_main',
   element: <DashboardInnerMain />
  },
  {
    path: '/more_products',
    element: <MoreProducts />
  },
  {
    path: '/theme_builder',
    element: <ThemeBuilder />
  },
  {
    path: '/rollback_plugin',
    element: <RollBack />
  },
  {
    path: '/',
    element: <ElementorTemplates />
  },
  {
    path: '/extension',
    element: <Extension />
  },
  {
    path: '/header_widgets',
    element: <Header_widgets />
  },
  // The Activate License tab only exists when the Pro plugin is installed.
  // In Free, the sidebar "Upgrade Now" links straight to the pricing page,
  // so the route is not registered (any direct hit falls through to '*').
  ...(typeof shed_data !== 'undefined' && shed_data.shed_pro_installed == 1
    ? [{
        path: '/activate_license',
        element: <ActivateLicense />
      }]
    : []),
  {
    path: '*',
    element: <ElementorTemplates />
  },
];

export default routes;