import { atomsWithQuery } from 'jotai-tanstack-query';
import { GET_USER_LANGUAGES } from './mutationKeys';
import { getLanguagesApi } from '@api/preference/languages/getLanguages.api';
import { userIdAtom } from '@applicationAtoms/app.atom';

const [, getLanguagesQueryAtom] = atomsWithQuery((get) => {
  return {
    queryKey: [GET_USER_LANGUAGES, get(userIdAtom)],
    queryFn: () => {
      return getLanguagesApi();
    },
  };
});

export { getLanguagesQueryAtom };
