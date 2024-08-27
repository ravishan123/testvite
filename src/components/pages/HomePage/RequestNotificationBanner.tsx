import { useNavigate } from 'react-router-dom';

import { getRoute } from '@utils/configs/routesConfig';
import { useGetOrganizationsQuery, useFetchPendingRequestV2Query } from '@store/slices/organization/organization.slice';
import NotificationBanner from '@globals/notificationBanner';
import { NetworkStatus } from '@globals/networkStatus';
import { useEffect } from 'react';
import { Grid } from '@ui/layout';

const bannerTitle = (noOfRequests: number, orgName: string, isAdminUser: boolean) =>
  isAdminUser
    ? `You have ${noOfRequests} ${noOfRequests === 1 ? 'request' : 'requests'} to verify volunteer hours for ${orgName}`
    : `You have ${noOfRequests} ${noOfRequests === 1 ? 'request' : 'requests'} to verify volunteer hours`;
const orgInviteText =
  'You have received a request to verify hours. Please create a profile for your organization first; then you can verify, amend, or decline volunteer hour requests.';
const orgBtnLabel = 'Create organization profile';
const inviteBtnLabel = (noOfRequests: number) => (noOfRequests === 1 ? 'View request' : 'View requests');
const viewOrganizations = 'View organizations';

export default function RequestNotificationBanner() {
  const navigate = useNavigate();
  const { isLoading: orgLoading } = useGetOrganizationsQuery();
  const {
    data: pendingRequestDataV2,
    isLoading: pendingRequestDataV2Loading,
    refetch,
  } = useFetchPendingRequestV2Query();

  const data: {
    pending_count: number;
    org_id: string | null;
    org_name: string | null;
    isAdminUser: boolean;
  }[] = pendingRequestDataV2?.data?.filter((e) => e.org_id || !e.isAdminUser) ?? [];
  const showNotificationBanner = data.length > 0;

  const navigateCreateOrg = () => navigate(getRoute('private.app.organizations.create'));
  const navigateViewRequest = (orgId: string) =>
    navigate(getRoute('private.app.organizations.profile.verifyHours', { id: orgId }));
  const navigationMyOrgs = () => navigate(getRoute('private.app.organizations'));

  useEffect(() => {
    void refetch();
  }, []);

  return orgLoading || pendingRequestDataV2Loading ? (
    <NetworkStatus
      isLoading={orgLoading || pendingRequestDataV2Loading}
      loadingText="Loading pending volunteer hour requests..."
    />
  ) : showNotificationBanner && data.length ? (
    <>
      <Grid container spacing={1 / 4} marginTop={0.7}>
        {data.map((item, index) => (
          <Grid item xs={12} key={index} sx={{ mb: 1 }}>
            <NotificationBanner
              message={item.isAdminUser ? '' : orgInviteText}
              title={bannerTitle(Number(item.pending_count), item.org_name ?? '', item.isAdminUser)}
              buttonLabel={
                item.isAdminUser && item?.org_id
                  ? inviteBtnLabel(Number(item.pending_count))
                  : item.isAdminUser && !item?.org_id
                  ? viewOrganizations
                  : orgBtnLabel
              }
              onClick={() => {
                if (item.isAdminUser) {
                  if (item?.org_id) {
                    navigateViewRequest(item.org_id);
                  } else if (!item?.org_id) {
                    navigationMyOrgs();
                  }
                } else {
                  navigateCreateOrg();
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  ) : null;
}
