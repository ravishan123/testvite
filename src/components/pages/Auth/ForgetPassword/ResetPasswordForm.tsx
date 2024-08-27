import { Controller } from 'react-hook-form';
import { Grid } from '@mui/material';
import CustomTextField from '@globals/CustomTextField';
import { Button } from '@ui/button';
import { Typography, Box } from '@mui/material';
import { ResetPasswordFormProps } from './interfaces';

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  control,
  errors,
  handleSubmit,
  onSubmit,
  email,
  isLoading,
}) => {
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Reset password
      </Typography>
      <Typography variant="body1" sx={{ color: '#797D88', mt: '4px' }}>
        To reset your password, enter the email address you used to log into the account.
      </Typography>
      <Box component={'form'} onSubmit={handleSubmit(onSubmit)} sx={{ mt: '32px' }}>
        <Grid item xs={12}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Please enter a valid email address ',
              },
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Email address"
                placeholder="Enter your email address"
                errorMessages={errors.email?.message?.toString()}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            disabled={Object.keys(errors).length > 0 || !email?.length}
            loading={isLoading}
            sx={{ mt: '16px' }}
          >
            Continue
          </Button>
        </Grid>
      </Box>
    </>
  );
};
