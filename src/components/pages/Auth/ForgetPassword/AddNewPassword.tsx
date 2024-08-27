import CustomTextField from '@globals/CustomTextField';
import { Box, Grid } from '@mui/material';
import { Button } from '@ui/button';
import { Controller } from 'react-hook-form';
import { AddNewPasswordProps } from './interfaces';
import { Typography } from '@ui/typography';

export default function AddNewPassword({
  forgotPasswordSubmit,
  control,
  errors,
  handleSubmit,
  watch,
  loading,
}: AddNewPasswordProps) {
  const watchFields = watch();
  const { newPassword, confirmNewPassword } = watchFields;
  return (
    <Grid width={350}>
      <Typography variant="h3" gutterBottom>
        Reset your password
      </Typography>
      <Box component={'form'} onSubmit={handleSubmit(() => forgotPasswordSubmit({ newPassword: newPassword || '' }))}>
        <Grid sx={{ my: '40px' }}>
          <Grid sx={{ mb: '24px' }}>
            <Controller
              name="newPassword"
              control={control}
              defaultValue=""
              rules={{
                required: 'Password is required',
                pattern: {
                  value: new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{6,}$'),
                  message:
                    'Password must contain minimum six characters, at least one letter, one number and one special character',
                },
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label="New password"
                  type="password"
                  placeholder="Enter a new password"
                  errorMessages={errors.newPassword?.message?.toString()}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid>
            <Controller
              name="confirmNewPassword"
              control={control}
              defaultValue=""
              rules={{
                required: 'Password confirmation is required',
                pattern: {
                  value: new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{6,}$'),
                  message:
                    'Password must contain minimum six characters, at least one letter, one number and one special character',
                },
                validate: (value) => value === newPassword || 'Passwords do not match. Please try again',
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  label="Confirm new password"
                  type="password"
                  placeholder="Re enter new password"
                  errorMessages={errors.confirmNewPassword?.message?.toString()}
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            disabled={Object.keys(errors).length > 0 || !newPassword?.length || !confirmNewPassword?.length}
            loading={loading}
          >
            Confirm
          </Button>
        </Grid>
      </Box>
    </Grid>
  );
}
