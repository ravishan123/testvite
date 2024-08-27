import { Grid, Box } from '@ui/layout';
import ContentContainer from '@globals/contentContainer';
import SectionHeader from '@globals/sectionHeader';
import HourVerifyBanner from './hourVerifyBanner';
import AppContainer from '@layouts/containers/appContainer';
import CustomTable from '@globals/customTable';
import { SearchIcon, VerifiedOutlinedIcon, InfoOutlinedIcon, ArrowForwardIosIcon } from '@ui/icons';
import { TextField } from '@ui/textField';
import { InputAdornment } from '@ui/inputAdornment';
import { Typography } from '@ui/typography';
import { Avatar } from '@ui/avatar';
import { Select } from '@ui/select';
import { MenuItem } from '@ui/menuItem';
import { useTheme } from '@ui/theme';
import {
  useFetchVerificationRequestsQuery,
  useFetchVerificationStatsQuery,
} from '@store/slices/organization/organization.slice';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { stringAvatar } from '@utils/functions/avatarUtils';
import Image from '@ui/image';
import { getProfileLogo } from '@utils/functions/avatarUtils';
import { PageRoute } from '@utils/types/router.type';
import { ActivityStatusEnum } from '@utils/enums/activity.enum';
import { getRoute } from '@utils/configs/routesConfig';
import { useSnackbar } from '@ui/snackBar';
import { CircularProgress } from '@ui/circularProgress';

type VerifyHoursPageProps = {
  routeInfo: PageRoute;
};

const columns = [
  { key: 'requestBy', title: 'Request by' },
  { key: 'hoursReceived', title: 'Hours received' },
  { key: 'dateActivity', title: 'Date of activity' },
  { key: 'location', title: 'Location' },
  { key: 'status', title: 'Status' },
];

