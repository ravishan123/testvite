import { atomsWithMutation } from 'jotai-tanstack-query';
import { PATCH_CAUSES } from './mutationKeys';
import { patchCausesApi } from '@api/preference/causes/patchCauses.api';

interface Props {
  causesList: string[];
}

const [, patchCausesQueryAtom] = atomsWithMutation(() => ({
  mutationKey: [PATCH_CAUSES],
  mutationFn: async (context: Props) => {
    const { causesList } = context;
    return await patchCausesApi(causesList);
  },
}));

export { patchCausesQueryAtom };
