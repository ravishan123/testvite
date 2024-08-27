import { useCallback, useEffect, useState } from 'react';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import debounce from 'lodash-es/debounce';

import { Box } from '../layout';
import { GoogleAddressParser, Address } from '../utils/googlePlacesAddressParser';
import { FormHelperText } from '../forms';
import { useTheme } from '../theme';

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY as string;

type AddressPickerProps = {
  value?: Address | null;
  isDisabled?: boolean;
  error?: string | null;
  onChange?: (value: Address | null) => void;
};

type AddressOption = {
  label: string;
  value: {
    place_id: string;
  };
};

const createAddressString = (address: Address) => {
  if (address && address.city && address.country) {
    const addressComponents = Object.values(address);
    return addressComponents.length ? addressComponents.filter((value) => value).join(', ') : '';
  }

  return '';
};

export default function AddressPicker({ value, onChange, isDisabled = false, error }: AddressPickerProps) {
  const { palette } = useTheme();
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const debouncedGetAddressComponent = useCallback(
    debounce((_value: AddressOption) => {
      if (_value?.value?.place_id) {
        setIsFetchingAddress(true);
        void geocodeByPlaceId(_value.value.place_id)
          .then((results) => {
            if (results[0]?.address_components) {
              const address = new GoogleAddressParser(results[0].address_components).parse();
              onChange && onChange(address);
            } else {
              onChange && onChange(null);
            }
          })
          .finally(() => {
            setIsFetchingAddress(false);
          });
      } else {
        onChange && onChange(null);
      }
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedGetAddressComponent.cancel();
    };
  }, []);

  return (
    <Box>
      <Box>
        <GooglePlacesAutocomplete
          apiKey={googleApiKey}
          autocompletionRequest={{
            types: ['establishment'],
          }}
          debounce={300}
          selectProps={{
            isDisabled,
            isLoading: isFetchingAddress,
            value: value ? { label: createAddressString(value), value: { place_id: null } } : undefined,
            onChange: (value: AddressOption | null, reason) => {
              if (reason?.action === 'clear') {
                onChange && onChange(null);
              } else if (value) {
                debouncedGetAddressComponent(value);
              }
            },
            placeholder: (
              <span style={{ color: palette.grey[200], fontSize: '12px' }}>or, enter your activity location</span>
            ),
            isSearchable: true,
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
      {error && (
        <Box>
          <FormHelperText error={!!error}>{error}</FormHelperText>
        </Box>
      )}
    </Box>
  );
}
