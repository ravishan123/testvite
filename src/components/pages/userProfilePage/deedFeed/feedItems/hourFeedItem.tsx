import { useState } from 'react';
import subDays from 'date-fns/subDays';
import formatDistance from 'date-fns/formatDistance';

import { getOrganizationLogo } from '@utils/functions/avatarUtils';
import { formatDate } from '@utils/functions/formatDate';
import { ActivityStatus } from '@utils/types/activity.type';
import { ActivityStatusEnum } from '@utils/enums/activity.enum';
import { getCountryByCode } from '@utils/data/countries.data';
import { useAppSelector } from '@store/hooks';
import { selectUserProfile } from '@store/slices/profile/profile.slice';
import { selectUserProfileImage } from '@store/slices/user/user.slice';
import { useFetchVolunteerActivityQuery } from '@store/slices/volunteer/volunteer.slice';

import { Typography } from '@ui/typography';
import { Avatar, AvatarGroup } from '@ui/avatar';
import Image from '@ui/image';
import { Box, Grid } from '@ui/layout';
import { useTheme } from '@ui/theme';
import { Chip } from '@ui/chip';
import { Button } from '@ui/button';
import { FiberManualRecordIcon } from '@ui/icons';
import { Collapse } from '@ui/transition';
import { Skeleton } from '@ui/skeleton';
import { Alert } from '@ui/alert';
import { HomeWorkOutlinedIcon } from '@ui/icons';

import ContentContainer from '@globals/contentContainer';
import TextClipper from '@globals/textClipper';
import ListCauses from '@globals/causesDisplay/listCauses';
import ListUnsdg from '@globals/unsdgDisplay/listUnsdg';
import VerificationStatus from '@globals/verificationStatus';

type HourFeedItemProps = {
  id: string;
  organizationName: string;
  city: string;
  country: string;
  activityDescription: string;
  hours: string;
  minutes: string;
  startDate: string;
  endDate: string;
  status: ActivityStatus;
  createdAt: string;
  logo: string;
};

