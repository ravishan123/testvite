import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import PageLoader from '@ui/pageLoader';

export default function NestedOutlet() {
  return (
    <Suspense fallback={<PageLoader open target="component" />}>
      <Outlet />
    </Suspense>
  );
}
