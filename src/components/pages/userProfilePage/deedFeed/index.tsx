import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFetchVolunteerActivitiesQuery } from '@store/slices/volunteer/volunteer.slice';
import { Activity } from '@utils/types/activity.type';

import { Box, Grid } from '@ui/layout';
import { Tab } from '@ui/tab';
import { Tabs } from '@ui/tabs';
import { Typography } from '@ui/typography';
import { useTheme } from '@ui/theme';
import { IconButton } from '@ui/button';
import { AddCircleIcon } from '@ui/icons';

import HourFeedItem from './feedItems/hourFeedItem';
import { CircularProgress } from '@ui/circularProgress';
import { getRoute } from '@utils/configs/routesConfig';
import ProfileEmptyBanner from '@globals/profileEmptyBanner';

const options = [
  { value: 'ALL', label: 'All' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'DECLINED', label: 'Declined' },
];

export default function DeedFeed() {
  const navigate = useNavigate();
  const [value, setValue] = useState(options[0].value);
  const { palette, spacing } = useTheme();

  const [page, setPage] = useState(1);

  const observer = useRef<IntersectionObserver>();
  const lastRecord = useCallback((node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  const { data: activities, isFetching } = useFetchVolunteerActivitiesQuery({
    page,
    limit: 10,
    status: value === options[0].value ? '' : value,
  });

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setPage(1);
    setValue(newValue);
  };

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sx={{
          bgcolor: palette.common.white,
          p: spacing(0, 0, 0, 0),
          borderRadius: 1,
          mt: 2,
        }}
      >
        <Box
          display="inline-flex"
          alignSelf="center"
          width="100%"
          justifyContent="center"
          alignItems="center"
          color="primary"
          borderBottom={`1px solid ${palette.grey[100]}`}
        >
          <IconButton
            disableRipple
            sx={{ color: palette.primary.main }}
            onClick={() => navigate(getRoute('private.app.addHours'))}
          >
            <AddCircleIcon sx={{ m: 1 }} />
            <Typography variant="h4">Add volunteer hours</Typography>
          </IconButton>
        </Box>
        <Box pl={2}>
          <Tabs value={value} onChange={handleChange} aria-label="deed feed tabs">
            <Tab
              value={options[0].value}
              disableRipple
              label={
                <Typography variant="h6" fontWeight={400}>
                  {options[0].label}
                </Typography>
              }
            />
            <Tab
              value={options[1].value}
              disableRipple
              label={
                <Typography variant="h6" fontWeight={400}>
                  {options[1].label}
                </Typography>
              }
            />
            <Tab
              value={options[2].value}
              disableRipple
              label={
                <Typography variant="h6" fontWeight={400}>
                  {options[2].label}
                </Typography>
              }
            />
            <Tab
              value={options[3].value}
              disableRipple
              label={
                <Typography variant="h6" fontWeight={400}>
                  {options[3].label}
                </Typography>
              }
            />
          </Tabs>
        </Box>
      </Grid>
      <Grid item xs flexDirection="column" display="flex">
        {activities?.map((activity: Activity, i: number) => {
          if (activities.length === i + 1) {
            return (
              <div
                style={{ display: 'flex', flexGrow: 0, flexShrink: 1 }}
                key={`feed-item-container-${activity.id}`}
                ref={lastRecord}
              >
                <HourFeedItem
                  key={`feed-item-last-${activity.id}`}
                  id={activity.id}
                  organizationName={activity.organizationName}
                  city={activity.city}
                  country={activity.country}
                  activityDescription={activity.activityDescription}
                  hours={activity.hours}
                  minutes={activity.minutes}
                  startDate={activity.startDate}
                  endDate={activity.endDate}
                  status={activity.status}
                  createdAt={activity.createdAt}
                  logo={activity.logo}
                />
              </div>
            );
          } else {
            return (
              <HourFeedItem
                id={activity.id}
                key={`feed-item-${activity.id}`}
                organizationName={activity.organizationName}
                city={activity.city}
                country={activity.country}
                activityDescription={activity.activityDescription}
                hours={activity.hours}
                minutes={activity.minutes}
                startDate={activity.startDate}
                endDate={activity.endDate}
                status={activity.status}
                createdAt={activity.createdAt}
                logo={activity.logo}
              />
            );
          }
        })}
        {activities && activities?.length === 0 && !isFetching && <ProfileEmptyBanner />}
      </Grid>
      <Grid item xs={12} justifyContent="center" display="flex" m={2} alignItems="center">
        {isFetching && (
          <>
            <CircularProgress size={24} />
            <Typography variant="h6" ml={2}>
              Loading feed...
            </Typography>
          </>
        )}
      </Grid>
    </Grid>
  );
}
