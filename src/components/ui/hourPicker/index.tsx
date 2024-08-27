import Counter from '../counter';
import { Grid } from '../layout';
import { FormLabel } from '../forms';
import { FormHelperText } from '../forms';

type HourPickerProps = {
  error?: string | null;
  label?: string;
  hours: number;
  minutes: number;
  minHours?: number;
  maxHours?: number;
  minMinutes?: number;
  maxMinutes?: number;
  hourSteps?: number;
  minuteSteps?: number;
  onChange?: (hours: number, minutes: number) => void;
  onBlur?: () => void;
};

export default function HourPicker({
  error,
  label,
  hours = 0,
  minutes = 0,
  minHours,
  maxHours,
  minMinutes,
  maxMinutes,
  hourSteps,
  minuteSteps,
  onChange,
  onBlur,
}: HourPickerProps) {
  const _onChange = (hours: number, minutes: number) => {
    onChange && onChange(hours, minutes);
  };

  return (
    <Grid container columnSpacing={2}>
      <Grid item xs={12}>
        <FormLabel component="label" required>
          {label}
        </FormLabel>
      </Grid>
      <Grid item xs sx={{ maxWidth: { sm: 124 } }}>
        <Counter
          value={hours}
          isError={Boolean(error)}
          steps={hourSteps}
          min={minHours}
          max={maxHours}
          onChange={(value) => {
            _onChange(value, minutes);
          }}
          onBlur={onBlur}
          isHourPicker
        />
      </Grid>
      <Grid item xs sx={{ maxWidth: { sm: 124 } }}>
        <Counter
          value={minutes}
          isError={Boolean(error)}
          steps={minuteSteps}
          min={minMinutes}
          max={maxMinutes}
          onChange={(value) => {
            _onChange(hours, value);
          }}
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs={12}>
        <FormHelperText error={Boolean(error)}>{error}</FormHelperText>
      </Grid>
    </Grid>
  );
}
