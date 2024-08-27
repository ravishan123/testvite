import { ReactNode } from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Box, Typography } from '@mui/material';
import { Button } from '@ui/button';
import { useTheme } from '@ui/theme';

interface NotificationBannerProps {
  title: string;
  message: string;
  buttonLabel?: string;
  IconComponent?: ReactNode;
  onClick?: () => void;
}

export default function NotificationBanner({
  title,
  message,
  buttonLabel,
  IconComponent = <NotificationsNoneIcon color={'warning'} />,
  onClick,
}: NotificationBannerProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: { xs: 'block', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 18px',
        borderRadius: '8px',
        backgroundColor: '#FFF6E8',
        border: `1px solid ${theme.palette.warning.main}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          marginBottom: { xs: '16px', md: '0px' },
        }}
      >
        <Box
          sx={{
            marginBottom: { xs: '16px', md: '0px' },
            marginRight: { md: '16px' },
            display: 'flex',
            alignItem: 'center',
          }}
        >
          {IconComponent}
        </Box>
        <Box mr={6}>
          <Typography variant="h5" gutterBottom={Boolean(message)}>
            {title}
          </Typography>
          <Typography variant="body4" component="div" fontSize={theme.fontSize.xs} lineHeight="17px">
            {message}
          </Typography>
        </Box>
      </Box>
      {buttonLabel && (
        <Box textAlign="center">
          <Button variant="custom" color="secondary" onClick={onClick} sx={{ whiteSpace: 'nowrap', height: '36px' }}>
            {buttonLabel}
          </Button>
        </Box>
      )}
    </Box>
  );
}
