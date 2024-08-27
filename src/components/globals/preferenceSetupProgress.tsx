import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@store/hooks';
import { selectIsPreferenceSetupCompleted, selectUserPreference } from '@store/slices/profile/profile.slice';
import { getRandomIntInclusive } from '@utils/functions/random';
import { getRoute } from '@utils/configs/routesConfig';
import { Preference } from '@utils/types/preference';
import { preferenceDefinition } from '@constants/preference.const';

import { Box, Grid } from '@ui/layout';
import { styled, alpha } from '@ui/theme';
import { CheckCircleOutlineOutlinedIcon, CircleOutlinedIcon } from '@ui/icons';
import { Button } from '@ui/button';
import { Skeleton } from '@ui/skeleton';
import { Alert } from '@ui/alert';
import { Typography } from '@ui/typography';

import ContentContainer from './contentContainer';

const ProgressBarItem = styled('div', { shouldForwardProp: (props) => props !== 'isCompleted' })<{
  isCompleted: boolean;
}>(({ theme, isCompleted }) => ({
  height: 6,
  borderRadius: 24,
  backgroundColor: isCompleted ? theme.palette.success.main : theme.palette.grey[200],
  flex: 1,
  '&:not(:last-child)': {
    marginRight: 2,
  },
}));

const Step = styled(Grid, { shouldForwardProp: (props) => props !== 'isCompleted' })<{
  isCompleted: boolean;
}>(({ theme, isCompleted }) => ({
  flexGrow: 1,
  width: '100%',
  display: 'flex',
  paddingTop: 16,

  '& .MuiTypography-root': {
    color: isCompleted ? theme.palette.text.secondary : theme.palette.text.primary,
    fontWeight: isCompleted ? 400 : 600,
  },

  '& .MuiSvgIcon-root': {
    marginRight: 8,
    color: isCompleted ? alpha(theme.palette.success.main, 0.5) : theme.palette.grey[200],
  },
}));

export default function PreferenceSetupProgress() {
  const navigate = useNavigate();
  const { data, isLoading, isError, isUninitialized } = useAppSelector(selectUserPreference);
  const isSetupCompleted = useAppSelector(selectIsPreferenceSetupCompleted);

  const progressSteps = useMemo(() => {
    if (data?.progress) {
      return Object.entries(data?.progress).sort((a, b) => (a[1] === b[1] ? 0 : a[1] ? -1 : 1));
    }

    return [];
  }, [data?.progress]);

  if (isSetupCompleted || isLoading) {
    return null;
  } else {
    return (
      <Grid item>
        <ContentContainer size={[2, 2, 1.5, 2]}>
          <Grid>
            {!isSetupCompleted ? (
              <Typography variant="h5" width="80%">
                You are a few steps away from completing your profile
              </Typography>
            ) : (
              <Typography variant="h5">
                We are on a mission to help you find like-minded people who want to create a kinder, better world.
              </Typography>
            )}
            {!isError && !isSetupCompleted ? (
              <>
                <Grid item xs display="flex" alignItems="center" mt={2}>
                  <Box display="flex" py={1} flex={1}>
                    {!isLoading && !isUninitialized ? (
                      progressSteps.map(([key, value], index) => (
                        <ProgressBarItem key={`progress-bar-${key}-${index}`} isCompleted={value} />
                      ))
                    ) : (
                      <Skeleton width="100%" height={15} />
                    )}
                  </Box>
                </Grid>
                <Grid item xs display="flex" alignItems="center" mt={1}>
                  <Box display="flex">
                    {!isLoading && !isUninitialized ? (
                      <Typography component="span" variant="body1" fontWeight={600} noWrap>
                        {data?.info.completedSteps}
                        <Typography component="span" variant="body1">
                          /{data?.info.totalSteps} Completed
                        </Typography>
                      </Typography>
                    ) : (
                      <Skeleton width={50} height={15} />
                    )}
                  </Box>
                </Grid>
                <Grid container rowSpacing={3} mt={1}>
                  {data?.progress && !isLoading
                    ? Object.entries(data.progress).map(([key, value], index) => {
                        return (
                          <Step pt={1} isCompleted={value} key={`progress-step-${key}-${index}`}>
                            <Box>{value ? <CheckCircleOutlineOutlinedIcon /> : <CircleOutlinedIcon />}</Box>
                            <Box>
                              <Typography component="span" variant="h5">
                                {preferenceDefinition[key as keyof Preference['progress']]?.label}
                              </Typography>
                            </Box>
                          </Step>
                        );
                      })
                    : [...Array<number>(6)].map((_, index) => (
                        <Step
                          isCompleted={false}
                          item
                          key={`progress-step-${index}`}
                          display="flex"
                          alignItems="center"
                        >
                          <Box mr={3}>
                            <Skeleton variant="circular" width={30} height={30} />
                          </Box>
                          <Box width={`${getRandomIntInclusive(30, 50)}%`}>
                            <Skeleton width="100%" height={20} />
                          </Box>
                        </Step>
                      ))}
                </Grid>
                <Box textAlign="right" mt={4} sx={{ display: { xs: 'flex', sm: 'block' }, flexDirection: 'column' }}>
                  <Button
                    size="medium-compact"
                    onClick={() => navigate(getRoute('private.preference'), { state: { from: 'home' } })}
                    disabled={isLoading}
                    fullWidth
                  >
                    Complete your profile now
                  </Button>
                  <Button
                    variant="custom"
                    size="medium-compact"
                    sx={{
                      mt: 2,
                      justifyContent: 'center',
                    }}
                    disabled={isLoading}
                    fullWidth
                    onClick={() => navigate(getRoute('private.app.profile'))}
                  >
                    View my profile
                  </Button>
                </Box>
              </>
            ) : isError ? (
              <Box mt={4}>
                <Alert severity="error">Error loading preference setup progress.</Alert>
              </Box>
            ) : (
              ''
            )}
          </Grid>
        </ContentContainer>
      </Grid>
    );
  }
}
