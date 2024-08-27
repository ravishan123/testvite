import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Box } from '@ui/layout';
import InputLabel from '@ui/inputLabel';
import { useTheme } from '@ui/theme';

interface CityOption {
  label: string;
  value: string;
}

const CityPicker: React.FC<{
  country: string;
  onSelectCity: (cityName: string) => void;
  defaultValue: string;
  disableLabel?: boolean;
}> = ({ country, onSelectCity, defaultValue, disableLabel }) => {
  const { palette, fontSize, spacing } = useTheme();
  const [value, setValue] = useState<CityOption | null>(
    defaultValue ? { label: defaultValue, value: defaultValue } : null
  );
  const [selectedCountry, setSelectedCountry] = useState(country);

  const handleCityChange = (selectedOption: CityOption | null) => {
    const city = selectedOption?.label || '';
    setValue(selectedOption);
    onSelectCity(city.split(',')[0]);
  };
  const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY as string;

  useEffect(() => {
    if (country !== selectedCountry) {
      setSelectedCountry(country);
      setValue(null);
    }
  }, [country]);

  useEffect(() => {
    if (defaultValue && defaultValue !== value?.label) {
      setValue({ label: defaultValue, value: defaultValue });
    }
  }, [defaultValue]);

  return (
    <Box width="50%" mr="auto">
      {!disableLabel ? (
        <InputLabel
          component="label"
          sx={{ fontSize: fontSize.xs, color: palette.text.primary, marginBottom: spacing(1) }}
        >
          City
        </InputLabel>
      ) : (
        <InputLabel component="label" sx={{ fontSize: fontSize.sm, marginBottom: spacing(1) }} />
      )}

      <GooglePlacesAutocomplete
        apiKey={googleApiKey}
        autocompletionRequest={{
          types: ['(cities)'],
          componentRestrictions: {
            country: selectedCountry?.toLowerCase(),
          },
        }}
        selectProps={{
          value,
          onChange: handleCityChange,
          isDisabled: country === '',
          placeholder: <span style={{ color: palette.grey[200], fontSize: '12px' }}>City/town</span>,
          getOptionLabel: (option: CityOption) => option.label.split(',')[0],
          styles: {
            input: (provided) => ({
              ...provided,
              height: '35px',
            }),
          },
          theme: (theme) => ({
            ...theme,
            borderRadius: 8,
            colors: {
              ...theme.colors,
              primary: palette.primary.main,
              secondary: palette.secondary.main,
            },
          }),
          components: {
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          },
          isClearable: true,
          backspaceRemovesValue: true,
        }}
      />
    </Box>
  );
};

export default CityPicker;
