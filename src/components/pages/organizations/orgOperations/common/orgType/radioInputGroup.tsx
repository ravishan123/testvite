import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import FormInput from '@globals/FormInput';
import { IForm } from '@pages/organizations/orgOperations/orgCreation/orgCreation';
import { Typography } from '@ui/typography';
import { Box } from '@ui/layout';
import { useTheme } from '@ui/theme';
import { useEffect } from 'react';

export type Option = {
  value: string;
  label: string;
  description?: string;
};

export type RadioGroupProps = {
  name: keyof IForm;
  label?: string;
  subtitle?: string;
  options: Option[];
  checkedIcon?: JSX.Element;
  icon?: JSX.Element;
  row?: boolean;
  paddingTop?: string;
  paddingBottom?: string;
  optionSpace?: number;
};

export function OrgTypeRadioGroup({
  name,
  label,
  options,
  checkedIcon,
  icon,
  subtitle,
  row,
  paddingTop = '36px',
  paddingBottom = '16px',
  optionSpace = 0,
  ...props
}: RadioGroupProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<IForm>();

  const isOther = options.some((option) => option.label === 'Other');

  const value = useWatch<{
    organizationType: string;
  }>({ name: 'organizationType' });

  useEffect(() => {
    if (value !== '0') {
      setValue(`organizationTypeOther`, '');
    }
  }, [value]);

  const { spacing } = useTheme();

  return (
    <>
      <Controller
        control={control}
        defaultValue={''}
        name={name}
        render={({ field }) => (
          <FormControl component="fieldset" error={false}>
            <Box pb={paddingBottom} pt={paddingTop}>
              <Typography component="span" variant="h5">
                {label}
              </Typography>
              <Typography variant="body1" color="text.secondary" pt="4px">
                {subtitle}
              </Typography>
            </Box>

            <RadioGroup row={row} aria-label={label} {...field} {...props}>
              {options &&
                options.map((option) => (
                  <FormControlLabel
                    sx={{ marginTop: '10px', '& .MuiFormControlLabel-label': { pl: 0, pr: optionSpace } }}
                    key={option.value}
                    value={option.value}
                    control={<Radio id={option.value} checkedIcon={checkedIcon} icon={icon} />}
                    htmlFor={option.value}
                    label={
                      <>
                        <Typography variant="body1">{option.label}</Typography>
                        {option.description && (
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'text.secondary',
                              paddingTop: '5px',
                            }}
                          >
                            {option.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                ))}
            </RadioGroup>

            {typeof errors[name]?.message === 'string' ? (
              <FormHelperText>
                <Typography component="span" color="error">
                  {errors[name]?.message}
                </Typography>
              </FormHelperText>
            ) : null}
          </FormControl>
        )}
      />

      {isOther && value === '0' && name === 'organizationType' && (
        <FormInput
          name={`${name}Other`}
          sx={{ marginLeft: spacing(5), top: '-8px' }}
          label=""
          placeholder="Please specify"
        />
      )}
    </>
  );
}
