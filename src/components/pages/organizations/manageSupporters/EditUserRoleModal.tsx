import { useState, useEffect } from 'react';

import CustomModal from '@ui/customModal';
import { Grid } from '@ui/layout';
import { Button } from '@ui/button';
import { Skeleton } from '@ui/skeleton';
import Image from '@ui/image';
import { Typography } from '@ui/typography';
import { Box } from '@ui/layout';
import { useTheme } from '@ui/theme';
import { useForm, Controller } from 'react-hook-form';
import { object, boolean } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from '@ui/snackBar';

import { CustomCheckbox } from '@globals/customCheckbox';
import {
  useEditGroupAdminMutation,
  useExitGroupAdminMutation,
  useGetUserRoleQuery,
} from '@store/slices/supporters/supporters.slice';
import { AdminSupporter } from '@utils/types/organization.type';
import { useAppSelector } from '@store/hooks';
import { selectUserProfile } from '@store/slices/profile/profile.slice';
import useSignOutHook from '@utils/hooks/signOutHook';
import { Action, Role, canPerformAction } from '@utils/functions/permissionMatrix.utils';

type EditUserRoleModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  isLoading: boolean;
  logo: string | null;
  orgType: string | null;
  orgName: string | null;
  userInfo: AdminSupporter | null;
  orgId: string;
  refetch: () => void;
};

const validationSchema = object({
  isVolunteer: boolean(),
  isDonor: boolean(),
}).refine((data) => data.isVolunteer || data.isDonor, {
  message: 'At least one option must be selected',
  path: ['isVolunteer', 'isDonor'],
});

