import { getOrganizationLogo } from '@utils/functions/avatarUtils';

import { HomeWorkOutlinedIcon } from '@ui/icons';
import Image from '@ui/image';
import { Grid } from '@ui/layout';
import { Skeleton } from '@ui/skeleton';
import { useTheme } from '@ui/theme';
import { Typography } from '@ui/typography';

type VolunteerAvatarProps = {
  id: string;
  logo?: string;
  orgName?: string;
  coordinatorName?: string;
  isLoading?: boolean;
};

export default function OrganizationAvatar({ id, logo, orgName, coordinatorName, isLoading }: VolunteerAvatarProps) {
  const theme = useTheme();

  return (
    <Grid container columnSpacing={2} rowGap={2}>
      <Grid item display="flex" alignItems="center">
        <Image
          width={40}
          height={40}
          backgroundColor={theme.palette.common.white}
          sx={{ fontSize: theme.fontSize.sm, border: `1px solid ${theme.palette.grey['200']}` }}
          alt="profile"
          src={getOrganizationLogo(logo || id)}
          shape="rounded"
        >
          <HomeWorkOutlinedIcon />
        </Image>
      </Grid>
      <Grid item justifyContent="center" display="flex" flexDirection="column">
        <Typography variant="h5">{isLoading ? <Skeleton height={28} width={100} /> : orgName}</Typography>
        <Typography variant="helper-text">
          {isLoading ? (
            <Skeleton height={28} width={150} />
          ) : (
            <>
              To be verified by <span style={{ color: theme.palette.text.primary }}>{coordinatorName}</span>
            </>
          )}
        </Typography>
      </Grid>
    </Grid>
  );
}
