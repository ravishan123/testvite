import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Chip } from '@mui/material';

import ContentContainer from '@globals/contentContainer';
import SectionHeader from '@globals/sectionHeader';
import AppContainer from '@layouts/containers/appContainer';
import CustomTable from '@globals/customTable';

import Image from '@ui/image';
import { useSnackbar } from '@ui/snackBar';
import { IconButton } from '@ui/button';

import { Grid, Box } from '@ui/layout';
import { SearchIcon } from '@ui/icons';
import { TextField } from '@ui/textField';
import { InputAdornment } from '@ui/inputAdornment';
import { Typography } from '@ui/typography';
import { Select } from '@ui/select';
import { MenuItem } from '@ui/menuItem';
import { useTheme } from '@ui/theme';

import { getRoute } from '@utils/configs/routesConfig';
import { PageRoute } from '@utils/types/router.type';
import { getProfileLogo, stringAvatar } from '@utils/functions/avatarUtils';

import ContactInfo from './contactInfo';
import EditUserRoleModal from '../manageSupporters/EditUserRoleModal';

import { useFetchAdminSupportersQuery } from '@store/slices/supporters/supporters.slice';
import { AdminSupporter } from '@utils/types/organization.type';
import { Supporter } from '@utils/enums/roles.enum';
import SearchEmpty from '@globals/SearchEmpty';

type ManageSupportersPageProps = {
  routeInfo: PageRoute;
};

type OrganizationInfo = {
  orgName: string | null;
  logo: string | null;
  type: string | null;
  orgId: string;
};

const columns = [
  { key: 'name', title: 'Name', width: '25%', maxWidth: '30%' },
  { key: 'join_at', title: 'Date joined', width: '15%', maxWidth: '15%' },
  { key: 'hours', title: 'Hours received', width: '20%', maxWidth: '15%' },
  { key: 'recent_supported', title: 'Recently supported', width: '20%', maxWidth: '15%' },
  { key: 'groups_joined', title: 'Groups joined', width: '20%', maxWidth: '20%' },
];

const rowsPerPage = 10;

