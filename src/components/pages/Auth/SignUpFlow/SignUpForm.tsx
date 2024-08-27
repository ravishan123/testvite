import { useForm, Controller } from 'react-hook-form';
import { Box, Grid, Checkbox, Typography, Link, FormControlLabel } from '@mui/material';
import { Button } from '@ui/button';
import CustomTextField from '@globals/CustomTextField';
import { Auth } from 'aws-amplify';
import { authProviders } from '@constants/amplifyAuthEvents';
import { useNavigate } from 'react-router-dom';
import { theme } from '@ui/theme';
import React, { useState } from 'react';
import PasswordHelperTextTooltip from '@globals/PasswordHelperTextTooltip';
import { getRoute } from '@utils/configs/routesConfig';

interface IFormInput {
  email: string;
  password: string;
  confirmAge: boolean;
}

const SignUpForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IFormInput>();
  const watchAllFields = watch();

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: IFormInput) => {
    setIsSubmitting(true);
    Auth.signUp({
      username: data.email.trim(),
      password: data.password,
      attributes: {
        email: data.email,
        'custom:ageConsent': data?.confirmAge ? 'true' : 'false',
        'custom:gettingStartedStep': '1',
        'custom:provider': authProviders.COGNITO,
      },
      autoSignIn: {
        enabled: true,
      },
    })
      .then(() => {
        setIsSubmitting(false);
        navigate(getRoute('public.verifyEmail'), {
          state: { email: data.email },
        });
      })
      .catch((err: Error) => {
        console.log(err.stack);
        setIsSubmitting(false);
      });
  };

  const isFormInvalid = () => {
    const { email, password, confirmAge } = watchAllFields;
    return Object.keys(errors).length > 0 || !email?.length || !(password?.length > 5) || !confirmAge;
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
              message: 'Enter a valid email address',
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
            minLength: {
              value: 6,
              message: 'Password should have at least 6 alphanumeric characters',
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z]).*$/,
              message: 'Password should contain at least 1 upper case and one lower case',
            },
            validate: (value) => {
              {
                // eslint-disable-next-line no-useless-escape
                if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) {
                  return 'Password should contain at least one special character';
                }
                if (/\s/.test(value)) {
                  return 'Password cannot contain space';
                }
                return true;
              }
            },
          }}
          render={({ field }) => (
            <>
              <CustomTextField
                {...field}
                label="Password"
                type="password"
                placeholder="Enter a new password"
                errorMessages={errors.password?.message}
                fullWidth
                tooltipComponent={<PasswordHelperTextTooltip />}
              />
            </>
          )}
        />
      </Grid>
      <Grid item xs={12} container alignItems="center">
        <FormControlLabel
          style={{ marginLeft: -3 }}
          control={
            <Controller
              name="confirmAge"
              control={control}
              defaultValue={false}
              rules={{ required: 'You must confirm your age' }}
              render={({ field }) => <Checkbox {...field} required />}
            />
          }
          label={<Typography paddingLeft="5px">I confirm that I’m 13 years or older</Typography>}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" sx={{ color: 'text.secondary', my: 2 }}>
          By clicking ‘Create account’, I agree to the{' '}
          <Link
            target="_blank"
            sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
            href={getRoute('public.privacyPolicy')}
          >
            terms & conditions
          </Link>
          ,{' '}
          <Link
            target="_blank"
            sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
            href={getRoute('public.privacyPolicy')}
          >
            privacy policy
          </Link>
          , &{' '}
          <Link
            target="_blank"
            sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
            href={getRoute('public.honorCode')}
          >
            honour code
          </Link>
          .
        </Typography>
      </Grid>
      <Grid item xs={12} my={3}>
        <Button type="submit" fullWidth disabled={isFormInvalid()} loading={isSubmitting}>
          Create account
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" sx={{ my: 2 }}>
          Already have a gudppl account?
          <Link
            onClick={() => navigate(getRoute('public.signin'))}
            sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
            underline="none"
          >
            {` Log in here`}
          </Link>
        </Typography>
      </Grid>
    </Box>
  );
};

export default SignUpForm;
