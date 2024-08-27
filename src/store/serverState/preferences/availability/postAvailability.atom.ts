import { atomsWithMutation, queryClientAtom } from 'jotai-tanstack-query';
import { userAtom } from '@applicationAtoms/app.atom';
import { GET_AVAILABILITY, POST_AVAILABILITY } from './mutationKeys';
import { postAvailabilityApi } from '@api/preference/availability/postAvailability.api';
import { AvailabilityPayload } from '@utils/types/preference/availability.type';

const [, postAvailabilityAtom] = atomsWithMutation((get) => ({
  mutationKey: [POST_AVAILABILITY],
  mutationFn: async (payload: AvailabilityPayload) => {
    return postAvailabilityApi(payload);
  },
  onSuccess: async () => {
    await queryClientAtom.init.invalidateQueries([GET_AVAILABILITY, get(userAtom)?.attributes.sub as string]);
  },
}));

export { postAvailabilityAtom };
