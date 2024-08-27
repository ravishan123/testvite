import { atomsWithMutation, queryClientAtom } from 'jotai-tanstack-query';
import { GET_USER_LANGUAGES, POST_USER_LANGUAGES } from './mutationKeys';
import { postLanguagesApi } from '@api/preference/languages/postLanguages.api';
import { userAtom } from '@applicationAtoms/app.atom';
import { LanguagePayload } from '@utils/types/preference/languages.type';

const [, postLanguagesAtom] = atomsWithMutation((get) => ({
  mutationKey: [POST_USER_LANGUAGES],
  mutationFn: async (payload: LanguagePayload[]) => {
    return postLanguagesApi(payload);
  },
  onSuccess: async () => {
    await queryClientAtom.init.invalidateQueries([GET_USER_LANGUAGES, get(userAtom)?.attributes.sub as string]);
  },
}));

export { postLanguagesAtom };
