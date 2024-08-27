import { Grid } from '@ui/layout';
import { Typography } from '@ui/typography';
import ContentContainer from './contentContainer';

export default function ComingSoonBanner({ backgroundColor = 'common.white' }) {
  return (
    <ContentContainer sx={{ backgroundColor, borderTop: 'none' }} flexGrow={1} display="flex" alignItems="center">
      <Grid container alignItems="center" flexDirection="column">
        <img src="/images/maintenance_banner.svg" width="153px" alt="coming soon" />
        <Typography variant="h5" mt={4}>
          Feature coming soon
        </Typography>
        <Typography variant="body1-secondary" mt={1 / 2} textAlign="center">
          This feature is under construction and will
          <br />
          be available soon
        </Typography>
      </Grid>
    </ContentContainer>
  );
}
