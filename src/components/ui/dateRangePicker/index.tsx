import isBefore from 'date-fns/isBefore';
import endOfYesterday from 'date-fns/endOfYesterday';

import { Grid } from '../layout';
import { FormHelperText, FormLabel } from '../forms';
import { DatePicker } from '../datePicker';

type DateRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  onChange?: (startDate: Date | null, endDate: Date | null, error: string | null) => void;
  onBlur?: () => void;
  onError?: (error: string | null) => void;
  error?: string | undefined | null;
  disableFuture?: boolean;
};

export default function DateRangePicker({
  startDate,
  endDate,
  onChange: _onChange,
  error: _error,
  disableFuture = false,
  onBlur,
}: DateRangePickerProps) {
  const onChange = (startDate: Date | null, endDate: Date | null, error: string | null) => {
    const errors = [];

    if (startDate && endDate && isBefore(endDate, startDate)) {
      errors.push('Start date cannot be after end date!');
    }

    if (error) {
      errors.push(error);
    }

    if (!errors.length && _error) {
      errors.push(_error);
    }

    _onChange && _onChange(startDate, endDate, errors.length ? errors.join(', ') : null);
  };

  return (
    <Grid container columnSpacing={2} rowGap={{ xs: 1, sm: 0 }}>
      <Grid item xs minWidth={210}>
        <div>
          <FormLabel component="label" required>
            Start Date
          </FormLabel>
        </div>
        <DatePicker
          value={startDate}
          onChange={(_startDate, error) => {
            onChange(_startDate, endDate, error);
          }}
          format="dd/MM/yyyy"
          {...(endDate &&
            disableFuture && { maxDate: isBefore(endDate, endOfYesterday()) ? endDate : endOfYesterday() })}
          {...(!endDate && disableFuture && { maxDate: endOfYesterday() })}
          {...(endDate && !disableFuture && { maxDate: endDate })}
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs minWidth={210}>
        <div>
          <FormLabel component="label" required>
            End Date
          </FormLabel>
        </div>
        <DatePicker
          value={endDate}
          disableFuture={disableFuture}
          onChange={(_endDate, error) => {
            onChange(startDate, _endDate, error);
          }}
          format="dd/MM/yyyy"
          {...(startDate && { minDate: startDate })}
          {...(disableFuture && { maxDate: endOfYesterday() })}
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs={12}>
        <FormHelperText error={Boolean(_error)}>{_error}</FormHelperText>
      </Grid>
    </Grid>
  );
}
