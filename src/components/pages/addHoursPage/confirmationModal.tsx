import CustomModal from '@ui/customModal';
import { List, ListItem, ListItemIcon, ListItemText } from '@ui/list';
import { CheckCircleOutlineIcon } from '@ui/icons';
import { Typography } from '@ui/typography';
import { Box } from '@ui/layout';
import { DotLottiePlayer } from '@dotlottie/react-player';
import { useTheme } from '@ui/theme';

import ActionBanner from '@globals/actionBanner';

type ConfirmationModalProps = {
  onClick?: () => void;
};

export default function ConfirmationModal({ onClick }: ConfirmationModalProps) {
  const { palette } = useTheme();
  return (
    <CustomModal width={435} open onClose={onClick} isTitleSeparate={false} iconButtonType="fill">
      <ActionBanner
        direction="vertical"
        verticalSize={[0, 3, 0, 3]}
        image="/images/add_hour_thank_you_banner_two.svg"
        imageWidth={207}
        imageHeight={136}
        title={
          <>
            Thank you for gifting your
            <br />
            time and skills.
          </>
        }
        titleVariant="h3"
        action={{
          text: 'Got it',
          variant: 'contained',
          color: 'primary',
          onClick: () => onClick && onClick(),
        }}
        alignContent="center"
        imageOverlay={
          <DotLottiePlayer
            src="images/lottie/confetti.lottie"
            autoplay
            loop={1}
            style={{
              position: 'absolute',
              transform: 'translate(-50%, -50%) scale(4.5)',
              top: '50%',
              left: '50%',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        }
        description={
          <Box>
            <Typography variant="body4" component="p" sx={{ mb: 5, color: palette.common.black }}>
              You will be notified when your volunteer hours
              <br />
              are verified, amended, or declined.
            </Typography>
            <Typography variant="h5" textAlign="left" sx={{ color: palette.common.black }}>
              What’s next?
            </Typography>
            <Box pr={9}>
              <List sx={{ mt: 1 }} disablePadding>
                {[
                  'Follow up with the organization for speedy verification',
                  'Help others to verify and scale their volunteer contributions',
                  'Invite caring people like you to join gudppl',
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
  );
}
