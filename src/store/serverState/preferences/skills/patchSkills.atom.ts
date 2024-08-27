import { atomsWithMutation, queryClientAtom } from 'jotai-tanstack-query';
import { GET_USER_SKILLS, PATCH_SKILLS } from './mutationKeys';
import { patchSkillsApi } from '@api/preference/skills/patchSkills.api';
import { userAtom } from '@applicationAtoms/app.atom';
import { Skill } from '@utils/types/preference/languages.type';

const [, patchSkillsAtom] = atomsWithMutation((get) => ({
  mutationKey: [PATCH_SKILLS],
  mutationFn: async (payload: Skill[]) => {
    return patchSkillsApi(payload);
  },
  onSuccess: async () => {
    await queryClientAtom.init.invalidateQueries([GET_USER_SKILLS, get(userAtom)?.attributes.sub as string]);
  },
}));

export { patchSkillsAtom };
