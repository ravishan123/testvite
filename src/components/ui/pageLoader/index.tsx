import MaterialBox from '@mui/material/Box';
import Modal, { ModalProps } from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';

import { alpha, styled, useTheme } from '../theme';
import { Typography } from '@ui/typography';

const Box = styled(MaterialBox)(
  ({ theme }) => `
  display: flex;
  background-color: ${theme.palette.background.default};
  padding: 40px;
  flex-direction: column;
  border-radius: 16px;
  width: 171px;
  height: 169px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  align-items: center;
  color: ${theme.palette.grey[300]};
  outline: 0;
  user-select: none;
  box-shadow: 0 0 13px 0px ${alpha(theme.palette.primary.main, 0.1)};

  & > .MuiCircularProgress-root {
    margin-bottom: 24px;
  }
`
);

type PageLoaderProps = Omit<ModalProps, 'children'> & {
  target?: 'page' | 'component';
};

export default function PageLoader({ target = 'page', ...props }: PageLoaderProps) {
  const theme = useTheme();

  return (
    <Modal
      {...(target === 'component' && {
        disablePortal: true,
      })}
      slotProps={{
        backdrop: {
          sx: {
            ...(target === 'component' && {
              position: 'absolute',
            }),
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          },
        },
        root: {
          style: {
            ...(target === 'component' && {
              position: 'absolute',
            }),
          },
        },
      }}
      {...props}
    >
      <Box>
        <CircularProgress color="inherit" />
        <Typography variant="h3" gutterBottom>
          Loading...
        </Typography>
      </Box>
    </Modal>
  );
}
