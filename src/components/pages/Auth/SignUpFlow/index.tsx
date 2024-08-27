import { Grid, Typography } from '@mui/material';

import SignUpForm from './SignUpForm';
import AuthContainer from '@layouts/containers/authContainer';
import GudPplIcon from '@ui/icons/GudPplIcon';
import SSOContainer from '../SSOContainer';
import Separator from '../Separator';
import { ReactElement } from 'react';

export default function SignUpFlow(): ReactElement {
  return (
    <AuthContainer
      rightColumn={
        <Grid maxWidth={350}>
          <GudPplIcon mb={5} />
          <Typography variant="h4" mb="4px">
            Create your account
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
            }}
            mb={3}
          >
            Kindly be honest, accountable, & respectful
          </Typography>
          <SSOContainer />
          <Separator />
          <SignUpForm />
        </Grid>
      }
    />
  );
}
