import { getProfileLogo, stringAvatar } from '@utils/functions/avatarUtils';

import Image from '@ui/image';
import { Grid } from '@ui/layout';
import { Skeleton } from '@ui/skeleton';
import { useTheme } from '@ui/theme';
import { Typography } from '@ui/typography';

type VolunteerAvatarProps = {
  id: string;
  firstName: string;
  lastName: string;
  isLoading?: boolean;
  isFilled?: boolean;
};

export default function VolunteerAvatar({ id, firstName, lastName, isLoading, isFilled }: VolunteerAvatarProps) {
  const theme = useTheme();

  return (
    <Grid
      container
      columnGap={2}
      rowGap={2}
      display="inline-flex"
      {...(isFilled && {
        sx: {
          borderRadius: `${theme.borderRadius.md}px`,
          padding: '10px 14px',
          backgroundColor: theme.palette.grey[500],
          minWidth: 324,
          width: 'auto',
        },
      })}
    >
      <Grid item display="flex" alignItems="center">
        <Image
          width={40}
          height={40}
          backgroundColor={theme.palette.common.white}
          backgroundColorOnError={theme.palette.primary.main}
          sx={{ fontSize: theme.fontSize.sm, border: `1px solid ${theme.palette.grey['200']}` }}
          alt="profile"
          isAvatar
          src={getProfileLogo(id)}
        >
          {stringAvatar(`${firstName} ${lastName}`).text}
        </Image>
      </Grid>
      <Grid item justifyContent="center" display="flex" flexDirection="column">
        {!isFilled && (
          <Typography variant="body1-secondary" mb={0.5}>
            {isLoading ? <Skeleton height={14} width={100} /> : 'Requested by'}
          </Typography>
        )}
        <Typography variant="h5">
          {isLoading ? <Skeleton height={28} width={150} /> : `${firstName} ${lastName}`}
        </Typography>
      </Grid>
    </Grid>
  );
}
