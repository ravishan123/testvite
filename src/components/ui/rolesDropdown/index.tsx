import { MouseEventHandler, useEffect, useState } from 'react';
import { useTheme } from '@ui/theme';
import { styled } from '@ui/theme';
import { Typography, TypographyProps } from '@ui/typography';
import { Box, BoxProps } from '@ui/layout';
import { ArrowDropDownIcon, Check, WorkspacePremiumIcon } from '@ui/icons';
import { Menu, MenuItem } from '@ui/menu';
import { useGetUserRoleQuery, useManageEditRoleMutation } from '@store/slices/supporters/supporters.slice';
import ConfirmDialog from '@globals/confirmDialog';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from '@ui/snackBar';
import { Button } from '@ui/button';
import { useAppSelector } from '@store/hooks';
import { selectUserProfile } from '@store/slices/profile/profile.slice';
import useSignOutHook from '@utils/hooks/signOutHook';
import { UserRoles } from '@utils/enums/roles.enum';
import { Action, Role, canPerformAction } from '@utils/functions/permissionMatrix.utils';

const StyledButton = styled(Button)(({ theme }) => ({
  border: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginLeft: -6,
  marginRight: theme.spacing(1),
}));

const nameContainerProps: BoxProps = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden',
  ml: 1,
  textAlign: 'left',
  flexGrow: 1,
};

const profileNameElemProps: TypographyProps = {
  variant: 'body1',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: 12,
  marginLeft: 1,
}));

type RolesDropDownProps = {
  showRole: boolean;
  role: string;
  orgId: string;
  userId: string;
  name: string;
  handleRefetch: () => void;
  disable?: boolean;
};

type LocationProps = {
  state: {
    orgName: string;
    logo: string;
    type: string;
    orgId: string;
    orgUserRole: string;
  };
};

const RolesDropdown = ({ showRole = true, role, orgId, userId, name, handleRefetch, disable }: RolesDropDownProps) => {
  const { palette } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const location: LocationProps = useLocation();
  const [userRole, setUserRole] = useState<string>('');
  const { openSnackbar } = useSnackbar();
  const [editRole, { isLoading, isSuccess, isError }] = useManageEditRoleMutation();
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

  const onClickSelect = ({ title }: { title: string }) => {
    setUserRole(title);
    setIsConfirm(true);
  };

  const CustomMenuItem = ({ title, isPremiumTrial }: { title: string; isPremiumTrial?: boolean }) => {
    const isSelect = title.toLowerCase() === role.toLowerCase();
    const roleEnum = title.toUpperCase() as Role;
    const currentRole = role as Role;
    const actionType =
      (organizationUser && (`MANAGE_ROLES_${organizationUser?.supporter.role}_${currentRole}` as Action)) ||
      Action.MANAGE_ROLES_SUPPORTER_SUPPORTER;
    const canModify = isOpen && canPerformAction(roleEnum, actionType);

    return (
      <StyledMenuItem autoFocus={false} onClick={() => onClickSelect({ title })} disabled={!canModify}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Box display="flex" alignItems="center">
            <Check sx={{ fontSize: '16px', color: isSelect ? palette.primary.main : palette.common.white }} />
            <Typography ml={0.5}>{title}</Typography>
          </Box>
          {isPremiumTrial && (
            <Box display="inline-flex" alignItems="center">
              <WorkspacePremiumIcon sx={{ fontSize: '16px', mr: 0.5, color: palette.warning.main }} />
              <Typography color={palette.warning.main} variant="body4">
                Free premium trial
              </Typography>
            </Box>
          )}
        </Box>
      </StyledMenuItem>
    );
  };

  const handleOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    setAnchorEl(e.currentTarget);
    setIsOpen(true);
  };

  const handleOnClose = () => {
    setIsOpen(false);
  };

  const handleOnExited = () => {
    setAnchorEl(null);
  };

  const onCloseConfirmModal = () => {
    setIsConfirm(false);
  };

  const onSubmitEditRole = async () => {
    const payload = {
      organizationId: orgId,
      targetUserId: userId,
      newRole: userRole.toUpperCase(),
    };

    try {
      await editRole(payload);
    } catch (err) {
      openSnackbar((err as Error).message, 'error');
    }
  };

  useEffect(() => {
    if (isSuccess) {
      openSnackbar(
        `${name} has been successfully assigned the role of ${userRole} at ${location?.state?.orgName}`,
        'success'
      );
      onCloseConfirmModal();
      handleOnClose();
      handleRefetch();
      if (profile?.id === userId) {
        handleSignOut();
      }
    } else if (isError) {
      openSnackbar('Error occurred', 'error');
    }
  }, [isSuccess, isError]);
  const roleName = role && role.toLowerCase();

  return (
    <>
      <StyledButton
        disabled={
          organizationUser?.supporter.role === UserRoles.COORDINATOR ||
          organizationUser?.supporter.role === UserRoles.SUPPORTER ||
          isLoading ||
          isUserRoleLoading ||
          isUserRoleFetching ||
          disable
        }
        variant="text"
        sx={{ border: 0 }}
        fullWidth
        onClick={handleOnClick}
      >
        {showRole ? (
          <Box display="flex" overflow="hidden" width="100%">
            <Box {...nameContainerProps}>
              <Typography sx={{ textTransform: 'capitalize' }} {...profileNameElemProps}>
                {roleName}
              </Typography>
            </Box>
          </Box>
        ) : null}
        <ArrowDropDownIcon sx={{ m: 0 }} />
      </StyledButton>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleOnClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: showRole ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        elevation={2}
        slotProps={{
          paper: {
            sx: {
              width: '287px',
            },
          },
        }}
        TransitionProps={{
          onExited: handleOnExited,
        }}
      >
        <Box mt={1} mb={1} pb={1.5} ml={2} mr={2} borderBottom={`1px solid ${palette.grey[100]}`}>
          <Typography variant="h6">Change role</Typography>
        </Box>
        <CustomMenuItem title="Supporter" isPremiumTrial={false} />
        <CustomMenuItem title="Owner" isPremiumTrial />
        <CustomMenuItem title="Supervisor" isPremiumTrial />
        <CustomMenuItem title="Coordinator" isPremiumTrial />
      </Menu>
      <ConfirmDialog
        open={isConfirm}
        width={userRole.toUpperCase() === UserRoles.OWNER ? 460 : 435}
        title={`Are you sure you want to assign ${userRole} to ${name} to the ${location?.state?.orgName} profile?`}
        onClose={onCloseConfirmModal}
        description={
          userRole.toUpperCase() === UserRoles.OWNER
            ? `Please be mindful that proceeding with this action grants 'Owners' full access to your organization profile. This means ${name} can add or remove other people from 'Owner' roles, including your account.`
            : ''
        }
        confirmButton={{
          text: 'Yes',
          variant: 'contained',
          onClick: onSubmitEditRole,
          loading: isLoading,
          disabled: disable,
        }}
        cancelButton={{
          text: 'No',
          variant: 'contained-secondary',
          onClick: onCloseConfirmModal,
        }}
      />
    </>
  );
};

export default RolesDropdown;
