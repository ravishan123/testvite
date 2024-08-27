import { atomsWithQuery } from 'jotai-tanstack-query';
import { GET_USER_SKILLS } from './mutationKeys';
import { userIdAtom } from '@applicationAtoms/app.atom';
import { getSkillsApi } from '@api/preference/skills/getSkills.api';

const [, getSkillsQueryAtom] = atomsWithQuery((get) => {
  const userId = get(userIdAtom);
  return {
    queryKey: [GET_USER_SKILLS, userId],
    queryFn: () => {
      return getSkillsApi();
    },
    keepPreviousData: false,
  };
});

export { getSkillsQueryAtom };
