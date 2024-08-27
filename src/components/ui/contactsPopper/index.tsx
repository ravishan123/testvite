import { useEffect, useState } from 'react';
import Popper from '../popper';
import Paper from '../paper';
import Fade from '../animations';
import { Typography } from '../typography';
import { PopperProps } from '@mui/material';
import { ClickAwayListener } from '@mui/material';

import { styled, alpha, theme } from '../theme';
import { Grid } from '../layout';

type ContactsPopperProps = {
  anchorEl: HTMLElement | null;
  placement: Extract<PopperProps['placement'], 'bottom' | 'top'>;
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[];
  title: React.ReactNode;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  boxShadow: `0px 2px 8px 0px ${alpha(theme.palette.common.black, 0.2)}`,
  border: `1px solid ${theme.palette.grey[200]}`,
  zIndex: 1,
}));

export default function ContactsPopper({ anchorEl, onClose, placement, title, children }: ContactsPopperProps) {
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
    <ClickAwayListener onClickAway={closePopper}>
      <Popper
        open={openPopper}
        anchorEl={anchorElement}
        placement={placement}
        transition
        modifiers={[
          {
            name: 'offset',
            enabled: true,
            options: {
              offset: [-150, -145],
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <StyledPaper>
              <Grid item p="6px 16px" width="280px">
                <Grid item display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="body4" sx={{ color: theme.palette.text.secondary }}>
                    {title}
                  </Typography>
                </Grid>

                <Typography variant="body4" component="div">
                  {children}
                </Typography>
              </Grid>
            </StyledPaper>
          </Fade>
        )}
      </Popper>
    </ClickAwayListener>
  );
}
