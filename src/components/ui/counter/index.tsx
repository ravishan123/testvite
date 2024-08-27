import { useState } from 'react';

import { ButtonGroup, IconButton } from '../button';
import { TextField } from '../textField';
import { ExpandMoreIcon, ExpandLessIcon } from '../icons';
import { styled } from '../theme';
import { FormHelperText } from '../forms';

type CounterProps = {
  value: number;
  steps?: number;
  min?: number;
  max?: number;
  isError?: boolean;
  errorMessage?: string;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  isHourPicker?: boolean;
};

const StyledButton = styled(IconButton)(() => ({
  padding: 0,
  fontSize: 18,

  '& .MuiSvgIcon-root': {
    fontSize: 'inherit',
  },
}));

export default function Counter({
  value = 0,
  steps = 1,
  min = undefined,
  max = undefined,
  isError,
  errorMessage,
  onChange,
  onBlur,
  isHourPicker,
}: CounterProps) {
  const [_error, setError] = useState<string | null>(errorMessage || null);

  const _onChange = (_value: number) => {
    if (!isHourPicker) {
      const isValueOutOfRange = (typeof min === 'number' && _value < min) || (typeof max === 'number' && _value > max);

      setError(
        isValueOutOfRange ? `Value must be between ${min?.toString() || ''} and ${max?.toString() || ''}` : null
      );
    } else {
      const isValueBelowMin = typeof min === 'number' && _value < min;

      setError(isValueBelowMin ? `Value must be between ${min?.toString() || ''}` : null);
    }

    onChange && onChange(_value);
  };

  return (
    <>
      <TextField
        isValidateInput
        pattern="^-?\d*$"
        value={value}
        onChange={(e) => {
          if (e.target.value) {
            _onChange(parseInt(e.target.value));
          } else {
            _onChange(0);
          }
        }}
        onBlur={onBlur}
        InputProps={{
          endAdornment: (
            <ButtonGroup orientation="vertical" variant="text">
              <StyledButton
                size="small"
                onClick={() => {
                  if (typeof max === 'number' && value + steps <= max) {
                    _onChange(value + steps);
                  } else if (typeof max !== 'number') {
                    _onChange(value + steps);
                  }
                }}
              >
                <ExpandLessIcon />
              </StyledButton>
              <StyledButton
                size="small"
                onClick={() => {
                  if (typeof min === 'number' && value - steps >= min) {
                    _onChange(value - steps);
                  } else if (typeof min !== 'number') {
                    _onChange(value - steps);
                  }
                }}
              >
                <ExpandMoreIcon />
              </StyledButton>
            </ButtonGroup>
          ),
        }}
        error={Boolean(_error) || isError}
      />
      <FormHelperText error={Boolean(_error)}>{_error}</FormHelperText>
    </>
  );
}
