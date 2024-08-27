import { Typography } from '@ui/typography';
import { Grid } from '@ui/layout';
import { List, ListItem, ListItemIcon, ListItemText } from '@ui/list';
import { CheckCircleOutlineIcon } from '@ui/icons';
import ContentContainer from '@globals/contentContainer';

export default function HourVerifyBanner() {
  return (
    <ContentContainer size={[6, 5, 4, 5]}>
      <Grid container alignItems="center" flexDirection={'column'} sx={{ textAlign: 'left' }}>
        <Grid item width="122px">
          <img src="/images/hours_verification.svg" alt="hour verify banner" width="161px" height="106px" />
        </Grid>
        <Grid textAlign="left" mt={2}>
          <Typography variant="h4" width="85%">
            Verifying gifted time and skills will help...
          </Typography>
          <List sx={{ mt: 2 }} disablePadding>
            {[
              'your organization to scale and showcase your volunteer impact',
              'you attract, engage, and retain more volunteers and donors',
              'schools and cooperates identify and celebrate their caring students and employees',
            ].map((item) => (
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36, color: 'success.main' }}>
                  <CheckCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText>{item}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </ContentContainer>
  );
}
