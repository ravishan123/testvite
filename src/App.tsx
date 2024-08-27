import { Suspense } from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { Routes as AppRoutes } from '@utils/configs/routesConfig';
import { renderMainRoutes } from '@utils/functions/renderRoutes';
import PageLoader from '@ui/pageLoader';

function App() {
  const router = createBrowserRouter(createRoutesFromElements(renderMainRoutes(AppRoutes)));

  return (
    <Suspense fallback={<PageLoader open hideBackdrop />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
