import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import AppleIcon from '@ui/icons/AppleIcon';
import FacebookIcon from '@ui/icons/FacebookIcon';
import GoogleIcon from '@ui/icons/GoogleIcon';

export const providers = [
  { name: 'Google', icon: GoogleIcon, provider: CognitoHostedUIIdentityProvider.Google },
  { name: 'Facebook', icon: FacebookIcon, provider: CognitoHostedUIIdentityProvider.Facebook },
  { name: 'Apple', icon: AppleIcon, provider: CognitoHostedUIIdentityProvider.Apple },
];
