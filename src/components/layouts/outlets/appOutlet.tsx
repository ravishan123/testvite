import { Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';

import { useGetProfileQuery, useGetUserPreferencesQuery } from '@store/slices/profile/profile.slice';
import { getRoute } from '@utils/configs/routesConfig';
import { LayoutOutletProps } from '@utils/types/router.type';

import { Grid } from '@ui/layout';
import { styled, useTheme, useMediaQuery } from '@ui/theme';
import GudPplIcon from '@ui/icons/GudPplIcon';
import { Box } from '@ui/layout';
import { Drawer } from '@ui/drawer';
import { IconButton } from '@ui/button';
import { MenuIcon } from '@ui/icons';
import { useSnackbar } from '@ui/snackBar';
import PageLoader from '@ui/pageLoader';

import Footer from '@globals/footer';
import AppLeftNavigation from '@globals/appLeftNavigation';
import AddHoursButton from '@globals/addHoursButton';
import ProfileMenuDropdown from '@globals/profileMenuDropdown';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { getUserProfileImage, selectUserProfileImage } from '@store/slices/user/user.slice';

type AppOutletProps = LayoutOutletProps;

const LeftColumn = styled(Grid)(({ theme }) => ({
  width: 317,
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  maxHeight: '100%',
  overflowY: 'auto',
  padding: theme.spacing(0, 0, 2, 3),

  '&.header': {
    flexDirection: 'row',
    zIndex: theme.zIndex.drawer + 1,
    flexGrow: 0,
    flexShrink: 0,
    pointerEvents: 'none',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    padding: theme.spacing(2, 0, 2, 3),
    backgroundColor: theme.palette.primary.light,
    marginTop: 0,

    [theme.breakpoints.down('md')]: {
      width: 'auto',
      position: 'absolute',
      padding: theme.spacing(2, 1),
      pointerEvents: 'auto',
    },
  },
}));

const RightColumn = styled(Grid)(({ theme }) => ({
  maxHeight: '100vh',
  overflowY: 'auto',
  padding: theme.spacing(2, 3),
  flexWrap: 'nowrap',
  flexDirection: 'column',
  position: 'relative',
}));

export default function AppOutlet({ childRouteInfo }: AppOutletProps) {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const {
    data: profile,
    isFetching: isFetchingProfile,
    isSuccess: isSuccessProfile,
    isError: isErrorProfile,
    error: errorProfile,
  } = useGetProfileQuery();
  const { url: imageUrl, error: profileImageError } = useAppSelector(selectUserProfileImage);
  const { isError: isErrorPreference, error: errorPreference } = useGetUserPreferencesQuery(
    { ...(profile && profile), profile_image: imageUrl as string },
    { skip: !profile || !imageUrl }
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    void dispatch(getUserProfileImage());
  }, []);

  useEffect(() => {
    if (isErrorProfile) {
      openSnackbar('error' in errorProfile ? errorProfile.error : 'Failed to fetch user profile', 'error');
      navigate(getRoute('public.signin'));
    }

    if (isErrorPreference) {
      openSnackbar('error' in errorPreference ? errorPreference.error : 'Failed to fetch user preferences', 'error');
    }

    if (profileImageError) {
      openSnackbar(profileImageError || 'Failed to fetch user profile image', 'error');
    }
  }, [isErrorProfile, isErrorPreference, profileImageError]);

  if (isEmpty(profile) && !isFetchingProfile && isSuccessProfile) {
    // redirect user to the preference setup up if the user haven't updated their profile
    // with the required information
    return <Navigate to={getRoute('private.preference')} />;
  }

  const handleOnClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return isFetchingProfile ? (
    <PageLoader open hideBackdrop />
  ) : (
    <Grid p={0} container flexGrow={1} flexWrap="nowrap" bgcolor={theme.palette.primary.light}>
      <LeftColumn className="header" item>
        {isMobile ? (
          <IconButton sx={{ mr: 1, ml: 1 }} onClick={handleOnClick}>
            <MenuIcon />
          </IconButton>
        ) : (
          ''
        )}
        <GudPplIcon width={115} height={40} />
      </LeftColumn>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMenuOpen}
        elevation={4}
        ModalProps={{
          keepMounted: true,
          hideBackdrop: true,
        }}
        onClose={() => setIsMenuOpen(false)}
        PaperProps={{
          sx: {
            borderRight: 0,
            top: 72,
            backgroundColor: isMobile ? theme.palette.common.white : theme.palette.primary.light,
            overflow: 'hidden',
            height: 'calc(100vh - 72px)',
          },
        }}
      >
        <LeftColumn item>
          <Box>
            <AppLeftNavigation config={childRouteInfo} />
            <AddHoursButton sx={{ mt: 30 / 8 }} />
          </Box>
          <Box mt={5}>
            <ProfileMenuDropdown />
            <Footer />
          </Box>
        </LeftColumn>
      </Drawer>

      <RightColumn container>
        <Suspense fallback={<PageLoader open target="component" />}>
          <Outlet />
        </Suspense>
      </RightColumn>
    </Grid>
  );
}
