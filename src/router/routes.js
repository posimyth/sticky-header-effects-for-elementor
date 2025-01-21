import DashboardInnerMain from '../dashboard/dashboard/dashboard';
import MoreProducts from '../dashboard/more_products/more_products';
import ThemeBuilder from '../dashboard/theme_builder/theme_builder';



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
    path: '*',
    element: <DashboardInnerMain />
  },
];

export default routes;