import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';

import { getRoute } from '@utils/configs/routesConfig';
import { PageRoute } from '@utils/types/router.type';
import { useGetOrganizationsQuery } from '@store/slices/organization/organization.slice';

import { Grid } from '@ui/layout';
import { List, ListItem, ListItemIcon, ListItemText } from '@ui/list';
import { CheckCircleOutlineIcon } from '@ui/icons';
import { Typography } from '@ui/typography';

import AppContainer from '@layouts/containers/appContainer';
import ContentContainer from '@globals/contentContainer';
import ActionBanner from '@globals/actionBanner';

import OrgProfileCard from '../organizationProfilePage/orgProfileCard';
import CreateOrgButton from './createOrgButton';
import { useSnackbar } from '@ui/snackBar';
import GroupsAndOrganizations from './groupsAndOrganizations';
import LoadingOrg from '@globals/orgLoading';
import { Organization } from '@utils/types/organization.type';

type OrgPageProps = {
  routeInfo: PageRoute;
};

export default function OrgPage({ routeInfo }: OrgPageProps) {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const {
    data: organization,
    isFetching,
    isLoading,
    isError,
  } = useGetOrganizationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) {
      openSnackbar('Something went wrong', 'error');
    }
  }, [isError]);

  const handleNavigateToCreateOrg = () => {
    navigate(getRoute('private.app.organizations.create'));
  };

  const topElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (topElementRef.current) {
      topElementRef.current.focus();
    }
  }, []);

  return (
    <>
      <AppContainer
        routeInfo={routeInfo}
        contentColumn={
          <Grid container rowSpacing={2}>
            <Grid item flexGrow={1}>
              <ContentContainer size="sm" display="flex" flexDirection="column" alignItems="flex-start">
                <Typography ref={topElementRef} tabIndex={-1} variant="h4" sx={{ mb: 2 }}>
                  My organizations
                </Typography>
                {organization &&
                  Array.isArray(organization) &&
                  organization?.map((orgs: Organization, index) => (
                    <OrgProfileCard
                      key={index}
                      organization={orgs}
                      isLoading={isFetching || isLoading}
                      onViewMore={() => {
                        if (orgs.id) {
                          navigate(getRoute('private.app.organizations.profile', { id: orgs.id }));
                        }
                      }}
                    />
                  ))}
                {isLoading && <LoadingOrg />}

                {!isFetching && (
                  <CreateOrgButton isNoOrgs={isEmpty(organization)} onClick={handleNavigateToCreateOrg} />
                )}
              </ContentContainer>
              <GroupsAndOrganizations />
            </Grid>
          </Grid>
        }
        rightColumn={
          <Grid item xs>
            {!isFetching && !isLoading && isEmpty(organization) && (
              <ActionBanner
                direction="vertical"
                image="/images/organization_banner_icon.svg"
                title="Get your organization on board"
                description={
                  <>
                    Create a profile for your school, business, charity, community group, or government agency, to
                    easily manage your volunteer and donor supporters
                    <List sx={{ mt: 2 }} disablePadding>
                      {['Profile information', 'Causes you care about', 'United Nations Sustainable Development'].map(
                        (item, index) => (
                          <ListItem key={`org-page-${index}`} disableGutters>
                            <ListItemIcon sx={{ minWidth: 36, color: 'success.main' }}>
                              <CheckCircleOutlineIcon />
                            </ListItemIcon>
                            <ListItemText>{item}</ListItemText>
                          </ListItem>
                        )
                      )}
                    </List>
                  </>
                }
                action={{
                  text: 'Create organization profile',
                  onClick: handleNavigateToCreateOrg,
                }}
              />
            )}
          </Grid>
        }
      />
    </>
  );
}