export default function EditUserRoleModal({
  isOpen,
  onClose,
  isLoading,
  logo,
  orgName,
  orgType,
  orgId,
  userInfo,
  refetch,
}: EditUserRoleModalProps) {
  const [confirm, setConfirm] = useState(false);
  const { spacing } = useTheme();
  const { openSnackbar } = useSnackbar();
  const profile = useAppSelector(selectUserProfile);
  const { handleSignOut } = useSignOutHook();
  const {
    data: organizationUser,
    isFetching: isUserRoleFetching,
    isLoading: isUserRoleLoading,
    error,
  } = useGetUserRoleQuery({ orgId: orgId || '' }, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (error) {
      openSnackbar('Something went wrong.', 'error');
    }
  }, [error]);

  const actionType: Action | undefined =
    userInfo?.role && organizationUser
      ? (`MANAGE_SUPPORTERS_${organizationUser?.supporter.role}` as Action)
      : undefined;

  const canModify = isOpen && actionType && canPerformAction(userInfo?.role as Role, actionType);

  const [
    editGroup,
    { isError: isErrorEditGroup, error: editGroupError, isSuccess: isSuccessEditGroup, isLoading: isLoadingEditGroup },
  ] = useEditGroupAdminMutation();

  const [
    exitGroup,
    { isError: isExitGroupError, error: exitGroupsError, isSuccess: isExitGroupSuccess, isLoading: isLoadingExitGroup },
  ] = useExitGroupAdminMutation();

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      isVolunteer: userInfo?.isVolunteer ?? false,
      isDonor: userInfo?.isDonor ?? false,
    },
    mode: 'onChange',
    resolver: zodResolver(validationSchema),
  });
  const watchedValues = watch(['isVolunteer', 'isDonor']);

  const onSubmit = async (data: { isVolunteer: boolean; isDonor: boolean }) => {
    try {
      const payload: {
        isDonor: boolean;
        isVolunteer: boolean;
        organizationId: string;
        targetUserId: string;
      } = {
        isDonor: data.isDonor,
        isVolunteer: data.isVolunteer,
        organizationId: orgId,
        targetUserId: userInfo?.id || '',
      };
      await editGroup(payload);
      refetch();
      setConfirm(false);
    } catch (error) {
      openSnackbar((error as Error).message, 'error');
    }
  };

  const onExitGroup = async () => {
    try {
      const payload = {
        organizationId: orgId,
        targetUserId: userInfo?.id || '',
      };
      await exitGroup(payload);
      refetch();
      setConfirm(false);
    } catch (error) {
      openSnackbar((error as Error).message, 'error');
    }
  };

  useEffect(() => {
    if (isSuccessEditGroup) {
      openSnackbar('Group preferences updated successfully', 'success');
      onClose && onClose();
      reset();
    }
    if (isErrorEditGroup) {
      console.log(editGroupError);
      const { status } = editGroupError as { status: number };
      if (status === 403) {
        openSnackbar('You are not authorized to perform this action', 'error');
      } else {
        openSnackbar((editGroupError as Error)?.message || 'Error occurred while joining group', 'error');
      }
    }
  }, [isSuccessEditGroup, isErrorEditGroup]);

  useEffect(() => {
    if (isExitGroupSuccess) {
      openSnackbar(`${userInfo?.name ?? ''} has been successfully removed from the group`, 'success');
      onClose && onClose();
      reset();
      if (profile?.id === userInfo?.id) {
        handleSignOut();
      }
    }
    if (isExitGroupError) {
      openSnackbar((exitGroupsError as Error)?.message || 'Error occurred while joining group', 'error');
    }
  }, [isExitGroupSuccess, isExitGroupError]);

  useEffect(() => {
    reset({
      isVolunteer: userInfo?.isVolunteer || false,
      isDonor: userInfo?.isDonor || false,
    });
  }, [userInfo, reset]);

  return (
    <CustomModal
      width={433}
      open={isOpen}
      onClose={() => {
        onClose && onClose();
        setConfirm(false);
      }}
      isTitleSeparate={false}
      footerContent={
        !confirm ? (
          <Box display="flex" columnGap={1}>
            <Button
              variant="contained-secondary"
              color="error"
              disabled={userInfo?.is_disable_remove || !canModify}
              sx={{ minWidth: 186, minHeight: 44 }}
              onClick={() => setConfirm(true)}
            >
              Remove from group
            </Button>
            <Button
              color="primary"
              loading={isLoadingEditGroup}
              sx={{ minWidth: 186, minHeight: 44 }}
              onClick={handleSubmit(onSubmit)}
              disabled={
                !isDirty ||
                (watchedValues[0] === false && watchedValues[1] === false) ||
                Object.keys(errors).length > 1 ||
                !canModify
              }
            >
              Save
            </Button>
          </Box>
        ) : (
          <Box display="flex" columnGap={1}>
            <Button
              variant="contained"
              color="error"
              loading={isLoadingExitGroup}
              sx={{ minWidth: 186, minHeight: 44 }}
              onClick={() => onExitGroup()}
            >
              Yes
            </Button>
            <Button
              variant="contained-secondary"
              color="primary"
              sx={{ minWidth: 186, minHeight: 44 }}
              onClick={() => {
                onClose && onClose();
                setConfirm(false);
              }}
            >
              No
            </Button>
          </Box>
        )
      }
    >
      <Grid container spacing={1} display="flex" flexDirection="column">
        {!confirm ? (
          <>
            <Grid display="flex" flexDirection="column" alignItems="center" item>
              {isLoading || isUserRoleLoading || isUserRoleFetching ? (
                <Skeleton width={96} height={96} variant="rounded" />
              ) : (
                <Image
                  src={logo || ''}
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
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <Typography variant="subtitle2" sx={{ textAlign: 'center', paddingBottom: spacing(1.5) }}>
                {userInfo?.name ?? ''} has joined this group...
              </Typography>
              <Controller
                name="isVolunteer"
                control={control}
                render={({ field }) => (
                  <CustomCheckbox defaultChecked={userInfo?.isVolunteer || false} label="As a volunteer" {...field} />
                )}
              />
              <Controller
                name="isDonor"
                control={control}
                render={({ field }) => (
                  <CustomCheckbox defaultChecked={userInfo?.isDonor || false} label="As a donor" {...field} />
                )}
              />
            </Grid>
          </>
        ) : (
          <>
            <Typography
              variant="h4"
              sx={{ textAlign: 'center', paddingBottom: spacing(1.5), lineHeight: spacing(2.5) }}
            >
              Are you sure you want to <br /> remove {userInfo?.name} from this <br /> group?
            </Typography>
          </>
        )}
      </Grid>
    </CustomModal>
  );
}
