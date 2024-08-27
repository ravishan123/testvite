import { Grid } from '@mui/material';
import AuthContainer from '@layouts/containers/authContainer';
import GudPplIcon from '@ui/icons/GudPplIcon';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import VerifyForgetPassword from './VerifyForgetPassword';
import AddNewPassword from './AddNewPassword';
import { ResetPasswordForm } from './ResetPasswordForm';
import { IFormInput } from './interfaces';
import { useSnackbar } from '@ui/snackBar';
import { useAtom } from 'jotai';
import { forgotPasswordMutationAtom } from '@serverAtoms/auth/forgotPassword.atom';

interface ForgotPasswordProps {
  newPassword: string;
}
interface ErrorData {
  message: string;
  name: string;
  code?: string;
}

const STEP_RESET_PASSWORD = 1;
const STEP_VERIFY_FORGET_PASSWORD = 2;
const STEP_ADD_NEW_PASSWORD = 3;

export default function ForgetPassword() {
  const { openSnackbar } = useSnackbar();
  const [addNewPasswordLoading, setAddNewPasswordLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IFormInput>();

  const [step, setStep] = useState(1);
  const [code, setCode] = useState<string>('');
  const navigate = useNavigate();

  const email = watch('email');

  const handleError = (reason: Error | ErrorData) => {
    const error = reason as unknown as { name?: string; message?: string; code?: string };
    if (error.code === 'UserNotFoundException') {
      openSnackbar('We cannot find your Email', 'error');
    } else if (
      decodeURIComponent(error.message || '') ===
      'Cannot reset password for the user as there is no registered/verified email or phone_number'
    ) {
      openSnackbar('Email is not verified', 'error');
    } else if (error.code === 'CodeMismatchException') {
      openSnackbar('Incorrect verification code. Please try again', 'error');
      setStep(STEP_VERIFY_FORGET_PASSWORD);
    } else if (error.code === 'LimitExceededException') {
      openSnackbar('Attempt limit exceeded. Please try after some time', 'error');
    } else if (error.name === 'ExpiredCodeException') {
      openSnackbar('Code expired. Please request a new one', 'error');
      setStep(STEP_RESET_PASSWORD);
    } else if (error.name === 'ExternalProviderError') {
      openSnackbar(
        error.message || 'You cannot reset your password as you have logged in using a social account.',
        'error'
      );
      setStep(STEP_RESET_PASSWORD);
    } else {
      openSnackbar('Something went wrong. Please try again', 'error');
    }
  };

  const [forgotPasswordAtom, forgotPasswordMutate] = useAtom(forgotPasswordMutationAtom);

  const sendResetPasswordEmail = (data: IFormInput) => {
    if (!data.email) {
      setStep(STEP_RESET_PASSWORD);
      return openSnackbar('Email is required', 'error');
    }
    forgotPasswordMutate([data.email])
      .then(() => {
        setStep(STEP_VERIFY_FORGET_PASSWORD);
        openSnackbar('Verification code sent to your email', 'success');
      })
      .catch((err) => {
        handleError(err as Error | ErrorData);
      });
  };

  const addVerificationCode = (code: string) => {
    setCode(code);
    setStep(STEP_ADD_NEW_PASSWORD);
  };

  const forgotPasswordSubmit = ({ newPassword }: ForgotPasswordProps) => {
    if (!email) {
      setStep(STEP_RESET_PASSWORD);
      return openSnackbar('Email is required', 'error');
    }
    setAddNewPasswordLoading(true);
    Auth.forgotPasswordSubmit(email, code, newPassword)
      .then(() => {
        openSnackbar('Your password was reset successfully', 'success');
        navigate('/signin');
      })
      .catch(handleError);
    setAddNewPasswordLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case STEP_RESET_PASSWORD:
        return (
          <ResetPasswordForm
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={sendResetPasswordEmail}
            email={email || ''}
            isLoading={forgotPasswordAtom.isLoading}
          />
        );
      case STEP_VERIFY_FORGET_PASSWORD:
        return (
          <VerifyForgetPassword
            email={email || ''}
            addVerificationCode={addVerificationCode}
            sendResetPasswordEmail={sendResetPasswordEmail}
          />
        );
      case STEP_ADD_NEW_PASSWORD:
        return (
          <AddNewPassword
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            email={email || ''}
            forgotPasswordSubmit={forgotPasswordSubmit}
            watch={watch}
            loading={addNewPasswordLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthContainer
      rightColumn={
        <Grid maxWidth={350}>
          <GudPplIcon mb="40px" />
          {renderStep()}
        </Grid>
      }
    />
  );
}
