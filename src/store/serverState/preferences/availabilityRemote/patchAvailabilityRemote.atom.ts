import { atomsWithMutation, queryClientAtom } from 'jotai-tanstack-query';
import { userAtom } from '@applicationAtoms/app.atom';
import { GET_AVAILABILITY_REMOTE, PATCH_AVAILABILITY_REMOTE } from './mutationKeys';
import { patchAvailabilityRemoteApi } from '@api/preference/availabilityRemote/patchAvailabilityRemote.api';

const [, patchAvailabilityRemoteAtom] = atomsWithMutation((get) => ({
  mutationKey: [PATCH_AVAILABILITY_REMOTE],
  mutationFn: async (payload: boolean) => {
    return patchAvailabilityRemoteApi(payload);
  },
  onSuccess: async () => {
    await queryClientAtom.init.invalidateQueries([GET_AVAILABILITY_REMOTE, get(userAtom)?.attributes.sub as string]);
  },
}));

export { patchAvailabilityRemoteAtom };
