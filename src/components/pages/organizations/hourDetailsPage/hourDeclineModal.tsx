import { useEffect, useState } from 'react';

import { Button } from '@ui/button';
import CustomModal from '@ui/customModal';
import { FormLabel } from '@ui/forms';
import { Box, Grid } from '@ui/layout';
import { TextField } from '@ui/textField';
import { Typography } from '@ui/typography';
import { useTheme } from '@ui/theme';

type HourDeclineModalProps = {
  open: boolean;
  onDecline: (declinedReason: string) => void;
  onClose?: () => void;
};

const CHARACTER_LIMIT = 250;

export default function HourDeclineModal({ open = false, onDecline, onClose }: HourDeclineModalProps) {
  const [isShowDeclineModal, setIsShowDeclineModal] = useState<boolean>(open);
  const [declinedReason, setDeclinedReason] = useState<string>('');
  const { palette } = useTheme();

  useEffect(() => {
    setIsShowDeclineModal(open);
  }, [open]);

  useEffect(() => {
    if (!isShowDeclineModal) {
      onClose && onClose();
    }
  }, [isShowDeclineModal]);

  return (
    <CustomModal
      open={isShowDeclineModal}
      width={521}
      title="Decline hours verification request"
      onClose={() => {
        setIsShowDeclineModal(false);
        setDeclinedReason('');
      }}
      footerContent={
        <Box display="flex" columnGap={1}>
          <Button
            variant="contained-secondary"
            color="secondary"
            sx={{ minWidth: 186, minHeight: 44 }}
            onClick={() => {
              setIsShowDeclineModal(false);
              setDeclinedReason('');
            }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            sx={{ minWidth: 186, minHeight: 44 }}
            disabled={!declinedReason}
            onClick={() => {
              onDecline && onDecline(declinedReason);
              setIsShowDeclineModal(false);
              setDeclinedReason('');
            }}
          >
            Decline
          </Button>
        </Box>
      }
    >
      <Grid container>
        <Grid item xs={12}>
          <FormLabel component="label" required>
            Enter reason to decline
          </FormLabel>
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={declinedReason}
            onChange={(e) => setDeclinedReason(e.target.value)}
            placeholder="Type here..."
            multiline
            rows={7}
            fullWidth
            inputProps={{
              maxLength: CHARACTER_LIMIT,
            }}
            InputProps={{
              endAdornment: (
                <div style={{ position: 'absolute', right: '12px', bottom: '8px', marginBottom: 6 }}>
                  <Typography sx={{ color: palette.grey[200] }}>
                    {declinedReason?.length}/{CHARACTER_LIMIT}
                  </Typography>
                </div>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} mt={2}>
          <Typography variant="body1-secondary">
            You may need to follow up with the volunteer to further explain the reason for declining.
          </Typography>
        </Grid>
      </Grid>
    </CustomModal>
  );
}
