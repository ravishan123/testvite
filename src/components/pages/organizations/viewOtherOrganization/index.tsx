import { createSearchParams, useParams } from 'react-router-dom';
import { useGetOtherOrganizationsQuery } from '@store/slices/organization/organization.slice';
import { PageRoute } from '@utils/types/router.type';
import { Grid } from '@ui/layout';
import ContentContainer from '@globals/contentContainer';

import UnsdgWidget from '@globals/unsdgDisplay/unsdgWidget';
import CausesWidget from '@globals/causesDisplay/causesWidget';
import AppContainer from '@layouts/containers/appContainer';

import { getRoute } from '@utils/configs/routesConfig';
import { useNavigate } from 'react-router-dom';

import OrgProfileCard from './orgProfileCard';
import { UserRoles } from '@utils/enums/roles.enum';
import { useEffect, useRef } from 'react';
import { useTheme } from '@ui/theme';
import ProfileEmptyBanner from '@globals/profileEmptyBanner';
import { Typography } from '@ui/typography';
import { isEmpty } from 'lodash-es';
import OrgNotFound from '@globals/OrgNotFound';

type OrganizationProfilePageProps = {
  routeInfo: PageRoute;
};

export default function ViewOtherOrgProfilePage({ routeInfo }: OrganizationProfilePageProps) {
  const { id: orgId } = useParams() as { id: string };
  const { palette, spacing } = useTheme();
  const {
    data: organization,
    isFetching,
    isLoading,
  } = useGetOtherOrganizationsQuery({ orgId: orgId, contextType: 'publicprofile' });
  const navigate = useNavigate();
  const topElementRef = useRef<HTMLElement | null>(null);

  const onClickNavigate = (locationId: string) => {
    navigate({
      pathname: getRoute('private.app.organizations.profile.edit', { id: orgId }),
      search: createSearchParams({
        context: locationId,
      }).toString(),
    });
  };

  const allowedRoles = new Set([UserRoles.OWNER, UserRoles.SUPERVISOR, UserRoles.COORDINATOR]);

  const isNavigate = organization && allowedRoles.has(organization.user_info?.role as UserRoles);

  useEffect(() => {
    if (isNavigate && organization) {
      navigate(getRoute('private.app.organizations.profile', { id: orgId }));
    }
  }, [isNavigate, organization]);

  useEffect(() => {
    if (topElementRef.current) {
      topElementRef.current.focus();
    }
  }, []);

  return (
    <>
      {isEmpty(organization) && !(isFetching || isLoading) ? (
        <Grid
          width="100%"
          textAlign={'center'}
          alignItems={'center'}
          alignContent="center"
          display="flex"
          flexDirection="column"
          height="100%"
        >
          <OrgNotFound backgroundColor="primary.light" />
        </Grid>
      ) : (
        <AppContainer
          routeInfo={routeInfo}
          backButtonPath={-1}
          contentColumn={
            <Grid container rowSpacing={2}>
              <Grid item flexGrow={1} mb={2}>
                <ContentContainer size={[4, 0, 4, 3]}>
                  <Typography ref={topElementRef} tabIndex={-1} />
                  <OrgProfileCard
                    organization={organization}
                    isLoading={isFetching || isLoading || isNavigate}
                    isCompact={false}
                  />
                </ContentContainer>
              </Grid>

              <Grid container>
                <Grid
                  item
                  xs={12}
                  sx={{
                    bgcolor: palette.common.white,
                    p: spacing(0, 0, 0, 0),
                    borderRadius: 1,
                    mt: 0,
                  }}
                >
                  <ProfileEmptyBanner isOrg />
                </Grid>
              </Grid>
            </Grid>
          }
          rightColumn={
            <>
              <Grid item xs>
                <CausesWidget
                  onEditCausesClick={() => onClickNavigate('causes')}
                  causes={organization?.causes || []}
                  isLoading={isFetching}
                  sort
                  isActionsVisible={false}
                />
              </Grid>
              <Grid item xs>
                <UnsdgWidget
                  onEditUnsdgClick={() => onClickNavigate('unsdg')}
                  sdgs={organization?.sdgs || []}
                  isLoading={isFetching}
                  isActionsVisible={false}
                />
              </Grid>
            </>
          }
        />
      )}
    </>
  );
}
