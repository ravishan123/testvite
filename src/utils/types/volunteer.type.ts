import { ActivityApprovalStatusEnum } from '@utils/enums/activity.enum';

import { Skill } from './preference/languages.type';
import { Org } from './organization.type';

export type AddHoursForm = {
  date: {
    startDate: Date | null;
    endDate: Date | null;
  };
  duration: {
    hours: number;
    minutes: number;
  };
  activityDescription: string;
  activityLocation: {
    address1: string;
    address2: string;
    postalCode: string;
    state: string;
    city: string;
    country: string;
  };
  isRemote: boolean;
  coordinator: {
    email: string;
    name: string;
  };
  organization: Org | null;
  skills: (string | Skill)[];
  unsdgs: string[];
  causes: string[];
};

export type AddHoursPayload = {
  startDate: string | null;
  endDate: string | null;
  hours: number;
  minutes: number;
  activityDescription: string;
  activityLocation?: {
    address1?: string;
    address2?: string;
    postalCode?: string;
    state?: string;
    city: string;
    country: string;
  };
  isRemote?: boolean;
  coordinator: {
    email?: string;
    name: string;
  };
  orgId?: string;
  organizationName: string;
  skills?: {
    defaultSkills?: string[];
    customSkills?: { skill: string }[];
  };
  unsdgs: string[];
  causes: string[];
};

export type VerifyActivityPayload = {
  requestId: string;
  orgId: string;
  approvalState: ActivityApprovalStatusEnum;
  processDetails?: Partial<AddHoursPayload> & {
    declinedReason?: string;
    amendedReason?: string;
  };
};
