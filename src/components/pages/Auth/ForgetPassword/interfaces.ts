import { Control, FieldErrors, UseFormHandleSubmit, UseFormWatch } from 'react-hook-form';
export interface IFormInput {
  email?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
export interface ResetPasswordFormProps {
  control: Control<IFormInput>;
  errors: FieldErrors;
  handleSubmit: UseFormHandleSubmit<IFormInput>;
  onSubmit: (data: IFormInput) => void;
  email: string;
  isLoading: boolean;
}
export interface VerifyForgetPasswordProps {
  email: string;
  addVerificationCode: (code: string) => void;
  sendResetPasswordEmail: (data: IFormInput) => void;
}

export interface ForgotPasswordProps {
  newPassword: string;
}
export interface AddNewPasswordProps {
  control: Control<IFormInput>;
  errors: FieldErrors;
  handleSubmit: UseFormHandleSubmit<IFormInput>;
  email: string;
  forgotPasswordSubmit: ({ newPassword }: ForgotPasswordProps) => void;
  watch: UseFormWatch<IFormInput>;
  loading: boolean;
}
