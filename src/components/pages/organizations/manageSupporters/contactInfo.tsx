import { useState } from 'react';
import parsePhoneNumber from 'libphonenumber-js';

import { Typography } from '@ui/typography';
import { Box } from '@ui/layout';
import { styled, theme } from '@ui/theme';
import ContactsPopper from '@ui/contactsPopper';
import { IconButton } from '@ui/button';
import { MoreHorizIcon, LocalPhoneOutlinedIcon, ContentCopy } from '@ui/icons';
import { Button } from '@ui/button';
import { AdminSupporter } from '@utils/types/organization.type';

type ContactInfoProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<AdminSupporter | null>>;
  phone: string | null;
  email: string | null;
  user: AdminSupporter;
};

const StyledAt = styled(Typography)(() => ({
  fontSize: 16,
}));

const StyledListBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 5,
  marginBottom: 5,
}));

const { disabled, secondary } = theme.palette.text;

export default function ContactInfo({ setIsOpen, phone, email, user, setSelectedUser }: ContactInfoProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const showTooltip = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl((elem) => (!elem ? (e.currentTarget as HTMLButtonElement) : null));
    setSelectedUser(user);
  };

  const onPopperClose = () => {
    setIsOpen(false);
  };

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
  };

  const formatPhoneNumber = () => {
    if (!phone) return '';
    if (phone) {
      const phoneNumber = parsePhoneNumber(phone);
      if (!phoneNumber) return phone;
      return phoneNumber.formatInternational();
    }
  };

  const StyledBorderBox = styled(Box)(({ theme }) => ({
    borderWidth: 10,
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(1.2),
  }));

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={showTooltip} sx={{ p: 0 }}>
        <MoreHorizIcon color="primary" />
      </IconButton>
      <ContactsPopper anchorEl={anchorEl} placement="top" onClose={onPopperClose} title={null}>
        <Box>
          <Button variant="custom" sx={{ padding: 0 }} onClick={() => setIsOpen(true)}>
            <Typography variant="body1-secondary" sx={{ color: secondary }}>
              Edit Groups
            </Typography>
          </Button>
          <StyledBorderBox />
          <Typography sx={{ color: disabled, paddingBottom: 1 }}>Contact info</Typography>
          {phone && (
            <StyledListBox>
              <LocalPhoneOutlinedIcon sx={{ width: 16 }} />
              <Typography sx={{ paddingX: 1, color: secondary }}>{formatPhoneNumber()}</Typography>
              <IconButton onClick={() => copyToClipboard(formatPhoneNumber() || '')} sx={{ p: 0 }}>
                <ContentCopy sx={{ width: 16, color: secondary }} />
              </IconButton>
            </StyledListBox>
          )}
          <StyledListBox>
            <StyledAt>@</StyledAt>
            <Typography sx={{ paddingX: 1, color: secondary }}>{email}</Typography>
            <IconButton onClick={() => copyToClipboard(email || '')} sx={{ p: 0 }}>
              <ContentCopy sx={{ width: 16, color: secondary }} />
            </IconButton>
          </StyledListBox>
        </Box>
      </ContactsPopper>
    </Box>
  );
}
