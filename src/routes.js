import { Navigate, useRoutes } from 'react-router-dom';

import AuthWrapper from './sections/auth/AuthWrapper';

import PlatformLayout from './layouts/dashboard';
import Catalog from './sections/platform/Catalog/Catalog';
import Cart from './sections/platform/Cart/Cart';

import SimpleLayout from './layouts/simple';

import Page404 from './pages/Page404';
import { useAppContext } from './context/context';

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useAppContext();
  const routes = useRoutes([
    {
      path: '/login',
      element: <AuthWrapper />,
    },
    {
      path: '/',
      element: <PlatformLayout />,
      children: user
        ? [
            { element: <Navigate to="/catalog" />, index: true },
            { path: 'catalog', element: <Catalog /> },
            { path: 'cart', element: <Cart /> },
          ]
        : [
            { element: <Navigate to="/catalog" />, index: true },
            { path: 'catalog', element: <Catalog /> },
          ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/catalog" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
