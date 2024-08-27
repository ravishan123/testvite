import { Cause } from './preference/causes.type';
import { Skills } from './preference/skills.type';
import { UNSDG } from './preference/unsdg.type';

export type ActivityStatus = 'APPROVED' | 'PENDING' | 'DECLINED' | 'PROCESSED' | 'AMENDED' | undefined;

export interface UserDetails {
  firstName: string;
  lastName: string;
  id: string;
}

export interface Organization {
  name: string | null;
  logo: string | null;
}

export interface VolunteerHour {
  hours: number;
  minutes: number;
}

export interface ActivityLocation {
  city: string;
  country: string;
  state?: string;
  address1?: string;
  address2?: string;
  postalCode?: string;
}

export interface Activity {
  id: string;
  organizationName: string;
  organizationId: string;
  status: ActivityStatus;
  hours: string;
  minutes: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  activityDescription: string;
  createdAt: string;
  date: string;
  logo: string;
}

export interface CoordinatorDetails {
  ownerName: string;
  ownerEmail: string;
}

export interface ActivityData {
  id: string;
  amendReason: string | null;
  declineReason: string | null;
  userDetails: UserDetails;
  organization: Organization;
  startDate: string;
  endDate: string;
  volunteerHour: VolunteerHour;
  activityDescription: string;
  activityLocation: ActivityLocation;
  causes: Cause[];
  unsdgs: UNSDG[];
  skills: Skills;
  status: string;
  coordinatorDetails: CoordinatorDetails;
  orgId?: string;
  isRemote?: boolean;
}
