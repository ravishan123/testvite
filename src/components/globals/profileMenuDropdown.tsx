import { MouseEventHandler, useState } from 'react';

import { useAppSelector } from '@store/hooks';
import { selectUserProfile, selectUserProfileResult } from '@store/slices/profile/profile.slice';
import { stringAvatar } from '@utils/functions/avatarUtils';
import useSignOutHook from '@utils/hooks/signOutHook';
import { selectUserProfileImage } from '@store/slices/user/user.slice';

import { Button } from '@ui/button';
import { styled, useTheme } from '@ui/theme';
import { Typography, TypographyProps } from '@ui/typography';
import { Box, BoxProps } from '@ui/layout';
import { ArrowDropDownIcon } from '@ui/icons';
import { Menu, MenuItem } from '@ui/menu';
import Image from '@ui/image';
import { Skeleton } from '@ui/skeleton';

const StyledButton = styled(Button)(({ theme }) => ({
  border: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginLeft: -6,
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(3),
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
  variant: 'h4',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

const emailElemProps: TypographyProps = {
  variant: 'body1',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

export default function ProfileMenuDropdown() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpen, setIsOPen] = useState(false);
  const profile = useAppSelector(selectUserProfile);
  const { isLoading } = useAppSelector(selectUserProfileResult);
  const { url: imageUrl } = useAppSelector(selectUserProfileImage);
  const { handleSignOut } = useSignOutHook();

  const handleOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    setAnchorEl(e.currentTarget);
    setIsOPen(true);
  };

  const handleOnClose = () => {
    setIsOPen(false);
  };

  const handleOnExited = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <StyledButton variant="text" sx={{ border: 0 }} fullWidth onClick={handleOnClick}>
        <Box display="flex" overflow="hidden" width="100%">
          <Image
            width={40}
            height={40}
            backgroundColor={theme.palette.common.white}
            backgroundColorOnError={theme.palette.primary.main}
            sx={{ fontSize: theme.fontSize.sm, border: `1px solid ${theme.palette.grey['200']}` }}
            alt="profile"
            src={imageUrl || ''}
          >
            {stringAvatar(`${profile?.first_name as string} ${profile?.last_name as string}`).text}
          </Image>
          <Box {...nameContainerProps}>
            <Typography {...profileNameElemProps}>
              {isLoading ? (
                <Skeleton variant="text" width="90%" />
              ) : (
                `${profile?.first_name || ''} ${profile?.last_name || ''}`
              )}
            </Typography>
            <Typography {...emailElemProps}>
              {isLoading ? <Skeleton variant="text" width="70%" /> : profile?.email}
            </Typography>
          </Box>
        </Box>
        <ArrowDropDownIcon sx={{ m: 0 }} />
      </StyledButton>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleOnClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        elevation={2}
        slotProps={{
          paper: {
            sx: {
              width: anchorEl?.clientWidth,
            },
          },
        }}
        TransitionProps={{
          onExited: handleOnExited,
        }}
      >
        <MenuItem onClick={handleSignOut}>Log out</MenuItem>
      </Menu>
    </>
  );
}
