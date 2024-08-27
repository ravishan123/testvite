import { Box } from '@ui/layout';
import { Typography } from '@ui/typography';

export default function SearchEmpty() {
  return (
    <Box
      height={340}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      p={3}
    >
      <Typography variant="h3">No results found</Typography>
      <Typography variant="body4" mt={0.5}>
        Please update your search and filters
      </Typography>
    </Box>
  );
}
