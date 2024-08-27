import { atom } from 'jotai';
import { atomsWithQuery } from 'jotai-tanstack-query';
import { SEARCH_SKILLS } from './mutationKeys';
import { searchSkillsApi } from '@api/preference/skills/searchSkills.api';
import { SkillsApiResponse } from '@utils/types/preference/languages.type';

const searchStringAtom = atom<string>('');

const [, searchSkillsQueryAtom] = atomsWithQuery<SkillsApiResponse | undefined | string[]>((get) => {
  const userInput = get(searchStringAtom);
  return {
    queryKey: [SEARCH_SKILLS, userInput],
    queryFn: () => {
      if (userInput.trim() === '' || userInput.length < 3) return [];
      return searchSkillsApi(userInput);
    },
    keepPreviousData: false,
  };
});

export { searchStringAtom, searchSkillsQueryAtom };
