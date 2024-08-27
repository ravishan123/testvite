import React, { forwardRef } from 'react';
import { Modal, ModalProps } from '@ui/modal';
import { styled, useTheme } from '@ui/theme';
import { IconButton } from '@ui/button';
import { Close } from '@ui/icons';
import { Typography } from '@ui/typography';
import { Box } from '@ui/layout';

interface CustomModalProps extends ModalProps {
  title?: string;
  width?: number;
  height?: number;
  footerContent?: React.ReactNode;
  isTitleSeparate?: boolean;
  iconButtonType?: 'fill' | undefined;
  maxHeightEnable?: boolean; // New prop to control maxHeight
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
  display: 'flex',
  flexDirection: 'column',
  outline: 'none',
  borderRadius: '8px',
}));

const CustomModal = forwardRef<HTMLDivElement, CustomModalProps>(
  (
    {
      title,
      width,
      height,
      footerContent,
      onClose,
      children,
      isTitleSeparate = true,
      iconButtonType,
      maxHeightEnable,
      ...props
    },
    ref
  ) => {
    const { palette, spacing } = useTheme();

    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onClose) {
        onClose(event, 'backdropClick');
      }
    };

    return (
      <Modal ref={ref} {...props}>
        <ModalContent width={width} height={height}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            borderBottom={isTitleSeparate ? `1px solid ${palette.grey[100]}` : 0}
            p={spacing(0, 3, 1)}
          >
            <Typography variant="h4">{title}</Typography>
            <IconButton
              sx={{
                backgroundColor: iconButtonType === 'fill' ? palette.grey[100] : palette.common.white,
              }}
              aria-label="close"
              onClick={handleClose}
              size="small"
            >
              <Close />
            </IconButton>
          </Box>

          {/* Main Content */}
          <Box
            p={spacing(0, 3, 0)}
            sx={{
              flexGrow: 1, // Allow the content area to grow and take up the remaining space
              overflowY: maxHeightEnable ? 'auto' : 'none', // Enable vertical scroll
              ...(maxHeightEnable ? { maxHeight: 'calc(100vh - 200px)' } : {}), // Conditionally apply maxHeight
            }}
          >
            {children}
          </Box>

          {/* Footer */}
          <Box display="flex" justifyContent="flex-end" alignItems="flex-end" m={spacing(1, 0, 0)} p={spacing(2, 3, 2)}>
            {footerContent}
          </Box>
        </ModalContent>
      </Modal>
    );
  }
);

export default CustomModal;
