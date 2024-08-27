import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { AddHoursForm } from '@utils/types/volunteer.type';

import AddressPicker from '@ui/addressPicker';
import { Checkbox } from '@ui/checkbox';
import DateRangePicker from '@ui/dateRangePicker';
import { FormControlLabel, FormLabel } from '@ui/forms';
import HourPicker from '@ui/hourPicker';
import { Grid } from '@ui/layout';
import { TextField } from '@ui/textField';

import { SelectCauses } from '@globals/causesDisplay/selectCauses';
import OrgAutoComplete, { OTHER_ORG_TYPE } from '@globals/orgAutoComplete';
import SkillsAutoComplete from '@globals/skillsAutoComplete';
import SelectUnsdg from '@globals/unsdgDisplay/selectUnsdg';
import { Typography } from '@ui/typography';
import { useTheme } from '@ui/theme';

type VolunteerHoursFormBodyProps = {
  isAmend?: boolean;
};

export default function VolunteerHoursFormBody({ isAmend }: VolunteerHoursFormBodyProps) {
  const CHARACTER_LIMIT = 2000;
  const { control, watch, setValue } = useFormContext<AddHoursForm>();
  const { palette } = useTheme();
  return (
    <>
      <Grid item xs={12}>
        <Controller
          control={control}
          name="date"
          render={({
            field: {
              onChange,
              onBlur,
              value: { startDate, endDate },
            },
            fieldState: { error },
          }) => (
            <DateRangePicker
              error={
                error
                  ? (error as unknown as { startDate: FieldError }).startDate?.message ||
                    (error as unknown as { endDate: FieldError }).endDate?.message ||
                    error?.message
                  : null
              }
              disableFuture
              startDate={startDate}
              endDate={endDate}
              onChange={(_startDate, _endDate) => {
                onChange({ startDate: _startDate, endDate: _endDate });
              }}
              onBlur={onBlur}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="duration"
          render={({
            field: {
              onChange,
              onBlur,
              value: { hours, minutes },
            },
            fieldState: { error },
          }) => (
            <HourPicker
              error={
                error
                  ? (error as unknown as { hour: FieldError }).hour?.message ||
                    (error as unknown as { minutes: FieldError }).minutes?.message ||
                    // (error as unknown as { hours: FieldError }).hours?.message ||
                    // (error as unknown as { minutes: FieldError }).minutes?.message ||
                    error?.message
                  : null
              }
              hours={hours}
              minutes={minutes}
              onChange={(_hours, _minutes) => {
                onChange({ hours: _hours, minutes: _minutes });
              }}
              minHours={0}
              maxHours={99}
              minMinutes={0}
              maxMinutes={55}
              minuteSteps={5}
              label="Number of volunteer hours"
              onBlur={onBlur}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="activityDescription"
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <Grid container columnSpacing={2}>
              <Grid item xs={12}>
                <FormLabel component="label" required>
                  Volunteer activity description
                </FormLabel>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={value}
                  onChange={onChange}
                  placeholder="Add description"
                  onBlur={onBlur}
                  error={Boolean(error)}
                  helperText={error?.message}
                  multiline
                  minRows={5}
                  fullWidth
                  inputProps={{
                    maxLength: CHARACTER_LIMIT,
                  }}
                  InputProps={{
                    endAdornment: (
                      <div style={{ position: 'absolute', right: '12px', bottom: '8px', marginBottom: 6 }}>
                        <Typography sx={{ color: palette.grey[200] }}>
                          {value?.length}/{CHARACTER_LIMIT}
                        </Typography>
                      </div>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Grid container alignItems="center">
          <Grid item xs={12} mb={2}>
            <FormLabel component="label" required>
              Activity location
            </FormLabel>
          </Grid>
          <Grid item xs sx={{ maxWidth: { xs: 122 } }} mr={2}>
            <Controller
              name="isRemote"
              control={control}
              render={({ field: { value, ...field } }) => (
                <FormControlLabel sx={{ m: 0 }} control={<Checkbox checked={value} {...field} />} label="Remote" />
              )}
            />
          </Grid>
          <Grid item xs>
            <Controller
              name="activityLocation"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => (
                <AddressPicker isDisabled={watch('isRemote')} {...field} error={error?.message} />
              )}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="skills"
          control={control}
          render={({ field: { ref, value, ...field }, fieldState: { error } }) => {
            return (
              <SkillsAutoComplete
                skills={value}
                maxItems={10}
                textLimit={300}
                error={error as unknown as Error}
                {...field}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="causes"
          control={control}
          render={({ field: { value, ref, ...field }, fieldState: { error } }) => (
            <SelectCauses
              title="Causes *"
              description="Select relevant causes for your activity"
              selection={value}
              error={error?.message}
              {...field}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="unsdgs"
          control={control}
          render={({ field: { value, ref, ...field }, fieldState: { error } }) => (
            <>
              <SelectUnsdg
                selection={value}
                {...field}
                hasMax={true}
                limit={5}
                subTitle="Select up to five goals relevant to your activity"
              />

              {error && (
                <Typography
                  variant="body1"
                  mt={1}
                  sx={{
                    color: palette.error.main,
                  }}
                >
                  {error.message}
                </Typography>
              )}
            </>
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="organization"
          control={control}
          render={({ field: { ref, onChange, ...field }, fieldState: { error } }) => (
            <OrgAutoComplete
              onChange={(value) => {
                onChange(value);
                setValue('coordinator.name', '');
                setValue('coordinator.email', '');
              }}
              {...field}
              disabled={isAmend}
              error={(error as unknown as { name: Error })?.name || error}
            />
          )}
        />
      </Grid>

      {!isAmend && (
        <>
          {watch('organization')?.value === OTHER_ORG_TYPE && (
            <Grid item xs={12}>
              <Controller
                name="coordinator.email"
                control={control}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Grid container columnSpacing={2}>
                    <Grid item xs={12}>
                      <FormLabel component="label" required>
                        Email address of the organization or coordinator/supervisor
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        value={value}
                        placeholder="Email address of coordinator/supervisor"
                        onChange={onChange}
                        onBlur={onBlur}
                        error={Boolean(error)}
                        helperText={error?.message}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                )}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Controller
              name="coordinator.name"
              control={control}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Grid container columnSpacing={2}>
                  <Grid item xs={12}>
                    <FormLabel component="label" required>
                      Name of the person who can verify the above details
                    </FormLabel>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={value}
                      placeholder="Enter name of volunteer coordinator/supervisor"
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(error)}
                      helperText={error?.message}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              )}
            />
          </Grid>
        </>
      )}
    </>
  );
}
