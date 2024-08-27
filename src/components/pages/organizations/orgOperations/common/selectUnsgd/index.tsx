import { Controller, useFormContext } from 'react-hook-form';

import SelectUnsdg from '@globals/unsdgDisplay/selectUnsdg';

import { IForm } from '../../orgCreation/orgCreation';

function OrgUnsdg() {
  const { control } = useFormContext<IForm>();

  return (
    <Controller
      name="unsdg"
      control={control}
      render={({ field: { value, ref, ...field } }) => (
        <>
          <SelectUnsdg selection={value} {...field} />
        </>
      )}
    />
  );
}

export default OrgUnsdg;
