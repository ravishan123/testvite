import React, { ClipboardEvent, KeyboardEvent, useEffect, useState } from 'react';
import { TextField, InputLabel, useTheme, Box, FormControl, FormHelperText, styled } from '@mui/material';
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import isValid from 'date-fns/isValid';

interface DateInputProps {
  value: Date;
  error?: string;
  onChange?: (value: Date | null) => void;
  onBlur?: () => void;
}

type DateFieldName = 'day' | 'month' | 'year';

type DateType = {
  day?: number | null | undefined;
  month?: number | null | undefined;
  year?: number | null | undefined;
};

const DateField: Record<string, DateFieldName> = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
};

const CustomDateInputFields = styled(TextField)({
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none',
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
});

const stripDate = (date: Date): DateType | null => {
  if (!isValid(date)) return { day: null, month: null, year: null };

  const day = getDate(date);
  const month = getMonth(date) + 1;
  const year = getYear(date);
  return { day, month, year };
};

const DateOfBirthInput: React.FC<DateInputProps> = ({ value, error, onChange, onBlur }) => {
  const { palette } = useTheme();
  const [fieldError, setFieldError] = useState<string | undefined>(error);
  const [date, setDate] = useState<DateType | null>(stripDate(value));

  const handleOnChange = (field: DateFieldName, value: string) => {
    const currentDate: DateType = { ...date, [field]: parseInt(value, 10) };
    let newDate: Date | null = null;

    if (currentDate.day && currentDate.month && currentDate.year) {
      newDate = new Date(currentDate.year, currentDate.month - 1, currentDate.day || 0, 0, 0, 0, 0);

      // Adjust the date to UTC midnight
      newDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()));

      const currentDateInAllowedRange = new Date(1900, 0, 1); // Jan 1, 1900
      const currentDateInUTC = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()));

      if (
        isValid(newDate) &&
        newDate >= currentDateInAllowedRange &&
        currentDateInUTC.getDate() === currentDate.day &&
        currentDateInUTC.getMonth() === currentDate.month - 1
      ) {
        if (currentDate.year && parseInt(currentDate.year.toString(), 10) >= 1900) {
          setFieldError(undefined);

          if (onChange) {
            onChange(newDate);
          }
        } else {
          setFieldError('Please add a valid date of birth');

          if (onChange) {
            onChange(null);
          }
        }
      } else {
        setFieldError('Please add a valid date of birth');

        if (onChange) {
          onChange(null);
        }
      }
    }
    setDate(currentDate);
  };

  /**
   * Validates the input for the custom date of birth input field.
   * @param event - The keyboard or clipboard event that triggered the validation.
   * @param field - The field of the date (day, month, or year) being validated.
   * @param value - The value of the input field being validated.
   * @returns A boolean indicating whether the input is valid or not.
   */
  const handleValidateInput = (
    event: KeyboardEvent<HTMLInputElement> | ClipboardEvent<HTMLInputElement>,
    field: DateFieldName,
    value: string | undefined
  ) => {
    const target = event.target as HTMLInputElement;

    if (field === DateField.DAY && parseInt(value as string, 10) > 31) {
      target.value = date?.day?.toString() || '';
      event.preventDefault();
      return false;
    } else if (field === DateField.MONTH && parseInt(value as string, 10) > 12) {
      target.value = date?.month?.toString() || '';
      event.preventDefault();
      return false;
    } else if (
      field === DateField.YEAR &&
      ((value as string)?.length > 4 || parseInt(value as string, 10) > new Date().getFullYear())
    ) {
      target.value = date?.year?.toString() || '';
      event.preventDefault();
      return false;
    }

    if (value === '') {
      target.value = '';
    }

    return true;
  };

  /**
   * Validates the input of a keyboard event for a date of birth input field.
   * @param event - The keyboard event to validate.
   * @returns True if the input is valid, false otherwise.
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    const keyCode = event.keyCode;
    const isNumber = /^\d*$/.test(key);
    const isAllowedKey = [8, 9, 46, 86, 65].includes(keyCode) || (keyCode >= 33 && keyCode <= 40);

    if (isNumber || isAllowedKey) {
      return true;
    }

    event.preventDefault();
    return false;
  };

  useEffect(() => {
    if (!date?.day && !date?.month && !date?.year) {
      setDate(stripDate(value));
    }
  }, [date?.day, date?.month, date?.year, value]);

  return (
    <Box sx={{ width: '100%' }}>
      <InputLabel component="label" sx={{ fontSize: '12px', color: palette.text.primary }}>
        Date of birth *
      </InputLabel>

      <FormControl>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Box sx={{ width: '15%', marginRight: 2 }}>
            <CustomDateInputFields
              variant="outlined"
              type="number"
              placeholder="DD"
              onChange={(e) => handleOnChange(DateField.DAY, e.target.value)}
              error={!!fieldError || !!error}
              value={date?.day || ''}
              onBlur={onBlur}
              inputProps={{
                inputMode: 'numeric',
                maxLength: 2,
                style: { textAlign: 'center' },
              }}
              onKeyDown={handleKeyDown}
              onInput={(e: KeyboardEvent<HTMLInputElement>) =>
                handleValidateInput(e, DateField.DAY, (e.target as HTMLInputElement)?.value)
              }
              onPaste={(e: ClipboardEvent<HTMLInputElement>) =>
                handleValidateInput(e, DateField.DAY, (e.target as HTMLInputElement)?.value)
              }
            />
          </Box>

          <Box sx={{ width: '15%', marginRight: 2 }}>
            <CustomDateInputFields
              variant="outlined"
              type="number"
              placeholder="MM"
              onChange={(e) => handleOnChange(DateField.MONTH, e.target.value)}
              error={!!fieldError || !!error}
              value={date?.month || ''}
              onBlur={onBlur}
              inputProps={{
                inputMode: 'numeric',
                style: { textAlign: 'center' },
              }}
              onKeyDown={handleKeyDown}
              onInput={(e: KeyboardEvent<HTMLInputElement>) =>
                handleValidateInput(e, DateField.MONTH, (e.target as HTMLInputElement)?.value)
              }
              onPaste={(e: ClipboardEvent<HTMLInputElement>) =>
                handleValidateInput(e, DateField.MONTH, (e.target as HTMLInputElement)?.value)
              }
            />
          </Box>
          <Box sx={{ width: '40%' }}>
            <CustomDateInputFields
              variant="outlined"
              type="number"
              placeholder="YYYY"
              onChange={(e) => handleOnChange(DateField.YEAR, e.target.value)}
              error={!!fieldError || !!error}
              value={date?.year || ''}
              onBlur={onBlur}
              inputProps={{
                inputMode: 'numeric',
              }}
              onKeyDown={handleKeyDown}
              onInput={(e: KeyboardEvent<HTMLInputElement>) =>
                handleValidateInput(e, DateField.YEAR, (e.target as HTMLInputElement)?.value)
              }
              onPaste={(e: ClipboardEvent<HTMLInputElement>) =>
                handleValidateInput(e, DateField.YEAR, (e.target as HTMLInputElement)?.value)
              }
            />
          </Box>
        </Box>
        <FormHelperText error={Boolean(fieldError || error)}>{fieldError || error}</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default DateOfBirthInput;
