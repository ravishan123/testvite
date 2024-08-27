import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@ui/theme';
import CountryPicker from '@ui/countryPicker';
import CityPicker from '@ui/cityPicker';
import { Grid } from '@ui/layout';

const StyledCountryPicker = styled(CountryPicker)({
  width: '100%',
});

type CountryCitySelectorProps = {
  name?: string;
  value: { country: string | null; city: string | null };
  onChange: (location: { country: string; city: string }) => void;
  onBlur?: () => void;
  disableLabel?: boolean;
};

const CountryCitySelector: React.FC<CountryCitySelectorProps> = ({ value, onChange, disableLabel }) => {
  const { spacing } = useTheme();
  const [countryAndCity, setCountryAndCity] = useState({
    country: value?.country || '',
    city: value?.city || '',
  });

  useEffect(() => {
    setCountryAndCity({ country: value?.country || '', city: value?.city || '' });
  }, [value?.country, value?.city]);

  const handleCountrySelect = (countryCode: string) => {
    if (onChange) {
      onChange({ country: countryCode, city: '' });
    }
  };

  const handleCitySelect = (cityName: string) => {
    if (onChange) {
      onChange({ country: countryAndCity.country, city: cityName });
    }
  };

  return (
    <Grid
      item
      mt={!disableLabel ? spacing(2) : spacing(0)}
      display="flex"
      justifyContent="space-between"
      flexDirection="row"
    >
      <StyledCountryPicker
        disableLabel={disableLabel}
        defaultValue={countryAndCity.country}
        onSelectCountry={handleCountrySelect}
      />
      <CityPicker
        disableLabel={disableLabel}
        defaultValue={countryAndCity.city}
        country={countryAndCity.country}
        onSelectCity={handleCitySelect}
      />
    </Grid>
  );
};

export default CountryCitySelector;
