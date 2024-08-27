import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import { selectUserProfileImage } from '@store/slices/user/user.slice';
import { getRoute } from '@utils/configs/routesConfig';
import { selectUserProfile, selectUserProfileResult } from '@store/slices/profile/profile.slice';
import { useAppSelector } from '@store/hooks';

import { Grid } from '@ui/layout';
import { Typography } from '@ui/typography';
import { Button } from '@ui/button';
import { styled, useTheme } from '@ui/theme';
import { EditOutlinedIcon } from '@ui/icons';
import { Skeleton } from '@ui/skeleton';
import Image from '@ui/image';

import ContentContainer from '@globals/contentContainer';

import { useFetchVolunteerStatQuery } from '@store/slices/volunteer/volunteer.slice';
import AboutMeCollapsible from '@globals/textClipper';
import { CircularProgress } from '@ui/circularProgress';

const Divider = styled('span')(({ theme }) => ({
  width: 2,
  height: 2,
  backgroundColor: theme.palette.grey['200'],
  display: 'inline-block',
  margin: theme.spacing(0, 1),
}));

export default function ProfileDetailsBanner() {
  const theme = useTheme();
  const navigate = useNavigate();
  const profile = useAppSelector(selectUserProfile);

  const { url: imageUrl } = useAppSelector(selectUserProfileImage);

  const { isLoading: isProfileLoading } = useAppSelector(selectUserProfileResult);

  const { data, isFetching } = useFetchVolunteerStatQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <ContentContainer size={[0, 0, 0, 0]}>
      <Grid container columnSpacing={4} pb={2} p={theme.spacing(4, 4, 3, 4)}>
        <Grid item>
          <Image
            isAvatar
            src={imageUrl || ''}
            alt="profile image"
            width={120}
            height={120}
            backgroundColor={theme.palette.common.white}
            backgroundColorOnError={theme.palette.primary.main}
            sx={{ fontSize: theme.fontSize.sm, border: `1px solid ${theme.palette.grey['200']}` }}
          />
        </Grid>
        {isProfileLoading ? (
          <Grid item xs>
            <Skeleton variant="text" width="100%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="30%" height={20} sx={{ display: 'inline-block', mr: 1, mt: 1 }} />
            <Skeleton variant="text" width="30%" height={20} sx={{ display: 'inline-block' }} />
            <Grid container mt={1} columnSpacing="28px" rowSpacing={1}>
              <Grid item>
                <Skeleton variant="rounded" width="140px" height={30} sx={{ mb: 1 }} />
              </Grid>
              <Grid item>
                <Skeleton variant="rounded" width="140px" height={30} sx={{ mb: 1 }} />
              </Grid>
            </Grid>
            <Skeleton variant="rounded" width="100px" height={30} sx={{ mt: 1 }} />
          </Grid>
        ) : (
          <Grid item xs>
            <Typography variant="h2" gutterBottom>
              {profile?.first_name} {profile?.last_name}
            </Typography>

            <AboutMeCollapsible text={profile?.about_me} />

            <Grid alignItems="center" display="flex" mt={1}>
              {profile?.city && profile?.country && (
                <Typography variant="helper-text" color="text.secondary">
                  {profile?.city}, {profile?.countryName}
                </Typography>
              )}
              {profile?.city && profile?.country && profile?.joined_date && <Divider />}
              {profile?.joined_date && (
                <Typography variant="helper-text" color="text.secondary">
                  Joined {format(new Date(profile.joined_date), 'LLL y')}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} mt={2}>
              <Button
                variant="contained-secondary"
                size="medium-compact"
                startIcon={<EditOutlinedIcon />}
                onClick={() => navigate(getRoute('private.preference'), { state: { from: 'profile' } })}
              >
                Edit profile
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid container py={2} borderTop={`1px solid ${theme.palette.grey[100]} `}>
        <Grid item xs textAlign="center">
          <Typography variant="h4">{isFetching ? <CircularProgress size={16} /> : data?.[0].hoursGiven}</Typography>
          <Typography variant="body1" color="text.secondary">
            Hours given
          </Typography>
        </Grid>
        <Grid item xs textAlign="center" borderLeft={`1px solid ${theme.palette.grey[100]} `}>
          <Typography variant="h4">{isFetching ? <CircularProgress size={16} /> : data?.[0].activities}</Typography>
          <Typography variant="body1" color="text.secondary">
            Activities
          </Typography>
        </Grid>
        {/**
         * TODO: Add groups count. Commenting due to not finalised yet.
         
        <Grid item xs textAlign="center">
          <Typography variant="h5">23</Typography>
          <Typography variant="body1">Groups</Typography>
        </Grid>
         */}
      </Grid>
    </ContentContainer>
  );
}
