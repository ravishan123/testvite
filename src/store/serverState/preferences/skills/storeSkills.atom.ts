import { atom } from 'jotai';
import { getSkillsQueryAtom } from './getSkills';
import { Action } from '@utils/types';

const storeSkillsAtom = atom(
  (get) => get(getSkillsQueryAtom),
  (_get, set, action: Action) => {
    return void set(getSkillsQueryAtom, action);
  }
);

export { storeSkillsAtom };
