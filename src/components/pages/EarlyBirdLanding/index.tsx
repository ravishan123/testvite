import { ReactElement, useEffect } from 'react';

import FullPageContainer from '@layouts/containers/fullPageContainer';
import { getDaysRemaining } from '@utils/functions/dateTime';
import GudPplIcon from '@ui/icons/GudPplIcon';
import { styled, useTheme } from '@ui/theme';
import { Typography, Link } from '@ui/typography';
import { Grid } from '@ui/layout';

import bannerImage from '@assets/images/early_bird_landing_page.svg';
import { Auth } from 'aws-amplify';
import { useSnackbar } from '@ui/snackBar';
import { useAtom } from 'jotai';
import { userProfileAtom } from '@serverAtoms/users/userProfile.atom';
import { userAtom } from '@applicationAtoms/app.atom';

import { resetUserState } from '@store/slices/user/user.slice';
import { useAppDispatch } from '@store/hooks';
import { profileApi } from '@store/slices/profile/profile.slice';

const Banner = styled('div')`
  width: 324px;
  height: 320px;
  background: url(${bannerImage}) no-repeat 0 0 transparent;
`;

export default function EarlyBirdLanding(): ReactElement {
  const theme = useTheme();
  const [, setUserProfile] = useAtom(userProfileAtom);
  const [, setUser] = useAtom(userAtom);
  const { openSnackbar } = useSnackbar();
  const remainingDays = getDaysRemaining('10/1/2023');
  const dispatch = useAppDispatch();

  const signOutUser = () => {
    Auth.signOut()
      .then(() => {
        setUser(null);
        setUserProfile({ data: null });
        resetUserState();
        dispatch(profileApi.util.resetApiState());
      })
      .catch((error: Error) => {
        openSnackbar(error?.message || 'Error occurred while log out', 'error');
      });
  };

  useEffect(() => {
    signOutUser();
  }, []);

  return (
    <FullPageContainer
      logo={<GudPplIcon width={115} height={40} />}
      content={
        <Grid display="flex" flexDirection={'column'} flexWrap={'wrap'} alignItems={'center'} textAlign={'center'}>
          <Banner />
          <Grid mt="88px" mb="60px" maxWidth="720px">
            <div>
              <Typography variant="title">Yay... you got the worm!</Typography>
            </div>

            <Typography variant="h5-secondary" color="" fontWeight={400} mt="12px">
              Now that you are onboard, you'll be granted early access to our new platform in just{' '}
              <Typography variant="h5" color={theme.palette.primary.main} display="inline">
                {remainingDays} days
              </Typography>
              . We appreciate your patience; the wait will be worth it. Keep an eye on your inbox for updates.
            </Typography>
          </Grid>
          <Typography variant="h5-secondary" color="" fontWeight={'normal'}>
            Visit our&nbsp;
            <Link href="https://help.gudppl.com" underline="hover" fontWeight={600}>
              help center
            </Link>
            &nbsp;for more information.
          </Typography>
        </Grid>
      }
    />
  );
}
