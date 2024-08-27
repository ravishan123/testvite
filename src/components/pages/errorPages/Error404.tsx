import ComingSoonBanner from '@globals/comingSoonBanner';
import { Grid } from '@ui/layout';

export default function Error404() {
  return (
    <Grid
      width="100%"
      textAlign={'center'}
      alignItems={'center'}
      alignContent="center"
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <ComingSoonBanner backgroundColor="primary.light" />
    </Grid>
  );
}
