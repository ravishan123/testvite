import { CustomCognitoUser } from '@api/Auth/auth';
import { atom } from 'jotai';
import countries from '@utils/data/countries.data';

export type LoadableFetchUser = {
  state: 'loading' | 'hasData' | 'hasError';
  data?: CustomCognitoUser;
  error?: string | unknown;
};

export const userAtom = atom<CustomCognitoUser | null>(null);

export const userIdAtom = atom<string>((get) => {
  const user = get(userAtom);
  return user?.attributes?.sub || '';
});

export const userEmailAtom = atom<string>((get) => {
  const user = get(userAtom);
  return user?.attributes?.email || '';
});

export const phoneCodesAtom = atom<string[]>(() => {
  return countries.map((country) => country.dial_code);
});
