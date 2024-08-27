import { useEffect, useRef, useState } from 'react';
import { createSearchParams, useLocation, useParams } from 'react-router-dom';
import {
  useFetchVerificationStatsQuery,
  useGetOtherOrganizationsQuery,
} from '@store/slices/organization/organization.slice';
import { PageRoute } from '@utils/types/router.type';
import { Grid, Box } from '@ui/layout';
import ContentContainer from '@globals/contentContainer';
import SectionHeader from '@globals/sectionHeader';
import ComingSoonBanner from '@globals/comingSoonBanner';
import UnsdgWidget from '@globals/unsdgDisplay/unsdgWidget';
import CausesWidget from '@globals/causesDisplay/causesWidget';
import AppContainer from '@layouts/containers/appContainer';
import OrgCreateConfirmModal from './orgCreateConfirmModal';
import OrgProfileCard from './orgProfileCard';
import { Typography } from '@ui/typography';
import { Avatar } from '@ui/avatar';
import { getRoute } from '@utils/configs/routesConfig';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon, Diversity1OutlinedIcon, AccessTimeIcon, ManageAccountsOutlinedIcon } from '@ui/icons';
import { useTheme, styled } from '@ui/theme';
import { Chip } from '@ui/chip';
import { Action, Role, canPerformAction } from '@utils/functions/permissionMatrix.utils';

type OrganizationProfilePageProps = {
  routeInfo: PageRoute;
};

type OrgCreationLocationProps = {
  state: { organizationCreated: boolean };
};

export type MenuItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
  lineWidth: number;
  navigateTo: string;
  notification?: { visible: boolean; count: number };
  isDisabled: boolean;
};

const ComingSoonTag = styled('span')(({ theme }) => ({
  display: 'inline-block',
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.text.primary,
  padding: '2px 8px',
  borderRadius: 32,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: 2,
  lineHeight: '16px',
  textTransform: 'uppercase',
  marginTop: 16,
  opacity: 0.9,
}));

