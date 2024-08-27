import React, { useState } from 'react';

import countries from '@utils/data/countries.data';

import { useTheme } from '@ui/theme';
import InputLabel from '@ui/inputLabel';
import { Box } from '@ui/layout';
import Autocomplete from '@ui/autocomplete';
import { TextField } from '@ui/textField';

interface Country {
  name: string;
}

const CountryPicker: React.FC<{
  onSelectCountry: (countryCode: string) => void;
  defaultValue: string;
  disableLabel?: boolean;
}> = ({ onSelectCountry, defaultValue, disableLabel }) => {
  const { palette } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Box width="50%" mr="14px">
      {!disableLabel ? (
        <InputLabel component="label" sx={{ fontSize: '12px', color: palette.text.primary }}>
          Country
        </InputLabel>
      ) : (
        <InputLabel component="label" sx={{ fontSize: '12px' }} />
      )}

      <Autocomplete
        disablePortal
        id="country-select"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionLabel={(option: Country) => option.name}
        options={countries}
        value={countries.find((country) => country.code === defaultValue) || null}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select your country"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: <>{params.InputProps.endAdornment}</>,
            }}
          />
        )}
        onChange={(_, value) => {
          const countryCode = value?.code || '';

          onSelectCountry(countryCode);
        }}
      />
    </Box>
  );
};

export default CountryPicker;
