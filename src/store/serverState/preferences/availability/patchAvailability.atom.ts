import { atomsWithMutation, queryClientAtom } from 'jotai-tanstack-query';
import { userAtom } from '@applicationAtoms/app.atom';
import { GET_AVAILABILITY, PATCH_AVAILABILITY } from './mutationKeys';
import { patchAvailabilityApi } from '@api/preference/availability/patchAvailability.api';
import { AvailabilityPayload } from '@utils/types/preference/availability.type';

const [, patchAvailabilityAtom] = atomsWithMutation((get) => ({
  mutationKey: [PATCH_AVAILABILITY],
  mutationFn: async (payload: AvailabilityPayload) => {
    return patchAvailabilityApi(payload);
  },
  onSuccess: async () => {
    await queryClientAtom.init.invalidateQueries([GET_AVAILABILITY, get(userAtom)?.attributes.sub as string]);
  },
}));

export { patchAvailabilityAtom };
