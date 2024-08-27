import { ChangeEvent, useEffect, useState } from 'react';

import { Select, InputLabel, Grid, MenuItem, Box, useTheme, SelectChangeEvent } from '@mui/material';
import { TextField } from '@ui/textField';
import { FormHelperText } from '@ui/forms';
import { stripPhoneNo } from '@utils/functions/countryAndPhoneUtils';
import { phoneCodes } from '@utils/data/countries.data';

type CustomPhoneInputProps = {
  onChange?: (value: string | null | undefined) => void;
  name?: string;
  value?: string | null;
  error?: string;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  disableLabel?: boolean;
};

function CustomPhoneInput({ onChange, value, error, disableLabel }: CustomPhoneInputProps) {
  const { palette } = useTheme();
  const [countryCode, setCountryCode] = useState<string>(stripPhoneNo(value || '')?.code || '+94');
  const [phoneNumber, setPhoneNumber] = useState<string>(stripPhoneNo(value || '')?.number || '');
  const [_error, setError] = useState<string>('');

  const onChangeCountryCode = (e: SelectChangeEvent<string>) => {
    setCountryCode(e.target.value);

    if (onChange) {
      onChange(`${e.target.value}${phoneNumber}`);
    }
  };

  const onChangePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);

    if (onChange) {
      onChange(`${countryCode}${e.target.value}`);
    }
  };

  useEffect(() => {
    setError(error || '');
  }, [error]);

  useEffect(() => {
    setCountryCode(stripPhoneNo(value || '')?.code || '+94');
    setPhoneNumber(stripPhoneNo(value || '')?.number || '');
  }, [value]);

  return (
    <Box>
      {!disableLabel ? (
        <InputLabel component="label" sx={{ fontSize: '12px', color: palette.text.primary }}>
          Phone number
        </InputLabel>
      ) : null}

      <Grid display="flex" flexDirection="row" xs={6} md={6}>
        <Select
          sx={{
            width: 125,
            boxShadow: 'none',
            '.MuiOutlinedInput-notchedOutline': { borderRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 },
          }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={countryCode}
          onChange={onChangeCountryCode}
        >
          {phoneCodes.map((code, index) => (
            <MenuItem key={`phone-code-${code}-${index}`} value={code}>
              {code}
            </MenuItem>
          ))}
        </Select>
        <TextField
          placeholder="Your phone number"
          sx={{
            boxShadow: 'none',
            '.MuiOutlinedInput-notchedOutline': { borderLeft: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
          }}
          isValidateInput
          value={phoneNumber}
          onChange={onChangePhoneNumber}
        />
      </Grid>
      <FormHelperText error={Boolean(_error)}>{_error}</FormHelperText>
    </Box>
  );
}

export default CustomPhoneInput;