export default function OrganizationProfilePage({ routeInfo }: VerifyHoursPageProps) {
  const { palette, fontSize } = useTheme();
  const { id: orgId } = useParams() as { id: string };
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const [name, setName] = useState<string>('');
  const [status, setStatus] = useState<string>('all');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sortByDirection, setSortByDirection] = useState<string>('lh');

  const { data: verificationStats, isFetching } = useFetchVerificationStatsQuery(orgId, { skip: !orgId });
  console.log('verify id', orgId);

  const {
    data: verificationRequests,
    refetch: fetchVerificationRequests,
    isFetching: tableDataIsFetching,
  } = useFetchVerificationRequestsQuery(
    {
      name: name,
      status: status,
      pageNumber: pageNumber,
      pageSize: 10,
      sortByDirection: sortByDirection,
      id: orgId,
    },
    { skip: !orgId }
  );

  const selectColor = (status: string) => {
    if (status === ActivityStatusEnum.Pending) {
      return palette.warning.main;
    } else if (status === ActivityStatusEnum.Approved) {
      return palette.secondary[100];
    } else {
      return palette.error.main;
    }
  };

  const tableData = verificationRequests?.data
    ? verificationRequests?.data.length > 0 &&
      verificationRequests?.data.map((value) => {
        return {
          id: value.id,
          dateActivity: value.dateActivity,
          hoursReceived: value.hoursReceived,
          location: value.location,
          requestBy: (
            <Box display="inline-flex" justifyContent="space-between" alignItems="center">
              <Image
                width={28}
                height={28}
                backgroundColor={palette.common.white}
                backgroundColorOnError={palette.primary.main}
                sx={{ fontSize: fontSize.sm, mr: 2 }}
                alt="profile"
                src={getProfileLogo(`${value.senderId}`) || ''}
              >
                {stringAvatar(`${value.requestBy}`).text}
              </Image>
              <Typography>{value.requestBy}</Typography>
            </Box>
          ),
          status: (
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
              <Typography
                variant="body4"
                component="div"
                sx={{
                  color: selectColor(value.status),
                  textTransform: 'capitalize',
                }}
              >
                {value.status.toLowerCase()}
              </Typography>
              <IconButton
                onClick={() => {
                  navigate(
                    getRoute('private.app.organizations.profile.verifyHours.hourDetails', {
                      id: orgId,
                      hourId: value.id,
                    })
                  );
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 14 }} color="primary" />
              </IconButton>
            </Box>
          ),
        };
      })
    : [];

  useEffect(() => {
    setPageNumber(1);
  }, [name]);

  useEffect(() => {
    void fetchVerificationRequests();
  }, [name, status, pageNumber, sortByDirection]);

  if (!orgId) {
    openSnackbar('Organization is not available or we encountered an error while loading data', 'error');
    navigate(getRoute('private.app.organizations'));
  }

  return (
    <AppContainer
      routeInfo={routeInfo}
      contentColumn={
        <Grid container>
          <Grid container spacing={2} display="inline-flex" wrap="wrap">
            <Grid item xs={12} sm>
              <ContentContainer
                height="93px"
                display="inline-flex"
                justifyContent="center"
                alignItems="center"
                size={[4, 4, 4, 4]}
              >
                <Box mr={2}>
                  <Avatar sx={{ width: 40, height: 40, backgroundColor: palette.grey[400] }}>
                    <VerifiedOutlinedIcon sx={{ color: palette.secondary[100], width: 24 }} />
                  </Avatar>
                </Box>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h3">
                    {isFetching ? <CircularProgress size={16} /> : verificationStats?.verifiedHours?.hours || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: '17px' }}>
                    Hours received
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mt={1}>
                    {verificationStats?.numOfRequestsVerified || 0} requests verified
                  </Typography>
                </Box>
              </ContentContainer>
            </Grid>
            <Grid item xs={12} sm>
              <ContentContainer
                height="93px"
                display="inline-flex"
                justifyContent="center"
                alignItems="center"
                size={[4, 4, 4, 4]}
              >
                <Box mr={2}>
                  <Avatar sx={{ width: 40, height: 40, backgroundColor: palette.warning[100] }}>
                    <InfoOutlinedIcon sx={{ color: palette.warning.main, width: 24 }} />
                  </Avatar>
                </Box>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h3">
                    {isFetching ? <CircularProgress size={16} /> : verificationStats?.numOfPendingVerifications || 0}
                  </Typography>

                  <Typography variant="body1"> Pending requests</Typography>
                </Box>
              </ContentContainer>
            </Grid>

            <Grid item xs={12} sm>
              <ContentContainer
                height="93px"
                display="inline-flex"
                justifyContent="center"
                alignItems="center"
                size={[4, 4, 4, 4]}
              >
                <Typography variant="h6" component="div" mr={0.5}>
                  {isFetching ? <CircularProgress size={16} /> : verificationStats?.numOfDeclinedVerifications || 0}
                </Typography>
                <Typography variant="body1" component="div">
                  Declined requests
                </Typography>
              </ContentContainer>
            </Grid>
          </Grid>

          <ContentContainer size={[1, 0, 2, 0]} sx={{ mt: 2 }}>
            <Box ml={2}>
              <SectionHeader title="Volunteer hour verification requests" />
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
                    <MenuItem sx={{ fontSize: fontSize.xs }} value={'hl'}>
                      Hours received (high to low)
                    </MenuItem>
                    <MenuItem value={'lh'} sx={{ fontSize: fontSize.xs }}>
                      Hours received (low to high)
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
                    onChange={(e) => setStatus(e.target.value)}
                    sx={{
                      height: 36,
                      bgcolor: palette.primary.light,
                      width: { xs: '100%', sm: '148px' },
                      mr: 2,
                      fontSize: fontSize.xs,
                      '.MuiOutlinedInput-notchedOutline': { border: 0 },
                    }}
                    value={status}
                  >
                    <MenuItem sx={{ fontSize: fontSize.xs }} value={'all'}>
                      All
                    </MenuItem>
                    <MenuItem sx={{ fontSize: fontSize.xs }} value={'approved_requests'}>
                      Approved
                    </MenuItem>
                    <MenuItem sx={{ fontSize: fontSize.xs }} value={'pending_requests'}>
                      Pending
                    </MenuItem>
                    <MenuItem sx={{ fontSize: fontSize.xs }} value={'declined_requests'}>
                      Declined
                    </MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>

            <CustomTable
              loading={tableDataIsFetching}
              columns={columns}
              numberOfItems={Number(verificationRequests?.numberOfItems) || 0}
              data={tableData || []}
              page={pageNumber}
              setPage={setPageNumber}
            />
          </ContentContainer>
        </Grid>
      }
      rightColumn={
        <Grid item xs>
          <HourVerifyBanner />
        </Grid>
      }
    />
  );
}
