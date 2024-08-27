import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageRoute } from '@utils/types/router.type';
import { useAppSelector } from '@store/hooks';
import { getRoute } from '@utils/configs/routesConfig';
import Image from '@ui/image';
import { selectUserProfile, useGetHomeStatsQuery } from '@store/slices/profile/profile.slice';
import { useGetOrganizationsQuery } from '@store/slices/organization/organization.slice';
import isEmpty from 'lodash-es/isEmpty';
import { Grid, Box } from '@ui/layout';
import { useSnackbar } from '@ui/snackBar';
import AppContainer from '@layouts/containers/appContainer';
import ActionBanner from '@globals/actionBanner';
import PreferenceSetupProgress from '@globals/preferenceSetupProgress';
import { Typography, useTheme } from '@mui/material';
import ContentContainer from '@globals/contentContainer';
import { MenuItem } from '@pages/organizations/organizationProfilePage';
import { AccessTimeIcon, HomeWorkOutlinedIcon, ContentCopyIcon, PersonAddAltIcon } from '@ui/icons';
import { Avatar } from '@ui/avatar';
import { Button } from '@ui/button';
import { formatNumberWithCommas } from '@utils/functions/homePageStats';
import RequestNotificationBanner from './RequestNotificationBanner';

type HomePageProps = {
  routeInfo: PageRoute;
};

