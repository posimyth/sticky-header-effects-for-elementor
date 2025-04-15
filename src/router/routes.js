import DashboardInnerMain from '../dashboard/dashboard/dashboard';
import MoreProducts from '../dashboard/more_products/more_products';
import ThemeBuilder from '../dashboard/theme_builder/theme_builder';
import RollBack from '../dashboard/rollback_plugin/rollback';
import ElementorTemplates from '../dashboard/elementor_templates/elementor_templates';
import Extension from '../dashboard/extension/extension';
import Header_widgets from '../dashboard/header_widgets/header_widgets';


const routes = [
  {
    path: '/',
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
    path: '/elementor_templates',
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
  {
    path: '*',
    element: <DashboardInnerMain />
  },
];

export default routes;