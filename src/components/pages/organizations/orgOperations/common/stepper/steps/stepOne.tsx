import { OrgName } from '../../orgName';
import { OrganizationType } from '../../orgType';
import { SocialEnterprise } from '../../socialEnterprise';

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