export default function HomePage({ routeInfo }: HomePageProps) {
  const { palette } = useTheme();
  const profile = useAppSelector(selectUserProfile);
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const {
    data: organization,
    isFetching,
    isError,
  } = useGetOrganizationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: homeStatsData, error: homeStatsError } = useGetHomeStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const menuItems: Omit<MenuItem, 'navigateTo' | 'lineWidth'>[] = [
    {
      icon: <PersonAddAltIcon sx={{ width: 24, color: palette.common.black }} />,
      title: formatNumberWithCommas(homeStatsData?.data?.joinedLastWeek || '0'),
      description: 'People joined last week',
      isDisabled: false,
    },
    {
      icon: <HomeWorkOutlinedIcon sx={{ width: 24, color: palette.common.black }} />,
      title: formatNumberWithCommas(homeStatsData?.data?.totalOrganizations || '0'),
      description: 'Organizations on board',
      isDisabled: false,
    },
    {
      icon: <AccessTimeIcon sx={{ width: 24, color: palette.common.black }} />,
      title: formatNumberWithCommas(homeStatsData?.data?.totalVerifiedHours || '0'),
      description: 'Verified hours',
      isDisabled: false,
    },
  ];

  useEffect(() => {
    if (isError || homeStatsError) {
      openSnackbar('Something went wrong.', 'error');
    }
  }, [isError]);

  const copyLinkToClipboard = () => {
    const tempInput = document.createElement('input');

    tempInput.value = 'https://app.gudppl.com/';

    document.body.appendChild(tempInput);

    tempInput.select();

    document.execCommand('copy');

    document.body.removeChild(tempInput);
  };

  return (
    <>
      <Grid container rowSpacing={2}>
        <Grid mt={9}>
          <Typography variant="h1">Hello, {profile?.first_name}. Welcome to gudppl!</Typography>
          <Typography mt={1} variant="body2" color={palette.text.secondary}>
            We are on a mission to help you find like-minded people who want to create a kinder, better world.
          </Typography>
        </Grid>

        <AppContainer
          routeInfo={routeInfo}
          showRoute={false}
          contentColumn={
            <Grid mt={4} columnSpacing={2}>
              <Grid container flexDirection="column" rowSpacing={2}>
                <Grid item xs={12}>
                  {/* TODO: need to updated in Future development  */}
                  <RequestNotificationBanner />
                </Grid>
                <Grid container mb={1} spacing={2} alignItems="stretch">
                  {menuItems.map((item, index) => (
                    <Grid width="33.3%" spacing={1} item key={index}>
                      <ContentContainer
                        size={[2, 2, 2, 2]}
                        sx={{
                          cursor: item.isDisabled ? 'context-menu' : 'pointer',
                          position: 'relative',
                          mt: 1,
                          height: '100%',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Grid display="inline-flex" justifyContent="space-between" alignItems="flex-end" width="100%">
                          <Box display="flex" flexDirection="column">
                            <Avatar sx={{ bgcolor: palette.primary.light }}>{item.icon}</Avatar>

                            <Typography variant="h2" mt={2} component="div">
                              {item.title}
                            </Typography>
                            <Typography width="100%" variant="h5-secondary" mt={1} component="div">
                              {item.description}
                            </Typography>
                          </Box>
                        </Grid>
                      </ContentContainer>
                    </Grid>
                  ))}
                </Grid>
                <Grid item rowSpacing={1}>
                  <ActionBanner
                    horizontalSize={[3, 4, 3, 0]}
                    hasTitleTopGutter={false}
                    image={null}
                    imageWidth={0}
                    imageHeight={0}
                    title={
                      <>
                        <Typography variant="h4" component="div">
                          Invite friends to gudppl
                        </Typography>
                        <Typography variant="body1-secondary" component="div">
                          Do good deeds together with your friends
                        </Typography>
                      </>
                    }
                    description={
                      <>
                        <Grid container flexDirection="row" mt={4} display="flex" width="100%">
                          <Grid item flexDirection="row" display="flex" alignItems="center" width="100%">
                            <Image
                              src="/images/share_link_image.svg"
                              isAvatar
                              shape="rounded"
                              alt="invite-friends"
                              width={100}
                              height={69}
                              backgroundColor={palette.background.default}
                            />
                            <Box
                              ml={4}
                              display="flex"
                              flexDirection="row"
                              width="100%"
                              alignItems="center"
                              sx={{
                                display: { xs: 'block', md: 'flex' },
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderStyle: 'dashed',
                                borderColor: '#374EA9',
                                borderRadius: '8px',
                                backgroundColor: '#F4F7FF',
                                borderWidth: 'thin',
                              }}
                            >
                              <Typography variant="body4" p={1} component="div" color={palette.text.primary}>
                                Copy this link and share with your friends
                              </Typography>
                              <Button
                                variant="custom"
                                color="primary"
                                endIcon={<ContentCopyIcon />}
                                onClick={copyLinkToClipboard}
                                sx={{ width: '120px' }}
                              >
                                Copy link
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </>
                    }
                  />
                </Grid>
                <Grid item rowSpacing={1}>
                  <ActionBanner
                    horizontalSize={[3, 4, 3, 0]}
                    hasTitleTopGutter={false}
                    image={null}
                    imageWidth={0}
                    imageHeight={0}
                    title={
                      <>
                        <Typography variant="h4" component="div">
                          Why we do what we do
                        </Typography>
                        <Typography variant="body1-secondary" component="div">
                          People are looking for connection and purpose through meaningful action.
                        </Typography>
                      </>
                    }
                    description={
                      <>
                        <Typography variant="body1" mt={2} component="div">
                          Many organizations are struggling to sustain meaningful engagement to align their purpose with
                          their people.
                        </Typography>
                        <Typography variant="body1" mt={3} component="div">
                          gudppl platform connects people to do good. We help people and organizations find, align, and
                          scale their purpose, to address interconnected issues like climate change, ocean pollution,
                          inequality, addiction, loneliness, and more.
                        </Typography>
                        <Typography variant="body1" mt={3} component="div">
                          We believe through synchronizing our positive impacts and celebrating good deeds, we can scale
                          our collective action to create a kinder world.
                        </Typography>
                      </>
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          }
          rightColumn={
            <>
              <Grid mt={4} container spacing={3}>
                <PreferenceSetupProgress />
                <Grid item xs>
                  {isEmpty(organization) && !isFetching && (
                    <ActionBanner
                      direction="vertical"
                      image="/images/organization_banner_icon.svg"
                      title="Get your organization on board"
                      description="Create a profile for your school, business, charity, community group, or government agency, to easily manage your volunteer and donor supporters"
                      action={{
                        text: 'Create organization profile',
                        onClick: () => {
                          navigate(getRoute('private.app.organizations.create'));
                        },
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </>
          }
        />
      </Grid>
    </>
  );
}
