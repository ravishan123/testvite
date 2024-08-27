import { atomsWithMutation, queryClientAtom } from 'jotai-tanstack-query';
import { userAtom } from '@applicationAtoms/app.atom';
import { GET_AVAILABILITY_REMOTE, POST_AVAILABILITY_REMOTE } from './mutationKeys';
import { postAvailabilityRemoteApi } from '@api/preference/availabilityRemote/postAvailabilityRemote.api';

const [, postAvailabilityRemoteAtom] = atomsWithMutation((get) => ({
  mutationKey: [POST_AVAILABILITY_REMOTE],
  mutationFn: async (payload: boolean) => {
    return postAvailabilityRemoteApi(payload);
  },
  onSuccess: async () => {
    await queryClientAtom.init.invalidateQueries([GET_AVAILABILITY_REMOTE, get(userAtom)?.attributes.sub as string]);
  },
}));

export { postAvailabilityRemoteAtom };
