import { NetworkStatus } from '@globals/networkStatus';
import { Option, OrgTypeRadioGroup } from './radioInputGroup';
import { useFetchOrgTypesQuery } from '@store/slices/settings/settings.slice';
import { IForm } from '../../orgCreation/orgCreation';

export function OrganizationType({ name, label, subtitle }: { name: keyof IForm; label: string; subtitle: string }) {
  const { data = [], isError, isLoading, error, isFetching } = useFetchOrgTypesQuery(undefined);

  const options: Option[] = data.map((orgType) => ({
    value: orgType.id,
    label: orgType.orgtype,
    description: orgType.description,
  }));

  return (
    <>
      {options && <OrgTypeRadioGroup label={label} subtitle={subtitle} name={name} options={options} />}

      {
        <NetworkStatus
          isError={isError}
          isLoading={isLoading}
          isFetching={isFetching}
          error={isError && 'error' in error ? error.error : 'Unknown error'}
        />
      }
    </>
  );
}
