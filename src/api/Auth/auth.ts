import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';

export interface CustomCognitoUser extends Partial<CognitoUser> {
  attributes: {
    [key: string]: string;
    sub: string;
  };
}

export const getAuthenticatedUser = async (): Promise<CustomCognitoUser> => {
  return Auth.currentAuthenticatedUser() as Promise<ReturnType<typeof Auth.currentAuthenticatedUser>>;
};
