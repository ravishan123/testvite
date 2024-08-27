import React from 'react';

import { Button } from '@ui/button';
import { styled, useTheme } from '@ui/theme';
import { Typography } from '@ui/typography';
import { Grid, Box } from '@ui/layout';
import { Chip } from '@ui/chip';
import { CheckCircleOutlineIcon } from '@ui/icons';

import ConfirmModal from '@globals/confirmModal';

import orgCreationConfirm from '@assets/images/org_creation_confirm.svg';

const Image = styled('img')({
  width: '161px',
  height: '102px',
  objectFit: 'cover',
});

const StyledBox = styled(Box)(({ theme }) => ({
  alignSelf: 'end',
  marginTop: theme.spacing(3),
  paddingLeft: theme.spacing(3),
  width: '339px',
  height: 'auto',
  borderRadius: '8px',
  textAlign: 'start',
}));

function ConfirmationContent() {
  const { spacing } = useTheme();

  const items = [
    {
      label: 'Verify volunteer hour requests',
      isComingSoon: false,
    },
    {
      label: 'Invite people to join your group',
      isComingSoon: false,
    },
    {
      label: 'Weekly progress report',
      isComingSoon: true,
    },
  ];

  return (
    <Grid container display="flex" direction="column" alignItems="center" spacing={4}>
      <Grid item xs mt={5}>
        <Image src={orgCreationConfirm} alt="org creation confirm img" />
      </Grid>
      <Grid item xs display="flex" direction="column" alignItems="center">
        <Typography variant="h3" width={'70%'} mb={1}>
          Organization created
        </Typography>
        <Typography variant="body4" width={'90%'} mt={spacing(1)}>
          You can easily find, manage, and thank your supporters to scale the good you do.
        </Typography>
      </Grid>
      <StyledBox>
        <Typography variant="h5">What’s next?</Typography>
        <Grid container display="flex" direction="column" mt={spacing(2)} spacing={1.5}>
          {items.map((item, index) => (
            <Grid key={`${index}_${item.label}`} item xs display="inline-flex" justifyContent="flex-start">
              <CheckCircleOutlineIcon sx={{ minWidth: 32, color: 'success.main', mr: 0.5, alignSelf: 'center' }} />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography key={`${index}`} variant="body4">
                  {item.label}
                </Typography>
                {item.isComingSoon && (
                  <Chip
                    key={`${item.label}`}
                    color="warning"
                    sx={{ width: '116px', height: '20px', mt: spacing(1) }}
                    label={<Typography variant="h6">COMING SOON</Typography>}
                  />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </StyledBox>
    </Grid>
  );
}

interface AddLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrgCreateConfirmModal: React.FC<AddLanguageModalProps> = ({ isOpen = false, onClose }) => {
  return (
    <ConfirmModal
      open={isOpen}
      onClose={onClose}
      width={435}
      footerContent={
        <Button sx={{ width: 339 }} variant="contained" color="primary" onClick={onClose}>
          Got it
        </Button>
      }
    >
      <ConfirmationContent />
    </ConfirmModal>
  );
};

export default OrgCreateConfirmModal;
