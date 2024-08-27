import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Image from '@ui/image';
import { useTheme } from '@ui/theme';
import { Grid, Box } from '@ui/layout';
import { useSnackbar } from '@ui/snackBar';
import { Typography } from '@ui/typography';
import RolesDropdown from '@ui/rolesDropdown';
import { Skeleton } from '@ui/skeleton';

import ContentContainer from '@globals/contentContainer';
import SectionHeader from '@globals/sectionHeader';
import AppContainer from '@layouts/containers/appContainer';
import CustomTable from '@globals/customTable';

import { getRoute } from '@utils/configs/routesConfig';
import { PageRoute } from '@utils/types/router.type';
import { getProfileLogo, stringAvatar } from '@utils/functions/avatarUtils';
import AdminPanel from './AdminPanel';
import PremiumFeaturesContainer from './PremiumFeaturesContainer';
import { useListManageAdminsQuery, useListManageSupportersQuery } from '@store/slices/supporters/supporters.slice';
import { UserRoles } from '@utils/enums/roles.enum';

type ManageRolesPageProps = {
  routeInfo: PageRoute;
};
type SupporterDataType = {
  id: string;
  supporter: string;
  email: string;
  role: string;
};

const columns = [
  { key: 'user', title: 'User', maxWidth: '200px' },
  { key: 'email', title: 'Email address', maxWidth: '300px' },
  { key: 'role', title: 'Role' },
];

const adminsRole = ['OWNER', 'SUPERVISOR', 'COORDINATOR'];

const rowsPerPage = 10;

const CustomSkeleton = () => {
  return (
    <Box display="inline-flex" mt={1}>
      <Skeleton variant="circular" width={28} height={28} />
      <Box>
        <Skeleton sx={{ ml: 1, mt: 0 }} variant="text" width={98} height={15} />
        <Skeleton sx={{ ml: 1, mt: 0 }} variant="text" width={50} height={15} />
      </Box>
    </Box>
  );
};

export default function ManageRoles({ routeInfo }: ManageRolesPageProps) {
  const { palette, fontSize } = useTheme();
  const { id: orgId } = useParams() as { id: string };
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const [pageNumber, setPageNumber] = useState<number>(1);

  const {
    data: allSupporters,
    isFetching,
    isLoading,
    error,
    refetch: listSupportersRefetch,
  } = useListManageSupportersQuery(
    { orgId: orgId || '', pageSize: rowsPerPage, page: pageNumber, totalCount: '' },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: allAdmins,
    isLoading: isAdminLoading,
    error: adminError,
    refetch: listAdminsRefetch,
  } = useListManageAdminsQuery({ orgId: orgId || '' }, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    setPageNumber(1);
  }, []);
  useEffect(() => {
    if (error || adminError) {
      openSnackbar('Something went wrong.', 'error');
    }
  }, [error, adminError]);

  if (!orgId) {
    openSnackbar('Organization is not available or we encountered an error while loading data', 'error');
    navigate(getRoute('private.app.organizations'));
  }

  const handleRefetch = async () => {
    try {
      await listAdminsRefetch();
      await listSupportersRefetch();
    } catch (error) {
      console.error('Error refetching data:', error);
    }
  };
  const tableData =
    allSupporters &&
    allSupporters?.data?.map((value: SupporterDataType) => {
      return {
        id: value.id,
        email: (
          <Box
            flexDirection="row"
            sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            <Typography component="div" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value.email}
            </Typography>
          </Box>
        ),

        user: (
          <Box display="inline-flex" justifyContent="space-between" alignItems="center">
            <Image
              width={28}
              height={28}
              backgroundColor={palette.common.white}
              backgroundColorOnError={palette.primary.main}
              sx={{ fontSize: fontSize.sm, mr: 2 }}
              alt="profile"
              src={getProfileLogo(`${value.id}`) || ''}
            >
              {stringAvatar(`${value.supporter}`).text}
            </Image>
            <Box
              flexDirection="row"
              sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              <Typography component="div" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {value.supporter}
              </Typography>
            </Box>
          </Box>
        ),
        role: (
          <RolesDropdown
            handleRefetch={handleRefetch}
            showRole
            role={value.role}
            name={value.supporter}
            userId={value.id}
            orgId={orgId}
          />
        ),
      };
    });

  const ownerCount = allAdmins?.data.filter((item) => item.role === UserRoles.OWNER).length || 0;

  return (
    <AppContainer
      routeInfo={routeInfo}
      contentColumn={
        <Grid container spacing={2}>
          <ContentContainer size={[1, 0, 2, 0]} sx={{ mt: 2 }}>
            <Box ml={2}>
              <SectionHeader title="Supporters" />
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'flex-start' }}
                justifyContent="flex-start"
                alignContent="space-between"
                mt={1}
              />
            </Box>

            <CustomTable
              loading={isFetching || isLoading}
              columns={columns}
              numberOfItems={Number(allSupporters?.totalCount[0]?.supporter_count) || 0}
              data={tableData || []}
              page={pageNumber}
              setPage={setPageNumber}
              noDataComponent={
                <Box
                  height={340}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  p={3}
                >
                  <Typography variant="h3">Let’s get started</Typography>
                  <Typography variant="body4" mt={0.5} width={320}>
                    You can invite supporters to join your group, then assign administrator roles.
                  </Typography>
                </Box>
              }
            />
          </ContentContainer>
        </Grid>
      }
      rightColumn={
        <>
          <Grid item xs>
            <ContentContainer size={[0, 0, 2, 2]}>
              <Grid item xs={12} py={1} mt={1}>
                <Typography variant="h5">Administrators</Typography>
              </Grid>
              <Box display="flex" flexDirection="column">
                {isAdminLoading && Array.from({ length: 5 }, (_, index) => <CustomSkeleton key={index} />)}
              </Box>

              {!isAdminLoading &&
                allAdmins &&
                [...allAdmins.data]
                  .sort((a, b) => adminsRole.indexOf(a.role) - adminsRole.indexOf(b.role))
                  .map((data) => (
                    <AdminPanel
                      disable={(ownerCount === 1 && data?.role) === UserRoles.OWNER || false}
                      handleRefetch={handleRefetch}
                      id={data?.id}
                      supporter={data?.supporter}
                      role={data?.role}
                    />
                  ))}
            </ContentContainer>
          </Grid>
          <Grid item xs>
            <PremiumFeaturesContainer />
          </Grid>
        </>
      }
    />
  );
}
