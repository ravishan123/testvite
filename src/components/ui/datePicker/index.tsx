import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { DateValidationError } from '@mui/x-date-pickers';
import { DatePicker as MaterialDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { FieldChangeHandlerContext } from '@mui/x-date-pickers/internals';

import { ExpandMoreIcon, Close } from '@ui/icons';

import { IconButton } from '../button';

type datePickerTypes = Omit<DatePickerProps<Date>, 'onChange'> & {
  onChange?: (value: Date | null, error: string | null) => void;
  onBlur?: () => void;
  disableFuture?: boolean;
};

export function DatePicker({ value, onChange: _onChange, onBlur, disableFuture = false, ...props }: datePickerTypes) {
  const [open, setOpen] = useState(false);

  const onChange = (date: Date | null, error: string | null) => {
    _onChange && _onChange(date, error);
  };

  return (
    <MaterialDatePicker
      value={value}
      open={open}
      disableFuture={disableFuture}
      onClose={() => setOpen(false)}
      sx={{ width: '100%' }}
      onAccept={(date) => {
        onChange(date, null);
        setOpen(false);
      }}
      onChange={(date, context: FieldChangeHandlerContext<DateValidationError>) => {
        onChange(date, context?.validationError);
      }}
      slotProps={{
        textField: {
          onBlur,
        },
      }}
      slots={{
        openPickerIcon: ExpandMoreIcon,
        inputAdornment: () => (
          <InputAdornment position="end" sx={{ width: 70, justifyContent: 'flex-end' }}>
            {value && (
              <IconButton
                size="small"
                onClick={() => {
                  onChange(null, null);
                }}
              >
                <Close sx={{ fontSize: 18 }} />
              </IconButton>
            )}
            <IconButton size="small" onClick={() => setOpen((prev) => !prev)}>
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}

export type { DatePickerProps };
