export type AuthProviders = {
  [key: string]: string;
};

export const authProviders: AuthProviders = {
  GOOGLE: 'Google',
  FACEBOOK: 'Facebook',
  AMAZON: 'amazon',
  APPLE: 'SignInWithApple',
  COGNITO: 'COGNITO',
};

export enum AMPLIFY_AUTH_EVENTS {
  SIGN_IN = 'signIn',
  SIGN_IN_FAILURE = 'signIn_failure',
  SIGN_UP = 'signUp',
  SIGN_UP_FAILURE = 'signUp_failure',
  CONFIRM_SIGN_UP = 'confirmSignUp',
  COMPLETE_NEW_PASSWORD_FAILURE = 'completeNewPassword_failure',
  AUTO_SIGN_IN = 'autoSignIn',
  AUTO_SIGN_IN_FAILURE = 'autoSignIn_failure',
  FORGOT_PASSWORD = 'forgotPassword',
  FORGOT_PASSWORD_FAILURE = 'forgotPassword_failure',
  FORGOT_PASSWORD_SUBMIT = 'forgotPasswordSubmit',
  FORGOT_PASSWORD_SUBMIT_FAILURE = 'forgotPasswordSubmit_failure',
  VERIFY = 'verify',
  CONFIGURED = 'configured',
  TOKEN_REFRESH = 'tokenRefresh',
  TOKEN_REFRESH_FAILURE = 'tokenRefresh_failure',
  COGNITO_HOSTED_UI = 'cognitoHostedUI',
  COGNITO_HOSTED_UI_FAILURE = 'cognitoHostedUI_failure',
  CUSTOM_OAUTH_STATE = 'customOAuthState',
  CUSTOM_STATE_FAILURE = 'customState_failure',
  PARSING_CALLBACK_URL = 'parsingCallbackUrl',
  USER_DELETED = 'userDeleted',
  UPDATE_USER_ATTRIBUTES = 'updateUserAttributes',
  UPDATE_USER_ATTRIBUTES_FAILURE = 'updateUserAttributes_failure',
  SIGN_OUT = 'signOut',
}
