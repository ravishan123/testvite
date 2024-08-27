/**
 * @description This function listens to auth events which are not covered by the Auth component
 * @returns message popup with the event message using the createMessagePopup function from @ui/snackBarWithOutHooks
 */
import { AMPLIFY_AUTH_EVENTS } from '@constants/amplifyAuthEvents';
import { createMessagePopup } from '@ui/snackBarWithOutHooks';
import { Hub } from 'aws-amplify';
import { HubCapsule } from 'src/components/authListener';

function listenToAuthEvents(): void {
  const listener = (data: HubCapsule) => {
    switch (data.payload.event) {
      case AMPLIFY_AUTH_EVENTS.SIGN_IN_FAILURE:
        {
          const message =
            (data.payload.data && decodeURIComponent(data.payload.data.message.replace(/\+/g, ' '))) || '';
          if (message.replace(/\+/g, ' ').includes('PreAuthentication failed with error ')) {
            createMessagePopup({
              message: message.replace('PreAuthentication failed with error ', '').replace('SignInWithApple', 'Apple'),
              type: 'error',
            });
          }
        }
        break;
      case AMPLIFY_AUTH_EVENTS.COGNITO_HOSTED_UI_FAILURE:
        {
          const message =
            (data.payload.data && decodeURIComponent(data.payload.data.message.replace(/\+/g, ' '))) || '';
          if (message.includes('PreSignUp failed with error ')) {
            createMessagePopup({
              message: message.replace('PreSignUp failed with error ', '').replace('SignInWithApple', 'Apple'),
              type: 'error',
            });
          }
        }
        break;
    }
  };

  Hub.listen('auth', listener);
}

export { listenToAuthEvents };
