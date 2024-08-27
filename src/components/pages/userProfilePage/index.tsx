import { useAppSelector } from '@store/hooks';
import { selectUserPreference } from '@store/slices/profile/profile.slice';
import { PageRoute } from '@utils/types/router.type';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { getRoute } from '@utils/configs/routesConfig';
import { Grid } from '@ui/layout';
import AppContainer from '@layouts/containers/appContainer';
import SectionHeader from '@globals/sectionHeader';
import AvailabilityWidget from '@globals/availabilityWidget';
import UnsdgWidget from '@globals/unsdgDisplay/unsdgWidget';
import CausesWidget from '@globals/causesDisplay/causesWidget';
import SkillsAndTalentsWidget from '@globals/skillsAndTalentsWidget';
import LanguagesWidget from '@globals/languagesWidget';
import ProfileDetailsBanner from './profileDetailsBanner';
import DeedFeed from './deedFeed';

type UserProfilePageProps = {
  routeInfo: PageRoute;
};

export default function UserProfilePage({ routeInfo }: UserProfilePageProps) {
  const { data: preference, isLoading } = useAppSelector(selectUserPreference);
  const navigate = useNavigate();

  const onClickNavigate = (locationId: string) => {
    navigate(
      {
        pathname: getRoute('private.preference'),
        search: createSearchParams({
          context: locationId,
        }).toString(),
      },
      { state: { from: 'profile' } }
    );
  };

  return (
    <AppContainer
      routeInfo={routeInfo}
      contentColumn={
        <Grid container rowSpacing={2} minHeight="100%" flexDirection="column">
          <Grid item flexGrow={0}>
            <ProfileDetailsBanner />
          </Grid>
          <SectionHeader title="Deed feed" />
          <DeedFeed />
        </Grid>
      }
      rightColumn={
        <>
          <Grid item xs>
            <AvailabilityWidget onEditClick={() => onClickNavigate('availability')} />
          </Grid>
          <Grid item xs>
            <SkillsAndTalentsWidget onEditClick={() => onClickNavigate('skills')} />
          </Grid>
          <Grid item xs>
            <CausesWidget
              onEditCausesClick={() => onClickNavigate('causes')}
              causes={preference ? preference?.userCauses : []}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs>
            <UnsdgWidget
              sdgs={preference ? preference?.userSdgs : []}
              isLoading={isLoading}
              onEditUnsdgClick={() => onClickNavigate('unsdg')}
            />
          </Grid>
          <Grid item xs>
            <LanguagesWidget onEditClick={() => onClickNavigate('languages')} />
          </Grid>
        </>
      }
    />
  );
}
