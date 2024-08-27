import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormHelperText, Typography } from '@mui/material';
import CountryCitySelector from '@ui/CountryCitySelector';
import { IForm } from '../../orgCreation/orgCreation';
import FormInput from '@globals/FormInput';
import CustomPhoneInput from '@globals/CustomPhoneInput';
import { Box } from '@ui/layout';
import { useTheme } from '@ui/theme';

const CHARACTER_LIMIT = 5000;

export default function OrgDetails() {
  const methods = useFormContext<IForm>();

  const { palette } = useTheme();

  const [aboutOrg, setAboutOrg] = useState('');

  return (
    <>
      <Box>
        <Typography component="span" variant="h5">
          About your organization *
        </Typography>
        <FormInput
          name="organizationDescription"
          id="organizationDescription"
          sx={{ width: '100%' }}
          onChange={(description) => setAboutOrg(description.target.value)}
          fullWidth
          placeholder="Who we are and the positive impact we wish to make in the community"
          multiline
          inputProps={{
            maxLength: CHARACTER_LIMIT,
          }}
          InputProps={{
            endAdornment: (
              <div style={{ position: 'absolute', right: '12px', bottom: '6px' }}>
                <Typography sx={{ color: palette.grey[200] }}>
                  {aboutOrg.length}/{CHARACTER_LIMIT}
                </Typography>
              </div>
            ),
          }}
        />
      </Box>
      <Box mt={4}>
        <Typography component="span" variant="h5">
          Phone number *
        </Typography>
        <Controller
          control={methods.control}
          name="phoneNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomPhoneInput
              disableLabel
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={methods.formState.errors.phoneNumber?.message}
            />
          )}
        />
      </Box>
      <Box mt={4}>
        <Typography component="span" variant="h5">
          Location *
        </Typography>
        <Controller
          control={methods.control}
          name="location"
          render={({ field: { onChange, onBlur, value } }) => (
            <CountryCitySelector disableLabel value={value} onChange={onChange} onBlur={onBlur} />
          )}
        />
        <FormHelperText error={Boolean(methods.formState.errors.location?.message)}>
          {methods.formState.errors.location?.country?.message ||
            methods.formState.errors.location?.city?.message ||
            methods.formState.errors.location?.message}
        </FormHelperText>{' '}
      </Box>
    </>
  );
}
