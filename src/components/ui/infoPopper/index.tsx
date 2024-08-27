import { useEffect, useState } from 'react';
import Popper from '../popper';
import Paper from '../paper';
import Fade from '../animations';
import { Typography } from '../typography';
import { Box, PopperProps } from '@mui/material';

import { styled, alpha } from '../theme';
import { Grid } from '../layout';
import { IconButton } from '../button';
import CloseIcon from '@mui/icons-material/Close';

type InfoPopperProps = {
  anchorEl: HTMLElement | null;
  placement: Extract<PopperProps['placement'], 'bottom' | 'top'>;
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[];
  title: React.ReactNode;
};

const Arrow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '16px',
  height: '16px',
  background: '#fff',
  visibility: 'hidden',

  '&::before': {
    position: 'absolute',
    width: '16px',
    height: '16px',
    background: 'inherit',
    visibility: 'visible',
    content: '""',
    transform: 'rotate(45deg)',
    borderRight: `1px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    boxShadow: `3px 3px 4px 0px ${alpha(theme.palette.common.black, 0.2)}`,
    top: -7,
    zIndex: 0,
  },

  '&[data-popper-placement*="bottom"]': {
    top: 0,
    visibility: 'visible',
    '&::before': {
      transform: 'rotate(-135deg)',
    },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  boxShadow: `0px 2px 8px 0px ${alpha(theme.palette.common.black, 0.2)}`,
  border: `1px solid ${theme.palette.grey[200]}`,
  zIndex: 1,
}));

export default function InfoPopper({ anchorEl, onClose, placement, title, children }: InfoPopperProps) {
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);
  const [openPopper, setOpenPopper] = useState<boolean>(false);
  const [anchorElement, setAnchorEl] = useState<HTMLElement | null>(null);

  const closePopper = () => {
    setOpenPopper(false);
    setAnchorEl(null);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (anchorEl) {
      setAnchorEl(anchorEl);
      setOpenPopper(true);
    } else {
      setAnchorEl(null);
      setOpenPopper(false);
    }
  }, [anchorEl]);

  return (
    <Popper
      open={openPopper}
      anchorEl={anchorElement}
      placement={placement}
      transition
      modifiers={[
        {
          name: 'arrow',
          enabled: true,
          options: {
            element: arrowRef,
          },
        },
        {
          name: 'offset',
          enabled: true,
          options: {
            offset: [0, 20],
          },
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <StyledPaper>
            <Grid item p="16px 26px" width="375px">
              <Grid item display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h4">{title}</Typography>
                <IconButton onClick={closePopper} size="small" sx={{ transform: 'translateX(8px)' }}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Typography variant="body1" component="div">
                {children}
              </Typography>
            </Grid>
            <Arrow ref={setArrowRef} data-popper-placement={placement} />
          </StyledPaper>
        </Fade>
      )}
    </Popper>
  );
}
