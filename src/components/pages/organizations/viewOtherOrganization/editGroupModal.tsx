import { useEffect, useState } from 'react';
import CustomModal from '@ui/customModal';
import { Grid } from '@ui/layout';
import { Button } from '@ui/button';
import { Skeleton } from '@ui/skeleton';
import Image from '@ui/image';
import { Typography } from '@ui/typography';
import { Box } from '@ui/layout';
import { useTheme } from '@ui/theme';
import { CustomCheckbox } from '@globals/customCheckbox';
import { useJoinGroupMutation, useLeaveGroupMutation } from '@store/slices/organization/organization.slice';
import { useSnackbar } from '@ui/snackBar';
import { useForm, Controller, useWatch } from 'react-hook-form';
import ConfirmDialog from '@globals/confirmDialog';
import { object, boolean } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type JoinGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  logo: string;
  organizationId: string;
  orgName: string;
  orgType: string | null;
  userInfo: { isDonor: boolean; isVolunteer: boolean; role: string } | null;
};

const validationSchema = object({
  isVolunteer: boolean(),
  isDonor: boolean(),
}).refine(
  (data) => {
    console.log('data', data);
    return data.isVolunteer || data.isDonor;
  },
  {
    message: 'At least one option must be selected',
    path: ['isVolunteer', 'isDonor'],
  }
);

export default function EditGroupModal({
  orgName,
  orgType,
  isOpen,
  onClose,
  isLoading,
  logo = '',
  organizationId,
  userInfo,
}: JoinGroupModalProps) {
  const { spacing } = useTheme();
  const { openSnackbar } = useSnackbar();
  const [isLeave, setIsLeave] = useState(false);

  const onCloseLeaveModal = () => {
    setIsLeave(false);
  };

  const [
    createJoinGroup,
    { isError: isJoinGroupError, error: joinGroupsError, isSuccess: isJoinGroupSuccess, isLoading: isLoadingJoinGroup },
  ] = useJoinGroupMutation();

  const [
    leaveGroup,
    {
      isError: isLeaveGroupError,
      error: leaveGroupsError,
      isSuccess: isLeaveGroupSuccess,
      isLoading: isLoadingLeaveGroup,
    },
  ] = useLeaveGroupMutation();
  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      isVolunteer: userInfo?.isVolunteer || false,
      isDonor: userInfo?.isDonor || false,
    },
    mode: 'onChange',
    resolver: zodResolver(validationSchema),
  });
  const watchedValues = watch(['isVolunteer', 'isDonor']);

  useEffect(() => {
    if (isJoinGroupSuccess) {
      openSnackbar('Group preferences updated successfully', 'success');
      onClose();
      reset();
    } else if (isJoinGroupError) {
      openSnackbar((joinGroupsError as Error)?.message || 'Error occurred while joining group', 'error');
    }
  }, [isJoinGroupSuccess, isJoinGroupError]);
  useEffect(() => {
    if (isLeaveGroupSuccess) {
      openSnackbar(`You have successfully left the group ${orgName}`, 'success');
      onCloseLeaveModal();
      onClose();
      reset();
    } else if (isJoinGroupError) {
      openSnackbar((leaveGroupsError as Error)?.message || 'Error occurred while joining group', 'error');
    }
  }, [isLeaveGroupSuccess, isLeaveGroupError]);

  const onSubmit = async (data: { isVolunteer: boolean; isDonor: boolean }) => {
    const payload = {
      ...data,
      organizationId,
    };

    try {
      await createJoinGroup(payload);
    } catch (err) {
      openSnackbar((err as Error).message, 'error');
    }
  };
  const onSubmitLeaveGroup = async () => {
    const payload = {
      organizationId: organizationId,
    };

    try {
      await leaveGroup(payload);
    } catch (err) {
      openSnackbar((err as Error).message, 'error');
    }
  };

  const _isVolunteer = useWatch({
    control,
    name: 'isVolunteer',
  });

  const _isDonor = useWatch({
    control,
    name: 'isDonor',
  });

  useEffect(() => {
    void trigger();
  }, [_isVolunteer, _isDonor, trigger]);

  useEffect(() => {
    reset({
      isVolunteer: userInfo?.isVolunteer || false,
      isDonor: userInfo?.isDonor || false,
    });
  }, [userInfo, reset]);

  const onCloseBtn = () => {
    onClose();
    reset();
  };

  return (
    <>
      <CustomModal
        width={433}
        open={isOpen}
        onClose={onCloseBtn}
        isTitleSeparate={false}
        footerContent={
          <Box display="flex" justifyContent="center" columnGap={1} mb={4} width="92%" mr={2}>
            <Button variant="contained-secondary" fullWidth color="error" onClick={() => setIsLeave(true)}>
              Leave group
            </Button>
            <Button
              fullWidth
              color="primary"
              loading={isLoadingJoinGroup}
              onClick={handleSubmit(onSubmit)}
              disabled={
                !isDirty || (watchedValues[0] === false && watchedValues[1] === false) || Object.keys(errors).length > 0
              }
            >
              Save
            </Button>
          </Box>
        }
      >
        <Grid container spacing={1} display="flex" flexDirection="column" padding={[2, 2, 2, 2]}>
          <>
            <Grid display="flex" flexDirection="column" alignItems="center" item>
              {isLoading ? (
                <Skeleton width={96} height={96} variant="rounded" />
              ) : (
                <Image
                  src={logo}
                  width={96}
                  height={96}
                  shape="rounded"
                  borderRadius="16px"
                  alt="organization logo"
                  hasBorder
                />
              )}
              <Typography variant="h4" sx={{ paddingTop: spacing(1) }}>
                {orgName}
              </Typography>
              <Typography variant="body1-secondary" sx={{ paddingTop: spacing(0.5), paddingBottom: spacing(3) }}>
                {orgType}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <>
                <Typography variant="body4" sx={{ textAlign: 'center' }}>
                  You have joined this group...
                </Typography>
                <Box marginTop={2}>
                  <Controller
                    name="isVolunteer"
                    control={control}
                    render={({ field }) => (
                      <CustomCheckbox
                        defaultChecked={userInfo?.isVolunteer || false}
                        label="As a volunteer"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="isDonor"
                    control={control}
                    render={({ field }) => (
                      <CustomCheckbox defaultChecked={userInfo?.isDonor || false} label="As a donor" {...field} />
                    )}
                  />
                </Box>
              </>
            </Grid>
          </>
        </Grid>
      </CustomModal>
      <ConfirmDialog
        open={isLeave}
        width={435}
        title="Are you sure you want to leave this group?"
        onClose={onCloseLeaveModal}
        description={''}
        isReverseFooterButtons
        confirmButton={{
          text: 'Yes',
          color: 'error',
          variant: 'contained-secondary',
          onClick: onSubmitLeaveGroup,
          loading: isLoadingLeaveGroup,
        }}
        cancelButton={{
          text: 'No',
          variant: 'contained-secondary',
          onClick: onCloseLeaveModal,
        }}
      />
    </>
  );
}
