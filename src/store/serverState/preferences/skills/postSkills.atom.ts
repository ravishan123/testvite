import { postSkillsApi } from '@api/preference/skills/postSkills.api';
import { atomsWithMutation, queryClientAtom } from 'jotai-tanstack-query';
import { GET_USER_SKILLS, POST_SKILLS } from './mutationKeys';
import { userAtom } from '@applicationAtoms/app.atom';
import { Skill, SkillWithoutId } from '@utils/types/preference/languages.type';

const [, postSkillsAtom] = atomsWithMutation((get) => ({
  mutationKey: [POST_SKILLS],
  mutationFn: async (payload: Skill[] | SkillWithoutId[]) => {
    return postSkillsApi(payload);
  },
  onSuccess: async () => {
    await queryClientAtom.init.invalidateQueries([GET_USER_SKILLS, get(userAtom)?.attributes.sub as string]);
  },
}));

export { postSkillsAtom };
