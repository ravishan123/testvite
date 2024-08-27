import React, { forwardRef } from 'react';
import { Modal, ModalProps } from '@ui/modal';
import { styled, useTheme } from '@ui/theme';
import { IconButton } from '@ui/button';
import { Close } from '@ui/icons';
import { Box } from '@ui/layout';

export interface CustomModalProps extends ModalProps {
  width?: number;
  height?: number;
  footerContent?: React.ReactNode;
}
interface ModalContentProps {
  width?: number;
  height?: number;
}

const ModalContent = styled('div')<ModalContentProps>(({ theme, width, height }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  border: 'none',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(1.5, 0, 0),
  width: width ? `${width}px` : 'auto',
  height: height ? `${height}px` : 'auto',
  overflow: 'auto',
  outline: 'none',
  borderRadius: '16px',
}));

const ConfirmModal = forwardRef<HTMLDivElement, CustomModalProps>(
  ({ width, height, footerContent, onClose, children, ...props }, ref) => {
    const { palette, spacing } = useTheme();
    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onClose) {
        onClose(event, 'backdropClick');
      }
    };

    return (
      <Modal closeAfterTransition ref={ref} {...props}>
        <ModalContent width={width} height={height}>
          <Box display="flex" justifyContent="flex-end" mb={2} pt={1} pr={2} alignItems="center">
            <IconButton sx={{ bgcolor: palette.grey[400] }} aria-label="close" onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
          <Box p={spacing(0, 6, 0)} display="flex" justifyContent="center" alignItems="center" textAlign="center">
            {children}
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" m={spacing(1, 0, 0)} p={spacing(4, 4, 5, 4)}>
            {footerContent}
          </Box>
        </ModalContent>
      </Modal>
    );
  }
);

export default ConfirmModal;
