import { JSXElementConstructor, ReactNode } from 'react';

import { getRandomIntInclusive } from '@utils/functions/random';

import { Grid } from '@ui/layout';
import { Typography } from '@ui/typography';
import { useTheme } from '@ui/theme';
import { Skeleton } from '@ui/skeleton';

type FormDataDisplayItemProps = {
  Icon?: JSXElementConstructor<{ sx: { color: string } }>;
  label: string;
  children: ReactNode;
  gap?: number;
  isLoading?: boolean;
};

export default function FormDataDisplayItem({ Icon, label, children, gap = 0, isLoading }: FormDataDisplayItemProps) {
  const theme = useTheme();

  return (
    <Grid item display="flex" columnGap={2} rowGap={1}>
      {Icon && (
        <Grid width={40} height={40} display="flex" alignItems="center" justifyContent="center" item p={1}>
          <Icon sx={{ color: theme.palette.text.secondary }} />
        </Grid>
      )}
      <Grid item xs display="flex" flexDirection="column" rowGap={gap}>
        <Typography variant="body1-secondary">
          {isLoading ? <Skeleton height={14} width={getRandomIntInclusive(100, 200)} /> : label}
        </Typography>
        <Typography variant="body4">
          {isLoading ? <Skeleton height={28} width={getRandomIntInclusive(100, 200)} /> : children}
        </Typography>
      </Grid>
    </Grid>
  );
}
