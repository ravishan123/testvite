import VerificationCodeInput from '@globals/VerificationCodeInput';
import { Box, Typography } from '@mui/material';
import { Button } from '@ui/button';
import { Grid } from '@ui/layout';
import { useEffect, useState } from 'react';
import { VerifyForgetPasswordProps } from './interfaces';

export default function VerifyForgetPassword({
  email,
  addVerificationCode,
  sendResetPasswordEmail,
}: VerifyForgetPasswordProps) {
  const [code, setCode] = useState('');

  const onSubmit = (code: string) => {
    setCode(code);
  };

  useEffect(() => {
    if (code) {
      addVerificationCode(code);
    }
  }, [addVerificationCode, code]);

  return email ? (
    <Grid maxWidth={350}>
      <Typography variant="h3" gutterBottom>
        Password reset
      </Typography>
      <Typography variant="body1" sx={{ color: '#797D88' }}>
        {`We've sent you an email to ${email} with a reset code. Please enter the code below, to change your password.`}
      </Typography>
      <Box sx={{ mt: '40px' }}>
        <Typography variant="body1" sx={{ fontSize: 12, mb: '4px' }}>
          Enter verification code *{' '}
        </Typography>
        <VerificationCodeInput onSubmit={onSubmit} loading={false} />
      </Box>
      <Button
        variant="outlined"
        fullWidth
        color="secondary"
        sx={{ my: 2 }}
        onClick={() => sendResetPasswordEmail({ email })}
      >
        Resend verification code
      </Button>
    </Grid>
  ) : (
    <Grid maxWidth={350}>
      <Typography variant="h4">Email not found</Typography>
    </Grid>
  );
}
