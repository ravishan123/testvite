import CustomModal from '@ui/customModal';
import { List, ListItem, ListItemIcon, ListItemText } from '@ui/list';
import { CheckCircleOutlineIcon } from '@ui/icons';
import { Typography } from '@ui/typography';
import { Box } from '@ui/layout';
import { useTheme } from '@ui/theme';

import ActionBanner from '@globals/actionBanner';
import { useState } from 'react';

export default function PasswordHelperTextTooltip() {
  const { palette } = useTheme();
  const [visible, setVisible] = useState(false);
  const onCancel = () => setVisible(!visible);

  return (
    <>
      <Typography
        onClick={() => setVisible(!visible)}
        variant="body1"
        sx={{ color: palette.grey[300], mb: 2, mt: 1, width: '29%', cursor: 'pointer' }}
      >
        Password policy
      </Typography>

      <CustomModal width={435} open={visible} onClose={onCancel} isTitleSeparate={false}>
        <ActionBanner
          direction="vertical"
          verticalSize={[0, 3, 0, 3]}
          image={null}
          imageWidth={207}
          imageHeight={136}
          title={<>Password policy</>}
          titleVariant="h3"
          action={{
            text: 'Got it',
            variant: 'contained',
            color: 'primary',
            onClick: () => onCancel(),
          }}
          alignContent="center"
          description={
            <Box mt={4}>
              <Box pr={1}>
                <List sx={{ mt: 1 }} disablePadding>
                  {[
                    'Should have at least 6 alphanumeric characters.',
                    'Should contain at least 1 upper case and one lower case.',
                    'Should contain at least one special character.',
                  ].map((item, index) => (
                    <ListItem key={`confirm-modal-${index}`} disableGutters>
                      <ListItemIcon sx={{ minWidth: 29, color: 'success.main' }}>
                        <CheckCircleOutlineIcon />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ variant: 'body4' }} sx={{ color: palette.common.black }}>
                        {item}
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          }
        />
      </CustomModal>
    </>
  );
}
