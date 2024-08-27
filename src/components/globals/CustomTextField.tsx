import React, { useState, forwardRef } from 'react';
import { TextField, Box, useTheme, InputLabel, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface CustomTextFieldProps extends React.ComponentProps<typeof TextField> {
  label?: string;
  placeholder?: string;
  errorMessages?: string;
  endAdornmentComponent?: React.ReactNode;
  tooltipComponent?: React.ReactNode;
  my?: number;
}

/**
 * CustomTextField component
 * @param {CustomTextFieldProps} props
 */
const CustomTextField: React.FC<CustomTextFieldProps> = forwardRef(
  (
    { label, placeholder, errorMessages = '', endAdornmentComponent, tooltipComponent, type, my = 2, ...props },
    ref
  ) => {
    // Use the useTheme hook to access the current theme
    const { palette } = useTheme();
    const [showPassword, setShowPassword] = useState(type !== 'password');

    const handleClickShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    const renderEndAdornment = () => {
      if (type === 'password') {
        return (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        );
      }

      if (endAdornmentComponent) {
        return <InputAdornment position="end">{endAdornmentComponent}</InputAdornment>;
      }

      return null;
    };

    return (
      <Box my={my}>
        <InputLabel shrink sx={{ color: palette.text.primary }}>
          {label}
        </InputLabel>
        <TextField
          ref={ref}
          placeholder={placeholder}
          error={!!errorMessages}
          helperText={errorMessages}
          type={showPassword ? 'text' : 'password'}
          {...props}
          InputProps={{
            endAdornment: renderEndAdornment(),
          }}
        />
        {tooltipComponent}
      </Box>
    );
  }
);

export default CustomTextField;
