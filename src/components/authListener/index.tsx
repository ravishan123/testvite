import { useEffect } from 'react';
import { Hub } from 'aws-amplify';
import { useSnackbar } from '@ui/snackBar';

import { AMPLIFY_AUTH_EVENTS } from '@constants/amplifyAuthEvents';

type PayloadData = {
  message: string;
  codeDeliveryDetails: {
    DeliveryMedium: string;
  };
  user: {
    username: string;
  };
};

export type HubCapsule = {
  channel: string;
  payload: HubPayload;
  source: string;
  patternInfo?: string[];
};

export type HubPayload = {
  event: string;
  data?: PayloadData;
  message?: string;
};

const AuthListener = () => {
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    const listener = (data: HubCapsule) => {
      switch (data.payload.event) {
        case AMPLIFY_AUTH_EVENTS.CONFIGURED:
          break;
        case AMPLIFY_AUTH_EVENTS.SIGN_IN:
          break;
        case AMPLIFY_AUTH_EVENTS.SIGN_IN_FAILURE: {
          const message = decodeURIComponent(data.payload?.data?.message?.replace?.(/\+/g, ' ') || '');

          openSnackbar(
            message.includes('PreAuthentication failed with error ')
              ? message.replace('PreAuthentication failed with error ', '').replace('SignInWithApple', 'Apple')
              : message,
            'error'
          );
          break;
        }
        case AMPLIFY_AUTH_EVENTS.SIGN_UP: {
          if (data.payload?.data?.codeDeliveryDetails.DeliveryMedium === 'EMAIL') {
            openSnackbar(
              `We’ve sent you an email to ${
                data.payload?.data?.user.username || ''
              }. Please enter verification code in the field below to verify your account`,
              'success'
            );
          }
          break;
        }
        case AMPLIFY_AUTH_EVENTS.SIGN_UP_FAILURE: {
          const message = decodeURIComponent(data.payload?.data?.message.replace(/\+/g, ' ') || '');
          openSnackbar(
            decodeURIComponent(message).includes('PreSignUp failed with error ')
              ? message.replace('PreSignUp failed with error ', '').replace('SignInWithApple', 'Apple')
              : message,
            'error'
          );
          break;
        }
        case AMPLIFY_AUTH_EVENTS.CONFIRM_SIGN_UP: {
          openSnackbar(data.payload?.data?.message || '', 'success');
          break;
        }
        case AMPLIFY_AUTH_EVENTS.COMPLETE_NEW_PASSWORD_FAILURE:
          break;
        case AMPLIFY_AUTH_EVENTS.AUTO_SIGN_IN:
          break;
        case AMPLIFY_AUTH_EVENTS.AUTO_SIGN_IN_FAILURE:
          break;
        case AMPLIFY_AUTH_EVENTS.FORGOT_PASSWORD:
          break;
        case AMPLIFY_AUTH_EVENTS.FORGOT_PASSWORD_FAILURE:
          break;
        case AMPLIFY_AUTH_EVENTS.FORGOT_PASSWORD_SUBMIT:
          break;
        case AMPLIFY_AUTH_EVENTS.FORGOT_PASSWORD_SUBMIT_FAILURE:
          break;
        case AMPLIFY_AUTH_EVENTS.VERIFY:
          break;
        case AMPLIFY_AUTH_EVENTS.TOKEN_REFRESH:
          break;
        case AMPLIFY_AUTH_EVENTS.TOKEN_REFRESH_FAILURE:
          break;
        case AMPLIFY_AUTH_EVENTS.COGNITO_HOSTED_UI: {
          openSnackbar('Sign in successful', 'success');
          break;
        }
        case AMPLIFY_AUTH_EVENTS.COGNITO_HOSTED_UI_FAILURE: {
          const message = decodeURIComponent(data.payload?.data?.message.replace(/\+/g, ' ') || '');
          openSnackbar(
            message.includes('PreSignUp failed with error ')
              ? message.replace('PreSignUp failed with error ', '').replace('SignInWithApple', 'Apple')
              : message,
            'error'
          );
          break;
        }
        case AMPLIFY_AUTH_EVENTS.CUSTOM_OAUTH_STATE:
          break;
        case AMPLIFY_AUTH_EVENTS.CUSTOM_STATE_FAILURE:
          break;
        case AMPLIFY_AUTH_EVENTS.PARSING_CALLBACK_URL:
          break;
        case AMPLIFY_AUTH_EVENTS.USER_DELETED:
          break;
        case AMPLIFY_AUTH_EVENTS.UPDATE_USER_ATTRIBUTES:
          break;
        case AMPLIFY_AUTH_EVENTS.UPDATE_USER_ATTRIBUTES_FAILURE:
          break;
        case AMPLIFY_AUTH_EVENTS.SIGN_OUT:
          break;
      }
    };

    const listenCallback = Hub.listen('auth', listener);

    return () => {
      listenCallback();
    };
  }, [openSnackbar]);

  return null;
};

export default AuthListener;
