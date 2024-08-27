export type Availability = {
  afternoon: boolean;
  evening: boolean;
  morning: boolean;
  weekday: string;
};

export type RemoteAvailability = {
  remoteAvailability: boolean;
};

export interface TimeSlot {
  morning?: boolean;
  evening?: boolean;
  afternoon?: boolean;
}

export interface AvailabilityPayload {
  sunday?: TimeSlot;
  monday?: TimeSlot;
  tuesday?: TimeSlot;
  wednesday?: TimeSlot;
  thursday?: TimeSlot;
  friday?: TimeSlot;
  saturday?: TimeSlot;
}

export interface AvailabilityActionProps {
  handleNextStep: (isUpdated?: boolean) => void;
  handleBackStep: () => void;
  handleComplete: () => void;
}

export interface GetAvailabilityAPIResponseObject {
  afternoon: boolean;
  evening: boolean;
  morning: boolean;
  weekday: string;
}

export interface GetAvailabilityAPIResponse {
  data: GetAvailabilityAPIResponseObject[];
  isAvailability: boolean;
  message?: string;
}

export interface GetAvailabilityRemoteAPIResponse {
  data: { availability: boolean };
  message?: string;
}
