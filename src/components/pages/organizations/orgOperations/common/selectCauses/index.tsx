import { Controller, useFormContext } from 'react-hook-form';

import { Grid } from '@ui/layout';

import { SelectCauses } from '@globals/causesDisplay/selectCauses';

import { IForm } from '../../orgCreation/orgCreation';

export default function OrgCauses() {
  const { control } = useFormContext<IForm>();

  return (
    <Grid mt={3} mb={3}>
      <Controller
        name="causes"
        control={control}
        render={({ field: { value, ref, ...field }, fieldState: { error } }) => (
          <SelectCauses selection={value} error={error?.message} {...field} />
        )}
      />
    </Grid>
  );
}
