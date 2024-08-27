import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { formatDate } from '@utils/functions/formatDate';
import { ActivityApprovalStatusEnum, ActivityStatusEnum } from '@utils/enums/activity.enum';
import { getRoute } from '@utils/configs/routesConfig';
import { useFetchVolunteerActivityQuery, useVerifyHourRequestMutation } from '@store/slices/volunteer/volunteer.slice';

import { Box, Grid } from '@ui/layout';
import {
  AccessTimeOutlinedIcon,
  ConstructionOutlinedIcon,
  DataUsageOutlinedIcon,
  DateRangeOutlinedIcon,
  DescriptionOutlinedIcon,
  HandshakeOutlinedIcon,
  LocationOnOutlinedIcon,
} from '@ui/icons';
import { Alert } from '@ui/alert';
import { Button } from '@ui/button';
import { useSnackbar } from '@ui/snackBar';

import ContentContainer from '@globals/contentContainer';
import ListUnsdg from '@globals/unsdgDisplay/listUnsdg';
import ListCauses from '@globals/causesDisplay/listCauses';
import { useCustomContext } from '@globals/context';
import { CustomPortalContext } from '@globals/customPortal';

import { AppContainerContext } from '@layouts/containers/appContainer';

import VolunteerAvatar from '@globals/volunteerAvatar';
import OrganizationAvatar from '@globals/organizationAvatar';
import FormDataDisplayItem from './formDataDisplayItem';
import HourVerificationConfirmationModal from './hourVerificationConfirmationModal';
import HourDeclineModal from './hourDeclineModal';

