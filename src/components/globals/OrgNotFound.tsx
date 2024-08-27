import { Grid } from '@ui/layout';
import { Typography } from '@ui/typography';
import ContentContainer from './contentContainer';

export default function OrgNotFound({ backgroundColor = 'common.white' }) {
  return (
    <ContentContainer sx={{ backgroundColor, borderTop: 'none' }} flexGrow={1} display="flex" alignItems="center">
      <Grid container alignItems="center" flexDirection="column">
        <img src="/images/maintenance_banner.svg" width="153px" alt="coming soon" />
        <Typography variant="h5" mt={4}>
          This organization is no longer active
        </Typography>
        <Typography variant="body1-secondary" mt={1 / 2} textAlign="center">
          Please visit the Organizations Tab <br />
          to browse all active profiles
        </Typography>
      </Grid>
    </ContentContainer>
  );
}
