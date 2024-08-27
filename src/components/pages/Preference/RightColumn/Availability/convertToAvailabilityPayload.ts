import { AvailabilityPayload, TimeSlot } from '@utils/types/preference/availability.type';

export const convertToAvailabilityPayload = (slots: Record<string, string[]>): AvailabilityPayload => {
  const payload: AvailabilityPayload = {};

  for (const day in slots) {
    if (Object.prototype.hasOwnProperty.call(slots, day)) {
      const timeSlot: TimeSlot = {
        morning: slots[day].includes('morning'),
        afternoon: slots[day].includes('afternoon'),
        evening: slots[day].includes('evening'),
      };
      payload[day as keyof AvailabilityPayload] = timeSlot;
    }
  }

  return payload;
};
