import { useEffect, useState } from 'react';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import { Grid, SvgIcon } from '@mui/material';

import { providers } from '@utils/configs/ssoProviders';
import { Button } from '@ui/button';

export default function SSOContainer() {
  const [isLoading, setIsLoading] = useState('');

  const handleOnClick = async (name: string, provider: CognitoHostedUIIdentityProvider) => {
    setIsLoading(name);
    await Auth.federatedSignIn({ provider });
  };

  useEffect(() => {
    return () => {
      setIsLoading('');
    };
  }, []);

  return (
    <Grid container rowGap={2} marginY={'3%'}>
      {providers.map(({ name, icon, provider }) => (
        <Button
          key={name}
          variant="text"
          onClick={() => handleOnClick(name, provider)}
          fullWidth
          loading={name === isLoading}
        >
          <SvgIcon sx={{ marginRight: '8px' }}>{icon}</SvgIcon>
          Continue with {name}
        </Button>
      ))}
    </Grid>
  );
}
