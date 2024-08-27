import { Grid, Typography } from '@mui/material';

import SignInForm from './SignInForm';
import AuthContainer from '@layouts/containers/authContainer';
import GudPplIcon from '@ui/icons/GudPplIcon';
import SSOContainer from '../SSOContainer';
import Separator from '../Separator';

export default function SignInFlow() {
  return (
    <AuthContainer
      rightColumn={
        <Grid maxWidth={350}>
          <GudPplIcon mb="40px" />
          <Typography variant="h4" mb="24px">
            Log In to your account
          </Typography>
          <SSOContainer />
          <Separator />
          <SignInForm />
        </Grid>
      }
    />
  );
}