export default function HourDetailView() {
  const { hourId } = useParams();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [loadingAction, setLoadingAction] = useState<ActivityApprovalStatusEnum | false>(false);
  const [isShowDeclineModal, setIsShowDeclineModal] = useState(false);
  const { prevLocation, portal, destroyPortal } = useCustomContext<CustomPortalContext & AppContainerContext>();
  const {
    data: hourDetails,
    isFetching,
    isError,
    error,
  } = useFetchVolunteerActivityQuery(hourId || '', { skip: !hourId });
  const [
    verifyHours,
    { isLoading, isError: isErrorVerifyHours, error: verifyHourError, isSuccess: isSuccessVerifyHours },
  ] = useVerifyHourRequestMutation();

  const {
    userDetails,
    organization,
    coordinatorDetails,
    orgId,
    startDate,
    endDate,
    volunteerHour,
    isRemote,
    activityLocation,
    activityDescription,
    skills = { customSkills: [], defaultSkills: [] },
    unsdgs = [],
    causes = [],
    status,
  } = hourDetails || {};

  const customSkills = (skills.customSkills?.map((skill) => skill?.['skill']) || []).filter(Boolean);
  const defaultSkills = (skills.defaultSkills?.map((skill) => skill.name) || []).filter(Boolean);
  const _skills = [...customSkills, ...defaultSkills];

  const _unsdg = unsdgs?.map((item) => item.id) || [];
  const _causes = causes?.map((item) => item.id) || [];

  const handleOnApprove = () => {
    if (hourId && orgId) {
      setLoadingAction(ActivityApprovalStatusEnum.Approved);
      void verifyHours({
        requestId: hourId,
        orgId,
        approvalState: ActivityApprovalStatusEnum.Approved,
      });
    }
  };

  const handleOnDecline = (declinedReason: string) => {
    if (hourId && orgId) {
      setLoadingAction(ActivityApprovalStatusEnum.Declined);
      void verifyHours({
        requestId: hourId,
        orgId,
        approvalState: ActivityApprovalStatusEnum.Declined,
        processDetails: {
          declinedReason,
        },
      });
    }
  };

  useEffect(() => {
    if (isSuccessVerifyHours && !isErrorVerifyHours) {
      if (loadingAction === ActivityApprovalStatusEnum.Approved) {
        portal &&
          portal(
            <HourVerificationConfirmationModal
              userId={userDetails?.id || ''}
              firstName={userDetails?.firstName || ''}
              lastName={userDetails?.lastName || ''}
              receivedHours={volunteerHour}
              onClick={destroyPortal}
            />
          );
      }

      setLoadingAction(false);

      if (prevLocation !== window.location.pathname) {
        setTimeout(() => {
          navigate(prevLocation);
        }, 100);
      }
    }
  }, [
    isSuccessVerifyHours,
    isErrorVerifyHours,
    userDetails?.id,
    userDetails?.firstName,
    userDetails?.lastName,
    volunteerHour?.hours,
    volunteerHour?.minutes,
    prevLocation,
  ]);

  useEffect(() => {
    if (isErrorVerifyHours && verifyHourError) {
      setLoadingAction(false);
      openSnackbar((verifyHourError as Error)?.message, 'error');
    }
  }, [isErrorVerifyHours, verifyHourError]);

  if (!isFetching && (isError || !hourDetails)) {
    return <Alert severity="error">{(error as Error)?.message}</Alert>;
  }

  return (
    <ContentContainer size={[4, 4, 5, 4]}>
      <Grid container rowSpacing={4}>
        <Grid item xs={12} sm={6} justifyContent="flex-start" alignItems="center" display="flex">
          <Box>
            <VolunteerAvatar
              isLoading={isFetching}
              id={userDetails?.id || ''}
              firstName={userDetails?.firstName || ''}
              lastName={userDetails?.lastName || ''}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} justifyContent="flex-end" alignItems="center" display="flex">
          <Box>
            <OrganizationAvatar
              isLoading={isFetching}
              id={orgId || ''}
              logo={organization?.logo || ''}
              orgName={organization?.name || ''}
              coordinatorName={coordinatorDetails?.ownerName || ''}
            />
          </Box>
        </Grid>

        <Grid item xs={12} display="flex" columnGap={2}>
          <FormDataDisplayItem isLoading={isFetching} Icon={DateRangeOutlinedIcon} label="Start date">
            {startDate && formatDate(startDate)}
          </FormDataDisplayItem>
          <FormDataDisplayItem isLoading={isFetching} label="End date">
            {endDate && formatDate(endDate)}
          </FormDataDisplayItem>
        </Grid>

        <Grid item xs={12}>
          <FormDataDisplayItem isLoading={isFetching} Icon={AccessTimeOutlinedIcon} label="Hours given">
            {`${volunteerHour?.hours || 0}h ${volunteerHour?.minutes || 0}m`}
          </FormDataDisplayItem>
        </Grid>

        <Grid item xs={12}>
          <FormDataDisplayItem isLoading={isFetching} Icon={LocationOnOutlinedIcon} label="Activity location">
            {isRemote ? 'Remote' : activityLocation ? `${activityLocation?.city}, ${activityLocation?.country}` : ''}
          </FormDataDisplayItem>
        </Grid>

        <Grid item xs={12} sm={10}>
          <FormDataDisplayItem
            isLoading={isFetching}
            gap={1}
            Icon={DescriptionOutlinedIcon}
            label="Volunteer activity description"
          >
            {activityDescription?.replace(/^"/, '').replace(/"$/, '')}
          </FormDataDisplayItem>
        </Grid>

        {_skills.length || isFetching ? (
          <Grid item xs={12} sm={10}>
            <FormDataDisplayItem
              gap={1}
              isLoading={isFetching}
              Icon={ConstructionOutlinedIcon}
              label="Skills and talents"
            >
              {_skills.join(', ')}
            </FormDataDisplayItem>
          </Grid>
        ) : null}

        <Grid item xs={12} sm={10}>
          <FormDataDisplayItem isLoading={isFetching} gap={1} Icon={HandshakeOutlinedIcon} label="Causes">
            <ListCauses items={_causes} tileSize={20} spacing={2} isLoading={isFetching} invert withLabels />
          </FormDataDisplayItem>
        </Grid>

        {isFetching || _unsdg.length ? (
          <Grid item xs={12}>
            <FormDataDisplayItem
              isLoading={isFetching}
              gap={1}
              Icon={DataUsageOutlinedIcon}
              label="United Nations Sustainable Development Goals"
            >
              <ListUnsdg skeletonLength={4} selected={_unsdg} tileSize={56} isSelectionLoading={isFetching} />
            </FormDataDisplayItem>
          </Grid>
        ) : null}
      </Grid>

      <Grid
        item
        xs={12}
        justifyContent="flex-end"
        columnGap={1}
        rowGap={1}
        display="flex"
        mt={7}
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        flexWrap="wrap"
      >
        <Button
          disabled={
            (isLoading && loadingAction !== ActivityApprovalStatusEnum.Amended) || status !== ActivityStatusEnum.Pending
          }
          variant="contained-secondary"
          color="secondary"
          sx={{ minWidth: 186, minHeight: 44 }}
          loading={loadingAction === ActivityApprovalStatusEnum.Amended && isLoading}
          onClick={() =>
            navigate(getRoute('private.app.organizations.profile.verifyHours.hourDetailEdit', { id: orgId, hourId }))
          }
        >
          Amend
        </Button>
        <Button
          disabled={
            (isLoading && loadingAction !== ActivityApprovalStatusEnum.Declined) ||
            status !== ActivityStatusEnum.Pending
          }
          variant="contained-secondary"
          color="error"
          sx={{ minWidth: 186, minHeight: 44 }}
          loading={loadingAction === ActivityApprovalStatusEnum.Declined && isLoading}
          onClick={() => setIsShowDeclineModal(true)}
        >
          Deny
        </Button>
        <Button
          disabled={
            (isLoading && loadingAction !== ActivityApprovalStatusEnum.Approved) ||
            status !== ActivityStatusEnum.Pending
          }
          sx={{ minWidth: 186, height: 44 }}
          loading={loadingAction === ActivityApprovalStatusEnum.Approved && isLoading}
          onClick={handleOnApprove}
        >
          Approve
        </Button>
        <HourDeclineModal
          open={isShowDeclineModal}
          onDecline={handleOnDecline}
          onClose={() => setIsShowDeclineModal(false)}
        />
      </Grid>
    </ContentContainer>
  );
}
