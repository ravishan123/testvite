import { atom } from 'jotai';
import { getLanguagesQueryAtom } from './getLanguages';
import { Action } from '@utils/types';

const storeLanguagesAtom = atom(
  (get) => get(getLanguagesQueryAtom),
  (_get, set, action: Action) => {
    return void set(getLanguagesQueryAtom, action);
  }
);

export { storeLanguagesAtom };
