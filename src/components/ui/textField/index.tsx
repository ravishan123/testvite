import { ClipboardEvent, KeyboardEvent, forwardRef } from 'react';
import MaterialTextField, { TextFieldProps } from '@mui/material/TextField';

type CustomTextFieldProps = TextFieldProps & {
  isValidateInput?: boolean;
  pattern?: string;
};

export const TextField = forwardRef<HTMLInputElement, CustomTextFieldProps>(
  ({ onKeyDown, onPaste, isValidateInput, pattern, ...props }, ref) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      const key = event.key;
      const keyCode = event.keyCode;
      // eslint-disable-next-line no-useless-escape, prettier/prettier
      const isPatternMatched = RegExp(pattern || '^\\d*$').test(key);
      const isAllowedKey = [8, 9, 46, 86, 65].includes(keyCode) || (keyCode >= 33 && keyCode <= 40);

      if (onKeyDown) {
        onKeyDown(event);
      }

      if (isPatternMatched || isAllowedKey) {
        return true;
      }

      event.preventDefault();
      return false;
    };

    const handleOnPaste = (event: ClipboardEvent<HTMLInputElement>) => {
      const clipboardData =
        event.clipboardData || (window as unknown as { clipboardData?: DataTransfer }).clipboardData;
      const pastedData = clipboardData.getData('Text');
      // eslint-disable-next-line no-useless-escape, prettier/prettier
      const isPatternMatched = RegExp(pattern || '^\\d*$').test(pastedData);

      if (onPaste) {
        onPaste(event);
      }

      if (!isPatternMatched) {
        event.preventDefault();
        return false;
      }

      return true;
    };

    return (
      <MaterialTextField
        ref={ref}
        onPaste={isValidateInput ? handleOnPaste : onPaste}
        onKeyDown={isValidateInput ? handleKeyDown : onKeyDown}
        {...props}
      />
    );
  }
);
