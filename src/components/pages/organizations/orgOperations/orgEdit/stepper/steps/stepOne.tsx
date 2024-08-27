import { OrgName } from '../../orgName';
import { OrganizationType } from '@pages/organizations/orgOperations/common/orgType';
import { SocialEnterprise } from '@pages/organizations/orgOperations/common/socialEnterprise';

export function StepOne() {
  return (
    <>
      <OrgName name="organizationName" label="Organization name *" id="organizationName" />
      <OrganizationType name="organizationType" label="Type of organization *" subtitle="You can select only 1 type" />
      <div>
        <SocialEnterprise />
      </div>
    </>
  );
}