export default function HourFeedItem({
  id,
  organizationName,
  city,
  country,
  activityDescription,
  hours,
  minutes,
  startDate,
  endDate,
  status,
  createdAt,
  logo,
}: HourFeedItemProps) {
  const theme = useTheme();
  const profile = useAppSelector(selectUserProfile);
  const { url: imageUrl } = useAppSelector(selectUserProfileImage);
  const [isExpanded, setIsExpanded] = useState(false);
  const { data, isFetching, isError, error } = useFetchVolunteerActivityQuery(id, { skip: !isExpanded });

  const customSkills = (data?.skills?.customSkills?.map((skill) => skill?.['skill']) || []).filter(Boolean);
  const defaultSkills = (data?.skills?.defaultSkills?.map((skill) => skill.name) || []).filter(Boolean);
  const skills = [...customSkills, ...defaultSkills];

  const unsdg = data?.unsdgs?.map((item) => item.id) || [];
  const causes = data?.causes?.map((item) => item.id) || [];

  return (
    <ContentContainer sx={{ mt: 4 }} size="sm" display="flex" flexDirection="column" alignItems="center">
      <Grid container columnSpacing={2} pb={2}>
        <Grid item>
          <AvatarGroup>
            <Image
              isAvatar
              src={imageUrl || ''}
              width={48}
              height={48}
              alt="profile image"
              sx={{ mr: -0.5, top: -2, fontSize: theme.fontSize.sm, border: `4px solid ${theme.palette.common.white}` }}
            />

            <Avatar
              src={getOrganizationLogo(logo)}
              variant="rounded"
              sx={{ width: 40, height: 40, bgcolor: theme.palette.grey[100] }}
              imgProps={{
                style: {
                  objectFit: 'contain',
                },
              }}
            >
              <HomeWorkOutlinedIcon />
            </Avatar>
          </AvatarGroup>
        </Grid>

        <Grid item xs={12} sm>
          <Grid container justifyContent="space-between">
            <Grid item xs={12} sm>
              <Typography variant="h4" display="inline" mr={1}>
                {profile?.first_name} {profile?.last_name}
              </Typography>
              <Typography variant="h4" display="inline">
                <span className="no-weight">volunteered for</span>
                <span style={{ wordBreak: 'break-all' }}>{organizationName}</span>
              </Typography>
              <Grid alignItems="center" display="flex" item xs={12}>
                <Typography variant="helper-text" color="text.secondary">
                  {city && country ? `${city}, ${getCountryByCode(country)?.name || country || ''}` : 'Remote'}
                </Typography>
              </Grid>
            </Grid>
            <Grid item sx={{ textAlign: { xs: 'left', sm: 'right' }, maxWidth: { xs: 200 } }} xs={12} sm>
              <Typography variant="helper-text">
                {formatDistance(subDays(new Date(createdAt), 0), new Date(), {}).replace(/days?/, 'd')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Typography variant="body4" alignSelf="flex-start" sx={{ wordBreak: 'break-all' }}>
        <TextClipper text={activityDescription} rows={3} isShowFull={isExpanded} isShowSeeMoreBtn={false} />
      </Typography>
      <Grid container mt={isExpanded ? 0 : 2} style={{ transition: 'margin .3s' }}>
        <Collapse collapsedSize={0} in={isExpanded} sx={{ width: '100%' }}>
          {isError && (
            <Grid item xs={12} mb={1}>
              <Alert severity="error" sx={{ mt: 2 }}>
                {(error as Error)?.message || 'Something went wrong, Please refresh the page'}
              </Alert>
            </Grid>
          )}
          <Grid item xs={12} my={2}>
            {isFetching ? (
              <Box flexWrap="wrap" mb={2} columnGap={1} rowGap={1} display="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={`chip-${index}`} width={100} variant="rounded" height={28} sx={{ borderRadius: 14 }} />
                ))}
              </Box>
            ) : skills.length ? (
              <Box flexWrap="wrap" mb={2} columnGap={1} rowGap={1} display="flex">
                {skills.map((_, index) => (
                  <Chip
                    key={`chip-${index}`}
                    sx={{ width: 'auto', height: '28px', p: '4px 0' }}
                    label={<Typography variant="body4">{skills[index]}</Typography>}
                  />
                ))}
              </Box>
            ) : null}

            <Grid container columnSpacing={0.5} rowSpacing={0} alignItems="center">
              {Boolean(causes.length) && (
                <Grid item>
                  <ListCauses items={causes} isLoading={isFetching} invert tileSize={28} />
                </Grid>
              )}
              {Boolean(causes.length && unsdg.length) && (
                <FiberManualRecordIcon
                  sx={{ fontSize: 4, m: theme.spacing(5 / 8, 1, 0.25), color: theme.palette.grey[200] }}
                />
              )}
              {Boolean(unsdg.length) && (
                <Grid item>
                  <ListUnsdg
                    selected={unsdg}
                    tileSize={26}
                    spacing={0.5}
                    isSelectionLoading={isFetching}
                    skeletonLength={3}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Collapse>
        <Grid container display="flex" alignItems="center" rowGap={1}>
          <Grid item xs={12} sm>
            <Grid
              item
              xs={12}
              sm
              display="flex"
              alignItems="center"
              sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' } }}
              rowGap="4px"
            >
              <Box display="flex" alignItems="center">
                <Typography variant="h5">
                  {hours || '0'}h {minutes || '0'}m
                </Typography>
                <Typography ml={0.5} variant="helper-text">
                  given
                </Typography>
              </Box>
              <FiberManualRecordIcon
                sx={{
                  fontSize: 4,
                  m: theme.spacing(5 / 8, 1, 0.25),
                  color: theme.palette.grey[200],
                  display: { xs: 'none', sm: 'inline-block' },
                }}
              />
              <Box mr={1}>
                <Typography variant="helper-text">{`${formatDate(startDate)} - ${formatDate(endDate)}`}</Typography>
              </Box>
              <Box>
                <VerificationStatus status={status} />
              </Box>
            </Grid>

            <Collapse collapsedSize={0} in={isExpanded}>
              {isFetching && (
                <>
                  <Skeleton width={200} height={16} sx={{ mt: 2 }} />
                  <Skeleton width={400} height={18} sx={{ mt: 1 }} />
                  <Skeleton width={380} height={18} />
                  <Skeleton width={385} height={18} />
                </>
              )}
              {(status === ActivityStatusEnum.Declined || data?.amendReason) && (
                <Grid item xs={12}>
                  <Box mt={2} maxWidth="600px">
                    <Typography mb={1} variant="body1" color="text.secondary">
                      {`Reasons for ${status === ActivityStatusEnum.Declined ? 'decline' : 'amend'}`}
                    </Typography>
                    <Typography variant="helper-text">{data?.amendReason || data?.declineReason}</Typography>
                  </Box>
                </Grid>
              )}
            </Collapse>
          </Grid>
          <Grid item sx={{ maxWidth: { xs: '100%', sm: 100 } }} xs={12} sm alignSelf="flex-end">
            <Box textAlign="right">
              <Button
                sx={{ p: '0 10px', height: 20, minHeight: 20, transform: 'translateX(10px)' }}
                variant="custom"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </ContentContainer>
  );
}
