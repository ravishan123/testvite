import { atomsWithMutation } from 'jotai-tanstack-query';
import { CAUSES } from './mutationKeys';
import { postCausesApi } from '@api/preference/causes/postCauses.api';

interface Props {
  causesList: string[];
}

const [, postCausesQueryAtom] = atomsWithMutation(() => ({
  mutationKey: [CAUSES],
  mutationFn: async (context: Props) => {
    const { causesList } = context;
    return await postCausesApi(causesList);
  },
}));

export { postCausesQueryAtom };
