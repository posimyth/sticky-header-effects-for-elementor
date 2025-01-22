import DashboardInnerMain from '../dashboard/dashboard/dashboard';
import MoreProducts from '../dashboard/more_products/more_products';
import ThemeBuilder from '../dashboard/theme_builder/theme_builder';
import RollBack from '../dashboard/rollback_plugin/rollback';




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
    path: '*',
    element: <DashboardInnerMain />
  },
];

export default routes;