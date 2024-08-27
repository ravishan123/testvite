import React, { useEffect } from 'react';
import { FormControlLabel, Checkbox, Grid, FormGroup, Typography, TextField, Box } from '@mui/material';

import { Gender } from '@constants/app';
import { GenderType } from '@utils/types';

interface CustomGenderInputProps {
  value: GenderType | null | undefined;
  error?: string;
  onChange: (field: string) => void;
  onBlur: () => void;
}

const isOtherGenderType = (value: string) => ![Gender.FEMALE, Gender.MALE].includes(value);

const CustomGenderInput: React.FC<CustomGenderInputProps> = ({ value, error, onChange, onBlur }) => {
  const [gender, setGender] = React.useState<GenderType | null | undefined>(value);

  useEffect(() => {
    setGender(value);
  }, [value]);

  const handleChange = (field: string, _value?: string | boolean | undefined) => {
    if (onChange) {
      onChange(!isOtherGenderType(field) ? (field === value ? '' : field) : (_value as string));
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Typography pt="4px">I am a</Typography>
      </Grid>
      <Grid item>
        <FormGroup row>
          <FormControlLabel
            sx={{ ml: 0 }}
            control={
              <Checkbox
                color="primary"
                onChange={(e) => handleChange(Gender.FEMALE, e.target.value)}
                checked={gender?.toUpperCase() === Gender.FEMALE}
                inputProps={{ 'aria-label': 'controlled' }}
                onBlur={onBlur}
              />
            }
            label="girl/woman"
          />

          <FormControlLabel
            sx={{ ml: 0 }}
            control={
              <Checkbox
                color="primary"
                onChange={(e) => handleChange(Gender.MALE, e.target.value)}
                checked={gender?.toUpperCase() === Gender.MALE}
                inputProps={{ 'aria-label': 'controlled' }}
                onBlur={onBlur}
              />
            }
            label="boy/man"
          />

          <Box width="100%" mt="10px">
            <TextField
              placeholder="Let me type..."
              value={isOtherGenderType(gender || '') ? gender : ''}
              error={!!error}
              onChange={(e) => handleChange(Gender.OTHER, e.target.value)}
              onBlur={onBlur}
              helperText={error}
            />
          </Box>
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default CustomGenderInput;
