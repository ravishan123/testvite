import { atomsWithQuery } from 'jotai-tanstack-query';
import { SEARCH_LANGUAGES } from './mutationKeys';
import { atom } from 'jotai';
import { searchLanguagesApi } from '@api/preference/languages/searchLanguages.api';
import { LanguageResponse } from '@utils/types/preference/languages.type';

const searchStringAtom = atom<string>('');

const [, searchLanguagesQueryAtom] = atomsWithQuery<LanguageResponse | undefined | string[]>((get) => {
  const userInput = get(searchStringAtom);
  return {
    queryKey: [SEARCH_LANGUAGES, userInput],
    queryFn: () => {
      if (userInput.trim() === '' || userInput.length < 0) return [];
      return searchLanguagesApi(userInput);
    },
    keepPreviousData: false,
  };
});

export { searchStringAtom, searchLanguagesQueryAtom };
