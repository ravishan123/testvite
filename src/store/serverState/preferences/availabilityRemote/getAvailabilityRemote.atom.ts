import { atomsWithQuery } from 'jotai-tanstack-query';
import { GET_AVAILABILITY_REMOTE } from './mutationKeys';
import { userIdAtom } from '@applicationAtoms/app.atom';
import { getAvailabilityRemoteApi } from '@api/preference/availabilityRemote/getAvailabilityRemote.api';

const [, getAvailabilityRemoteQueryAtom] = atomsWithQuery((get) => {
  const userId = get(userIdAtom);
  return {
    queryKey: [GET_AVAILABILITY_REMOTE, userId],
    queryFn: async () => {
      return await getAvailabilityRemoteApi();
    },
    keepPreviousData: false,
  };
});

export { getAvailabilityRemoteQueryAtom };