export default function OrganizationProfilePage({ routeInfo }: OrganizationProfilePageProps) {
  const { palette } = useTheme();
  const { id: orgId } = useParams() as { id: string };
  const {
    data: organization,
    isFetching,
    isLoading,
  } = useGetOtherOrganizationsQuery({
    orgId: orgId,
    contextType: 'vieworg',
  });
  const location: OrgCreationLocationProps = useLocation();
  const [orgCreateModalOpen, setOrgCreateModalOpen] = useState<boolean>(location.state?.organizationCreated);
  const navigate = useNavigate();
  const { data: verificationStats } = useFetchVerificationStatsQuery(orgId, {
    skip: !orgId,
  });

  const onClose = () => {
    setOrgCreateModalOpen(false);
    navigate(getRoute('private.app.organizations.profile', { id: orgId }), { state: { organizationCreated: false } });
  };

  const onClickNavigate = (locationId: string) => {
    navigate({
      pathname: getRoute('private.app.organizations.profile.edit', { id: orgId }),
      search: createSearchParams({
        context: locationId,
      }).toString(),
    });
  };

  const menuItems: MenuItem[] = [
    {
      icon: <Diversity1OutlinedIcon sx={{ width: 24, color: palette.common.black }} />,
      title: 'Manage supporters',
      description: 'View and manage your supporters',
      lineWidth: 138,
      navigateTo: getRoute('private.app.organizations.profile.manageSupporters', { id: organization?.id }),
      isDisabled: false,
    },
    {
      icon: <AccessTimeIcon sx={{ width: 24, color: palette.common.black }} />,
      title: 'Verify hours',
      description: 'Verify hour requests logged by volunteers',
      lineWidth: 160,
      navigateTo: getRoute('private.app.organizations.profile.verifyHours', { id: organization?.id }),
      notification: { visible: true, count: Number(verificationStats?.numOfPendingVerifications) || 0 },
      isDisabled: false,
    },
    {
      icon: <ManageAccountsOutlinedIcon sx={{ width: 24, color: palette.common.black }} />,
      title: 'Manage roles',
      description: 'View and manage your organization profile admins',
      lineWidth: 170,
      navigateTo: getRoute('private.app.organizations.profile.manageRoles', { id: organization?.id }),
      isDisabled: false,
    },
  ];

  const viewAction = `${Action.VIEW_ORG_PROFILE}` as Action;
  const editAction = `${Action.Edit_ORG}` as Action;
  const role = organization && (organization.user_info?.role as Role);
  const topElementRef = useRef<HTMLElement | null>(null);

  const isNavigate = !canPerformAction(role, viewAction);

  useEffect(() => {
    if (isNavigate && organization) {
      navigate(getRoute('private.app.organizations'));
    }
  }, [isNavigate, organization]);
  useEffect(() => {
    if (topElementRef.current) {
      topElementRef.current.focus();
    }
  }, []);
  return (
    <AppContainer
      routeInfo={routeInfo}
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
          <Grid container spacing={2}>
            {menuItems.map((item, index) => (
              <Grid item flexGrow={1} key={index}>
                <ContentContainer
                  size={[2, 2, 2, 2]}
                  sx={{
                    cursor: item.isDisabled ? 'context-menu' : 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => {
                    if (organization) {
                      navigate(item.navigateTo, {
                        state: {
                          orgName: organization?.name,
                          logo: organization?.logo,
                          type:
                            organization?.orgtype === 'other' ? organization?.custom_orgtype : organization?.orgtype,
                          orgId: organization?.id,
                          orgUserRole: organization.user_info?.role,
                        },
                      });
                    }
                  }}
                >
                  {item.notification && item.notification.visible && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        padding: 2,
                      }}
                    >
                      <Chip
                        sx={{ height: 26, mixWidth: 56, width: 'auto' }}
                        color="primary"
                        label={<Typography variant="h6">{`${item.notification.count} new`}</Typography>}
                      />
                    </Box>
                  )}
                  {item.isDisabled && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        padding: 2,
                      }}
                    >
                      <ComingSoonTag>coming soon</ComingSoonTag>
                    </Box>
                  )}

                  <Grid
                    display="inline-flex"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    width="100%"
                    sx={{ opacity: item.isDisabled ? 0.4 : 1 }}
                  >
                    <Box width={item.lineWidth} display="flex" flexDirection="column">
                      <Avatar sx={{ bgcolor: palette.primary.light }}>{item.icon}</Avatar>

                      <Typography variant="h6" mt={2} component="div">
                        {item.title}
                      </Typography>
                      <Typography variant="body1-secondary" mt={1} component="div">
                        {item.description}
                      </Typography>
                    </Box>
                    <Box>
                      <ChevronRightIcon />
                    </Box>
                  </Grid>
                </ContentContainer>
              </Grid>
            ))}
          </Grid>
          <SectionHeader title="Organizations I’m helping" />
          <Grid item flexGrow={1}>
            <ComingSoonBanner />
          </Grid>
          <OrgCreateConfirmModal isOpen={orgCreateModalOpen} onClose={onClose} />
        </Grid>
      }
      rightColumn={
        <>
          <Grid item xs>
            <CausesWidget
              onEditCausesClick={() => onClickNavigate('causes')}
              causes={organization?.causes || []}
              isLoading={isFetching || isLoading}
              sort
              disableActionButtons={!canPerformAction(role, editAction)}
            />
          </Grid>
          <Grid item xs>
            <UnsdgWidget
              onEditUnsdgClick={() => onClickNavigate('unsdg')}
              sdgs={organization?.sdgs || []}
              isLoading={isFetching || isLoading}
              disableActionButtons={!canPerformAction(role, editAction)}
            />
          </Grid>
        </>
      }
    />
  );
}
