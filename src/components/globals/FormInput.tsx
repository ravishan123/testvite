import { TextField, TextFieldProps, Box, useTheme, InputLabel } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type IFormInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  default?: string | number;
} & TextFieldProps;

const FormInput: React.FC<IFormInputProps> = ({ name, label, placeholder, onChange, ...props }) => {
  const { spacing, palette } = useTheme();

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box sx={{ width: '100%', marginBottom: spacing(1) }}>
      <Controller
        control={control}
        name={name}
        defaultValue={''}
        render={({ field: { onChange: formOnChange, ...field } }) => (
          <>
            <InputLabel component="label" sx={{ fontSize: '12px', color: palette.text.primary }}>
              {label}
            </InputLabel>
            <TextField
              {...field}
              {...props}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (onChange) {
                  onChange(e);
                }

                formOnChange(e);
              }}
              placeholder={placeholder}
              error={!!errors[name]}
              helperText={errors && errors?.[name] ? (errors?.[name]?.message as string) : null}
            />
          </>
        )}
      />
    </Box>
  );
};

export default FormInput;
