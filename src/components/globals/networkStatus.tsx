import { CircularProgress } from '@ui/circularProgress';
import { Alert } from '@ui/alert';
import { Box } from '@ui/layout';
import { Typography } from '@ui/typography';

export function NetworkStatus({
  isLoading,
  error,
  isFetching,
  isError,
  loadingText = 'Loading...',
}: {
  isLoading?: boolean;
  isFetching?: boolean;
  error?: string;
  isError?: boolean;
  loadingText?: string;
}) {
  if (isError) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (isLoading || isFetching) {
    return (
      <Box display="flex" alignItems="center" my={1}>
        <CircularProgress size={14} />{' '}
        <Typography sx={{ ml: 1 }} variant="body1">
          {loadingText}
        </Typography>
      </Box>
    );
  }

  return null;
}
