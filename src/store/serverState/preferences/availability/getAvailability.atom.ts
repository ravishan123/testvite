import { atomsWithQuery } from 'jotai-tanstack-query';
import { GET_AVAILABILITY } from './mutationKeys';
import { userIdAtom } from '@applicationAtoms/app.atom';
import { getAvailabilityApi } from '@api/preference/availability/getAvailability.api';
import { TimeSlot } from '@utils/types/preference/availability.type';

const [, getAvailabilityQueryAtom] = atomsWithQuery((get) => {
  const userId = get(userIdAtom);
  return {
    queryKey: [GET_AVAILABILITY, userId],
    queryFn: async () => {
      const availability = (await getAvailabilityApi())?.data;

      const filteredAvailability =
        availability && Array.isArray(availability)
          ? availability.filter((day: TimeSlot) => day?.morning || day?.afternoon || day?.evening)
          : availability;

      const isAvailabilityFilled = availability && availability?.length > 0 ? true : false;

      return { data: filteredAvailability, isAvailability: isAvailabilityFilled };
    },
    keepPreviousData: false,
    suspense: true,
  };
});

export { getAvailabilityQueryAtom };
