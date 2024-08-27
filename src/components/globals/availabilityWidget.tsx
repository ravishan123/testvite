import React, { useEffect, useState } from 'react';
import ActionWidgetCard from '@globals/actionWidgetCard';
import { useAtom } from 'jotai';
import { Grid, Box } from '@ui/layout';
import { Typography } from '@ui/typography';
import { getAvailabilityQueryAtom } from '@serverAtoms/preferences/availability/getAvailability.atom';

import { Skeleton } from '@ui/skeleton';

type AvailabilityWidgetProps = {
  onEditClick?: () => void;
};

type AvailabilityDataItem = {
  weekday: string;
  morning: boolean;
  evening: boolean;
  afternoon: boolean;
};

type TransformedDataItem = {
  label: string;
  availability: string;
};

const customOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AvailabilityWidget: React.FC<AvailabilityWidgetProps> = ({ onEditClick = () => undefined }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [getAvailability] = useAtom(getAvailabilityQueryAtom);
  const availability = getAvailability.data;

  useEffect(() => {
    setIsLoading(getAvailability.isLoading);
  }, [getAvailability.isLoading]);

  const transformData = (data: AvailabilityDataItem[] | undefined): TransformedDataItem[] => {
    if (!data) {
      return [];
    }

    return data.map((item) => {
      const { weekday, morning, evening, afternoon } = item;
      const availability = [];

      if (morning) availability.push('Morning');
      if (afternoon) availability.push('Afternoon');
      if (evening) availability.push('Evening');

      return {
        label: weekday.charAt(0).toUpperCase() + weekday.slice(1, 3),
        availability: availability.length !== 3 ? availability.join(', ') : 'All day',
      };
    });
  };

  const transformedData: TransformedDataItem[] = transformData(availability?.data || []);

  return (
    <ActionWidgetCard
      isEmpty={!transformedData.length}
      title="Availability"
      actionTitle="Edit availability"
      onActionClick={onEditClick}
    >
      <Grid display="flex" flexDirection="column">
        {isLoading
          ? Array.from({ length: 6 }, (_, index) => (
              <Box key={index} display="inline-flex" justifyContent="space-between">
                <Skeleton animation="wave" width={35} />
                <Skeleton animation="wave" width={96} />
              </Box>
            ))
          : transformedData
              .sort((a, b) => customOrder.indexOf(a.label) - customOrder.indexOf(b.label))
              .map((day, index) => (
                <Box key={index} display="inline-flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body4" component="div">
                    {day.label}
                  </Typography>
                  <Typography variant="body1-secondary" component="div">
                    {day.availability}
                  </Typography>
                </Box>
              ))}
      </Grid>
    </ActionWidgetCard>
  );
};

export default AvailabilityWidget;
