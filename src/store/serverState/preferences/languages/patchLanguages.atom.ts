import { atomsWithMutation, queryClientAtom } from 'jotai-tanstack-query';
import { GET_USER_LANGUAGES, PATCH_LANGUAGES } from './mutationKeys';
import { userAtom } from '@applicationAtoms/app.atom';
import { patchLanguagesApi } from '@api/preference/languages/patchLanguages.api';
import { LanguagePayload } from '@utils/types/preference/languages.type';

const [, patchLanguagesAtom] = atomsWithMutation((get) => ({
  mutationKey: [PATCH_LANGUAGES],
  mutationFn: async (payload: LanguagePayload[]) => {
    return patchLanguagesApi(payload);
  },
  onSuccess: async () => {
    await queryClientAtom.init.invalidateQueries([GET_USER_LANGUAGES, get(userAtom)?.attributes.sub as string]);
  },
}));

export { patchLanguagesAtom };
