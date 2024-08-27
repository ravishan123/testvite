const region = import.meta.env.VITE_REGION as string;
const userPoolId = import.meta.env.VITE_USERPOOL_ID as string;
const userPoolWebClientId = import.meta.env.VITE_USERPOOL_WEB_CLIENT_ID as string;
const domainPrefix = import.meta.env.VITE_DOMAIN_PREFIX as string;
const identityPoolId = import.meta.env.VITE_IDENTITY_POOL_ID as string;
const bucket = import.meta.env.VITE_PROFILE_BUCKET_ARN as string;

const amplifyConfigs = {
  Auth: {
    // (required) only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: identityPoolId,

    // (required)- Amazon Cognito Region
    region: region,

    // (optional) - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    // identityPoolRegion: 'XX-XXXX-X',

    // (optional) - Amazon Cognito User Pool ID
    userPoolId: userPoolId,

    // (optional) - Amazon Cognito Web Client ID (26-char alphanumeric string, App client secret needs to be disabled)
    userPoolWebClientId: userPoolWebClientId,

    // (optional) - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,

    // (optional) - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    // cookieStorage: {
    // - Cookie domain (only required if cookieStorage is provided)
    // domain: '.your domain.com',
    // (optional) - Cookie path
    // path: '/',
    // (optional) - Cookie expiration in days
    // expires: 365,
    // (optional) - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
    // sameSite: 'strict' | 'lax',
    // (optional) - Cookie secure flag
    // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    // secure: true
    // },

    // (optional) - customized storage object
    // storage: MyStorage,

    // (optional) - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    // authenticationFlowType: 'USER_PASSWORD_AUTH',

    // (optional) - Manually set key value pairs that can be passed to Cognito Lambda Triggers
    // clientMetadata: { myCustomKey: 'myCustomValue' },

    // (optional) - Hosted UI configuration
    oauth: {
      domain: `${domainPrefix}.auth.${region}.amazoncognito.com`,
      scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: window.location.origin + '/home',
      redirectSignOut: window.location.origin + '/signin',
      clientId: userPoolWebClientId,
      responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
    },
  },
  Storage: {
    AWSS3: {
      bucket: bucket,
      region: region,
    },
  },
};

export default amplifyConfigs;
