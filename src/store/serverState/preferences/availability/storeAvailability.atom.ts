import { atom } from 'jotai';
import { getAvailabilityQueryAtom } from './getAvailability.atom';
import { Action } from '@utils/types';

const storeAvailabilityAtom = atom(
  (get) => get(getAvailabilityQueryAtom),
  (_get, set, action: Action) => {
    return void set(getAvailabilityQueryAtom, action);
  }
);

export { storeAvailabilityAtom };
