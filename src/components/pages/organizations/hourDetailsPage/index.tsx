import { PageRoute } from '@utils/types/router.type';

import AppContainer from '@layouts/containers/appContainer';

import HourDetailView from './hourDetailView';

type HourDetailsPageProps = {
  routeInfo: PageRoute;
};

export default function HourDetailsPage({ routeInfo }: HourDetailsPageProps) {
  return <AppContainer routeInfo={routeInfo} contentColumn={<HourDetailView />} rightColumn={<></>} />;
}
