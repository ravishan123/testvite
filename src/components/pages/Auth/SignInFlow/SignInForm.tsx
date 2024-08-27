import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Grid, Typography, Link } from '@mui/material';
import { Button } from '@ui/button';
import CustomTextField from '@globals/CustomTextField';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { theme } from '@ui/theme';
import { getRoute } from '@utils/configs/routesConfig';
import { useSnackbar } from '@ui/snackBar';

interface IFormInput {
  email: string;
  password: string;
  confirmAge: boolean;
}

interface CognitoUserObject {
  attributes: {
    name: string;
  };
}

const SignInForm: React.FC = () => {
  const { openSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IFormInput>();

  const navigate = useNavigate();
  const watchAllFields = watch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isFormInvalid = () => {
    const { email } = watchAllFields;
    return Object.keys(errors).length > 0 || !email?.length;
  };

  const onSubmit = (data: IFormInput) => {
    setIsSubmitting(true);
    Auth.signIn({
      username: data.email,
      password: data.password,
    })
      .then((res: CognitoUserObject) => {
        const firstName = res?.attributes?.name?.split(' ')?.[0] ?? '';
        setIsSubmitting(false);
        navigate(getRoute('private.app.home'));
        openSnackbar(`Welcome ${firstName}`, 'success');
      })
      .catch((err: Error) => {
        setIsSubmitting(false);
        if (err.message === 'User is not confirmed.') {
          openSnackbar(err.message, 'error');
          navigate(getRoute('public.verifyEmail'), {
            state: { email: data.email },
          });
        } else {
          openSnackbar('Wrong Username /  Password', 'error');
        }
      });
  };

  return (
    <Box component={'form'} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid item xs={12}>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              label="Email address"
              placeholder="Enter your email address"
              errorMessages={errors.email?.message}
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{
            required: 'Password is required',
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              label="Password"
              type="password"
              placeholder="Enter your password"
              errorMessages={errors.password?.message}
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" sx={{ color: theme.palette.primary.main, my: 3 }}>
          <Link
            onClick={() => navigate('/forgot-password')}
            sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
            underline="none"
          >
            Forgot password?
          </Link>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button type="submit" fullWidth disabled={isFormInvalid()} loading={isSubmitting}>
          Continue
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" sx={{ my: 3 }}>
          New to gudppl?{' '}
          <Link
            onClick={() => navigate(getRoute('public.signup'))}
            sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
            underline="none"
          >
            Create an account
          </Link>
        </Typography>
      </Grid>
    </Box>
  );
};

export default SignInForm;
