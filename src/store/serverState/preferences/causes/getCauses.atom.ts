import { atomsWithQuery } from 'jotai-tanstack-query';
import { getCausesApi } from '@api/preference/causes/getCauses.api';

import { GET_CAUSES } from './mutationKeys';
import { userIdAtom } from '@applicationAtoms/app.atom';

const [, getCausesAtom] = atomsWithQuery((get) => ({
  queryKey: [GET_CAUSES, get(userIdAtom)],
  queryFn: async () => {
    return await getCausesApi();
  },
}));

export { getCausesAtom };
