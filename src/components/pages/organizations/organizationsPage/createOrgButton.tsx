import { Button, ButtonProps } from '@ui/button';
import { Box } from '@ui/layout';
import { Typography } from '@ui/typography';
import { AddIcon } from '@ui/icons';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type CreateOrgButtonProps = Partial<ButtonProps> & {
  onClick?: () => void;
  isNoOrgs?: boolean;
};

export default function CreateOrgButton({ isNoOrgs = false, ...props }: CreateOrgButtonProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}
    >
      {isNoOrgs && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h3" my={1}>
            Get your organization on board
          </Typography>
          <Typography variant="body4" component="div">
            You have not created or been assigned to manage any organization profiles yet.
          </Typography>
        </Box>
      )}

      <Button
        variant="custom"
        sx={{
          p: 0,
          width: '98%',
          ml: isMobile ? 0 : 1.5,
        }}
        {...props}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            py: 2,
            px: isMobile ? 2 : 4,
            width: '100%',

            // eslint-disable-next-line @cspell/spellchecker
            backgroundImage:
              "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='2' ry='2' stroke='%23374EA9FF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='13' stroke-linecap='square'/%3e%3c/svg%3e\")",
          }}
        >
          <AddIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" sx={{ color: 'primary.main' }}>
            Create an organization
          </Typography>
        </Box>
      </Button>
    </Box>
  );
}
