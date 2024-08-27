import { atom } from 'jotai';
import { getAvailabilityRemoteQueryAtom } from './getAvailabilityRemote.atom';
import { Action } from '@utils/types';

const storeAvailabilityRemoteAtom = atom(
  (get) => get(getAvailabilityRemoteQueryAtom),
  (_get, set, action: Action) => {
    return void set(getAvailabilityRemoteQueryAtom, action);
  }
);

export { storeAvailabilityRemoteAtom };
