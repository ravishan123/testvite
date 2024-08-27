import { useNavigate } from 'react-router-dom';
import { getRoute } from '@utils/configs/routesConfig';
import { Grid } from '@ui/layout';
import { Typography } from '@ui/typography';
import ContentContainer from './contentContainer';
import { Button } from '@ui/button';

export default function ProfileEmptyBanner({
  backgroundColor = 'common.white',
  isOrg,
}: {
  backgroundColor?: string;
  isOrg?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <ContentContainer sx={{ backgroundColor }} flexGrow={1} display="flex" alignItems="center" mt={2}>
      <Grid container alignItems="center" flexDirection="column" my={3}>
        <img src="/images/profile_empty_banner_images.svg" width="153px" alt="coming soon" />
        <Typography variant="h5" mt={4}>
          Have you volunteered lately?
        </Typography>
        {!isOrg && (
          <Typography variant="body1-secondary" mt={1} mb={5} textAlign="center" width={247}>
            Don't forget to get your volunteer contributions verified.
          </Typography>
        )}

        {isOrg && (
          <Button onClick={() => navigate(getRoute('private.app.addHours'))} sx={{ mt: 4, width: 221 }}>
            Add volunteer hours
          </Button>
        )}
      </Grid>
    </ContentContainer>
  );
}
