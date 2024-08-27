import { OrgTypeRadioGroup } from '@pages/organizations/orgOperations/common/orgType/radioInputGroup';

const options = [
  {
    label: 'Yes',
    value: 'yes',
  },
  {
    label: 'No',
    value: 'no',
  },
];

export function SocialEnterprise() {
  return (
    <OrgTypeRadioGroup
      row
      name="isSocialEnterprise"
      label="Are you a social enterprise? *"
      options={options}
      subtitle="A sustainable business with a core purpose to make a positive impact socially and environmentally."
      paddingTop="12px"
      paddingBottom="0px"
      optionSpace={9}
    />
  );
}
