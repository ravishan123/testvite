import { DotLottiePlayer } from '@dotlottie/react-player';

import { getProfileLogo, stringAvatar } from '@utils/functions/avatarUtils';
import { VolunteerHour } from '@utils/types/organization.type';

import CustomModal from '@ui/customModal';
import { VerifiedOutlinedIcon } from '@ui/icons';
import { Typography } from '@ui/typography';
import { Box } from '@ui/layout';
import Image from '@ui/image';
import { useTheme } from '@ui/theme';

import ActionBanner from '@globals/actionBanner';

type HourVerificationConfirmationModalProps = {
  userId: string;
  firstName: string;
  lastName: string;
  receivedHours: VolunteerHour | undefined;
  onClick?: () => void;
};

export default function HourVerificationConfirmationModal({
  userId,
  firstName,
  lastName,
  receivedHours,
  onClick,
}: HourVerificationConfirmationModalProps) {
  const theme = useTheme();

  return (
    <CustomModal width={435} open onClose={onClick} isTitleSeparate={false} iconButtonType="fill">
      <ActionBanner
        direction="vertical"
        verticalSize={[0, 3, 0, 3]}
        hasTitleTopGutter={false}
        image={
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Image
              width={64}
              height={64}
              backgroundColor={theme.palette.common.white}
              backgroundColorOnError={theme.palette.primary.main}
              sx={{ fontSize: theme.fontSize.sm, border: `1px solid ${theme.palette.grey['200']}` }}
              alt="profile"
              isAvatar
              src={getProfileLogo(userId)}
            >
              {stringAvatar(`${firstName} ${lastName}`).text}
            </Image>
          </div>
        }
        imageWidth={207}
        imageHeight={136}
        title={
          <>
            Thank you for verifying <br /> {firstName} {lastName}'s hours!
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
            src="/images/lottie/confetti.lottie"
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
          <Box mb={1}>
            <Typography
              variant="body4"
              component="p"
              sx={{ mb: 3, px: '55px', mt: 3, color: theme.palette.common.black }}
            >
              Together you’re growing the good.
            </Typography>
            <Typography variant="body4" component="p" sx={{ mb: 5, px: '55px', color: theme.palette.common.black }}>
              Invite other volunteers to verify their hours too.
            </Typography>
            <Box p={2} sx={{ backgroundColor: 'primary.light', borderRadius: 1 }}>
              <VerifiedOutlinedIcon sx={{ color: 'secondary.100' }} />
              <Typography variant="body1" color="text.primary" mt={1}>
                Total hours received
              </Typography>
              <Typography variant="h1" fontSize={32} color="text.primary">
                {receivedHours?.hours ? `${receivedHours.hours}h` : ''}
                {receivedHours?.minutes && receivedHours?.hours ? ' ' : ''}
                {receivedHours?.minutes ? `${receivedHours.minutes}m` : ''}
              </Typography>
            </Box>
          </Box>
        }
      />
    </CustomModal>
  );
}
