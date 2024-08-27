import { ReactNode } from 'react';

import { Grid } from '@ui/layout';
import { Button, ButtonProps } from '@ui/button';
import { Typography } from '@ui/typography';

import ConfirmModal, { CustomModalProps } from './confirmModal';

type ButtonPropsWithLoading = ButtonProps & {
  loading?: boolean;
};
type ConfirmDialogProps = Omit<CustomModalProps, 'children'> & {
  open: boolean;
  title: string;
  description: string | ReactNode;
  confirmButton: ButtonPropsWithLoading &
    ButtonProps & {
      text: string;
      onClick: () => void;
    };
  cancelButton: ButtonPropsWithLoading &
    ButtonProps & {
      text: string;
      onClick: () => void;
    };
  isReverseFooterButtons?: boolean;
};

export default function ConfirmDialog({
  open = false,
  title,
  description,
  confirmButton = {
    text: 'Confirm',
    variant: 'contained',
    color: 'primary',
    onClick: () => undefined,
  },
  cancelButton = {
    text: 'Cancel',
    variant: 'outlined',
    color: 'secondary',
    onClick: () => undefined,
  },
  isReverseFooterButtons = false,
  ...props
}: ConfirmDialogProps) {
  const { text: confirmText, ...confirmButtonProps } = confirmButton;
  const { text: cancelText, ...cancelButtonProps } = cancelButton;

  return (
    <ConfirmModal
      open={open}
      {...props}
      footerContent={
        <Grid
          item
          xs={12}
          display="flex"
          sx={{ flexDirection: { xs: isReverseFooterButtons ? 'row-reverse' : 'row' } }}
          columnGap={1}
        >
          {cancelButton && (
            <Button fullWidth {...cancelButtonProps}>
              {cancelText}
            </Button>
          )}
          {confirmButton && (
            <Button fullWidth {...confirmButtonProps}>
              {confirmText}
            </Button>
          )}
        </Grid>
      }
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body4">{description}</Typography>
        </Grid>
      </Grid>
    </ConfirmModal>
  );
}
