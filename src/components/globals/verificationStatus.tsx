import { CancelOutlinedIcon, InfoOutlinedIcon, VerifiedOutlinedIcon } from '@ui/icons';
import { Box } from '@ui/layout';
import { useTheme } from '@ui/theme';
import { Typography } from '@ui/typography';
import { ActivityStatusEnum } from '@utils/enums/activity.enum';
import { ActivityStatus } from '@utils/types/activity.type';

type VerificationStatusProps = {
  status: ActivityStatus;
};

export default function VerificationStatus({ status }: VerificationStatusProps) {
  const theme = useTheme();

  if (status === ActivityStatusEnum.Approved || status === ActivityStatusEnum.Amended) {
    return (
      <Box display="flex" alignItems="center" color={theme.palette.secondary[100]}>
        <VerifiedOutlinedIcon sx={{ fontSize: 20 }} />
        <Typography mt={0.1} ml={0.5} color="inherit">
          Verified
        </Typography>
      </Box>
    );
  } else if (status === ActivityStatusEnum.Pending) {
    return (
      <Box display="flex" alignItems="center" color={theme.palette.warning.main}>
        <InfoOutlinedIcon sx={{ fontSize: 20 }} />
        <Typography mt={0.1} ml={0.5} color="inherit">
          Pending
        </Typography>
      </Box>
    );
  } else if (status === ActivityStatusEnum.Declined) {
    return (
      <Box display="flex" alignItems="center" color={theme.palette.error.main}>
        <CancelOutlinedIcon sx={{ fontSize: 20 }} />
        <Typography mt={0.1} ml={0.5} color="inherit">
          Declined
        </Typography>
      </Box>
    );
  }

  return null;
}