export default function ManageSupporters({ routeInfo }: ManageSupportersPageProps) {
  const { palette, fontSize } = useTheme();
  const { id: orgId } = useParams() as { id: string };
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const location = useLocation();
  const organizationInfo = location.state as OrganizationInfo;
  const [name, setName] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminSupporter | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sortByDirection, setSortByDirection] = useState<string>('rj');

  const {
    data: allSupporters,
    isFetching,
    isLoading,
    error,
    refetch,
  } = useFetchAdminSupportersQuery(
    {
      orgId: orgId || '',
      page: pageNumber,
      pageSize: rowsPerPage,
      filter,
      sort: sortByDirection,
      totalCount: '',
      search: name,
    },
    { refetchOnMountOrArgChange: true }
  );

  const supporters = allSupporters?.supporters ?? [];

  const closeEditModal = () => setIsEditModalOpen(false);

  useEffect(() => {
    setPageNumber(1);
  }, [name]);

  useEffect(() => {
    if (error) {
      openSnackbar('An error occurred while loading data', 'error');
    }
  }, [isFetching, isLoading]);

  const refetchData = async () => {
    await refetch();
  };

  if (!orgId) {
    openSnackbar('Organization is not available or we encountered an error while loading data', 'error');
    navigate(getRoute('private.app.organizations'));
  }

  const tableData =
    supporters &&
    supporters.map((value) => {
      return {
        id: value.id,
        join_at: value.join_at,
        hours: value.hours,
        recent_supported: value.recent_supported,
        groups_joined: (
          <>
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
              {value.groups_joined
                .map((value, index) => (
                  <Chip
                    key={`groups_joined${index}`}
                    sx={{
                      width: 'auto',
                      height: '16px',
                      mt: 1,
                      mr: 1,
                      bgcolor: value.toUpperCase() !== Supporter.VOLUNTEER ? palette.warning[100] : palette.grey[400],
                    }}
                    label={<Typography variant="body1">{value}</Typography>}
                  />
                ))
                .reverse()}

              <IconButton sx={{ mr: 1, width: 40, height: 40, borderRadius: 1 }}>
                {!isEditModalOpen ? (
                  <ContactInfo
                    setIsOpen={setIsEditModalOpen}
                    phone={value?.phone}
                    email={value.email}
                    setSelectedUser={setSelectedUser}
                    user={value}
                  />
                ) : null}
              </IconButton>
            </Box>
          </>
        ),
        name: (
          <Box display="inline-flex" justifyContent="start" alignItems="center">
            <Image
              width={28}
              height={28}
              backgroundColor={palette.common.white}
              backgroundColorOnError={palette.primary.main}
              sx={{ fontSize: fontSize.sm, mr: 2 }}
              alt="profile"
              src={getProfileLogo(`${value.id}`) || ''}
            >
              {stringAvatar(`${value.name}`).text}
            </Image>
            <Box flexDirection="row" sx={{ maxWidth: 90 }}>
              <Typography component="div" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {value.name}
              </Typography>
              <Typography sx={{ textTransform: 'capitalize' }} component="div" color="text.secondary">
                {value.role.toLowerCase()}
              </Typography>
            </Box>
          </Box>
        ),
      };
    });

  return (
    <AppContainer
      routeInfo={routeInfo}
      contentColumn={
        <Grid container>
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
              >
                <Box mb={{ xs: 2, sm: 0 }} mr={2} maxWidth={{ sm: '60%', md: '60%', xs: '100%' }} flex="1">
                  <TextField
                    placeholder="Search by name"
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                    InputProps={{
                      style: { backgroundColor: palette.primary.light, height: 36 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon sx={{ width: 20, color: palette.common.black }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                  />
                </Box>
                <Box
                  mt={{ xs: 2, sm: 0 }}
                  ml={{ xs: 0, sm: 2 }}
                  display="flex"
                  alignItems="center"
                  flexDirection="row"
                  flexWrap="wrap"
                >
                  <Typography variant="body4" component="div" sx={{ mr: { xs: 0, sm: 2 }, mt: 1 }}>
                    Sort by
                  </Typography>
                  <Select
                    placeholder="Most recent"
                    onChange={(e) => setSortByDirection(e.target.value)}
                    sx={{
                      height: 36,
                      bgcolor: palette.primary.light,
                      width: { xs: '100%', sm: '148px', md: '148px' },
                      mr: 2,
                      fontSize: fontSize.xs,
                      '.MuiOutlinedInput-notchedOutline': { border: 0 },
                    }}
                    value={sortByDirection}
                  >
                    <MenuItem sx={{ fontSize: fontSize.xs }} value={'rj'}>
                      Recently joined
                    </MenuItem>
                    <MenuItem value={'rs'} sx={{ fontSize: fontSize.xs }}>
                      Recently supported
                    </MenuItem>
                    <MenuItem value={'hg_desc'} sx={{ fontSize: fontSize.xs }}>
                      Hours given (high to low)
                    </MenuItem>
                    <MenuItem value={'hg_asc'} sx={{ fontSize: fontSize.xs }}>
                      Hours given (low to high)
                    </MenuItem>
                  </Select>
                </Box>
                <Box
                  mt={{ xs: 2, sm: 0 }}
                  ml={{ xs: 0, sm: 2 }}
                  display="flex"
                  alignItems="center"
                  flexDirection="row"
                  flexWrap="wrap"
                >
                  <Typography variant="body4" sx={{ mr: 2, mt: 1 }}>
                    Show
                  </Typography>
                  <Select
                    placeholder="All"
                    onChange={(e) => {
                      setPageNumber(1);
                      setFilter(e.target.value);
                    }}
                    sx={{
                      height: 36,
                      bgcolor: palette.primary.light,
                      width: { xs: '100%', sm: '148px' },
                      mr: 2,
                      fontSize: fontSize.xs,
                      '.MuiOutlinedInput-notchedOutline': { border: 0 },
                    }}
                    value={filter}
                  >
                    <MenuItem sx={{ fontSize: fontSize.xs }} value={'all'}>
                      All
                    </MenuItem>
                    <MenuItem sx={{ fontSize: fontSize.xs }} value={'volunteers'}>
                      Volunteers
                    </MenuItem>
                    <MenuItem sx={{ fontSize: fontSize.xs }} value={'donors'}>
                      Donors
                    </MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>

            <CustomTable
              loading={isFetching || isLoading}
              columns={columns}
              isSkeleton={false}
              numberOfItems={Number(allSupporters?.totalCount) || 0}
              data={tableData}
              page={pageNumber}
              setPage={setPageNumber}
              noDataComponent={<SearchEmpty />}
            />
          </ContentContainer>
          <EditUserRoleModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            isLoading={isLoading}
            logo={organizationInfo?.logo ?? ''}
            orgName={organizationInfo?.orgName ?? ''}
            orgType={organizationInfo?.type ?? ''}
            userInfo={selectedUser}
            orgId={orgId}
            refetch={refetchData}
          />
        </Grid>
      }
      rightColumn={<Grid item xs></Grid>}
    />
  );
}
