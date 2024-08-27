import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useLocation, useNavigate } from 'react-router-dom';

import { getRoute } from '@utils/configs/routesConfig';

import VerificationCodeInput from '@globals/VerificationCodeInput';
import AuthContainer from '@layouts/containers/authContainer';
import { Box, Typography } from '@mui/material';
import { Button } from '@ui/button';
import GudPplIcon from '@ui/icons/GudPplIcon';
import { Grid } from '@ui/layout';
import { useSnackbar } from '@ui/snackBar';

interface LocationState {
  email: string;
}

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReSending, setIsReSending] = useState(false);
  const locationState = location.state as LocationState;
  if (!locationState || !locationState.email) {
    navigate(getRoute('public.signin'));
  }
  const email = locationState?.email;

  const authResendSignUp = () => {
    setIsReSending(true);
    Auth.resendSignUp(email)
      .then(() => openSnackbar('Resend the email verification code', 'success'))
      .catch((err: Error) => {
        openSnackbar(err.message, 'error');
      });
    setIsReSending(false);
  };

  const onSubmit = async (code: string, setInput: (value: string[]) => void) => {
    setIsSubmitting(true);
    if (code.length < 6) {
      return openSnackbar('Enter the verification code', 'error');
    } else {
      await Auth.confirmSignUp(email, code)
        .then(() => {
          openSnackbar('Email Verified Successfully', 'success');
          setTimeout(() => {
            navigate(getRoute('private.app.home'));
            setIsSubmitting(false);
            /**
             * Reason to add timeout is to avoid to overcome the
             * state of 'user not authenticated' between the user confirmation
             * and the auto sign in.
             */
          }, 7000);
        })
        .catch((err: Error) => {
          if (err.name === 'ExpiredCodeException') {
            openSnackbar('OTP Expired, Please try again', 'error');
          } else {
            openSnackbar(
              err.message === 'Invalid verification code provided, please try again.' ? 'Incorrect code' : err.message,
              'error'
            );
          }
          setInput(['', '', '', '', '', '']);
          setIsSubmitting(false);
        });
    }
  };
  return (
    <AuthContainer
      rightColumn={
        <Box>
          <GudPplIcon mb={5} />
          {email ? (
            <Grid maxWidth={350}>
              <Typography variant="h3" gutterBottom>
                Verify your email address
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                {`We've sent you an email to ${email} with a verification code. Please enter the code below, to verify your email.
          Thank you.`}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 12 }}>
                Enter verification code *{' '}
              </Typography>

              <VerificationCodeInput onSubmit={onSubmit} loading={isSubmitting} />
              <Button
                variant="outlined"
                color="secondary"
                sx={{ my: 2 }}
                onClick={authResendSignUp}
                loading={isReSending}
                fullWidth
              >
                Resend verification code
              </Button>
            </Grid>
          ) : (
            <Grid maxWidth={350}>
              <Typography variant="h4">Email not found</Typography>
            </Grid>
          )}
        </Box>
      }
    />
  );
}
