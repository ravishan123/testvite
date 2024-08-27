export type Organization = {
  id: string;
  name: string;
  social_enterprise: boolean;
  about_us: string;
  country: string;
  city: string;
  logo: string;
  phone_number: string;
  website: string;
  social_link: string;
  created_at: Date;
  orgtype: string;
  custom_orgtype: string | null;
  number_of_employees: string;
  causes: string[];
  sdgs: string[];
  user_info?: {
    isDonor: boolean;
    isVolunteer: boolean;
    role: string;
  } | null;
  organizationType?: {
    custom_orgtype: string | null;
    id: string;
    isCustom: boolean;
    orgtype: string;
  };

  numberOfEmployees?: { id: string; category: string };
};
export type MyOrganizations = {
  data: {
    id: string;
    name: string;
    social_enterprise: boolean;
    about_us: string;
    country: string;
    city: string;
    logo: string;
    phone_number: string;
    website: string;
    social_link: string;
    created_at: Date;
    orgtype: string;
    custom_orgtype: string | null;
    number_of_employees: string;
    causes: string[];
    sdgs: string[];
    organizationType?: {
      custom_orgtype: string | null;
      id: string;
      isCustom: boolean;
      orgtype: string;
    };
    numberOfEmployees?: { id: string; category: string };
  }[];
};
export type MyOrganization = {
  data: {
    id: string;
    name: string;
    social_enterprise: boolean;
    about_us: string;
    country: string;
    city: string;
    logo: string;
    phone_number: string;
    website: string;
    social_link: string;
    created_at: Date;
    orgtype: string;
    custom_orgtype: string | null;
    number_of_employees: string;
    causes: string[];
    sdgs: string[];
    organizationType?: {
      custom_orgtype: string | null;
      id: string;
      isCustom: boolean;
      orgtype: string;
    };
    numberOfEmployees?: { id: string; category: string };
  }[];
};
export interface OrganizationWithStats extends Organization {
  role: string;
  stats: {
    // eslint-disable-next-line @cspell/spellchecker
    approvedhours: {
      hours: string;
      minutes: string;
    };
    supporters: string;
    // eslint-disable-next-line @cspell/spellchecker
    numofrequestsverified: string;
  };
}

export interface Org {
  id: string;
  name: string;
  value?: string;
  logo: string;
  orgtype: string;
}
export interface OtherOrgParams {
  orgId: string;
  contextType: string;
}

export interface HourVerificationRequestParams {
  pageNumber: number;
  pageSize: number;
  sortByDirection: string;
  status: string;
  name: string;
  id: string;
}

export interface UpdateOrgRequestParams {
  payload: {
    organizationName?: string;
    isSocialEnterprise?: boolean;
    aboutOrganization?: string;
    organizationContactNumber?: string;
    organizationLocation?: {
      country?: string;
      city?: string;
    };
    organizationCauses?: {
      causes: string[];
    };
    organizationUnsdg?: {
      sdg: string[];
    };
    organizationWebsite?: string | null;
    organizationSocialLink?: string | null;
    numberOfEmployees?: string | null;
  };
  id: string;
}

export interface VolunteerHour {
  hours: number;
  minutes: number;
}

export interface DataItem {
  id: string;
  request_sender_user_id: string;
  volunteer_hour: VolunteerHour;
  start_date: string;
  end_date: string;
  created_at: string;
  status: string;
  location: null | string;
  name: string;
  isRemote: boolean;
}

export interface HourVerificationApiResponse {
  data: DataItem[];
  numberOfItems: string;
  pageNumber: string;
}

export interface VerificationStatsResponse {
  numOfDeclinedVerifications: string;
  numOfPendingVerifications: string;
  numOfRequestsVerified: string;
  verifiedHours: {
    hours: number;
    minutes: number;
  };
}

export interface HourVerificationRequest {
  data: {
    id: string;
    requestBy: string;
    hoursReceived: string;
    dateActivity: string;
    location: string;
    status: string;
    [key: string]: string | number; // Add an index signature to allow for string indexing
  }[];
  numberOfItems: string;
  pageNumber: string;
}

export interface OrganizationResponse {
  message: string;
  data: {
    organizationId: string;
  };
}
export interface JoinGroup {
  message: string;
}
export interface LeaveGroup {
  message: string;
}

export interface PendingRequestsCountResponse {
  numberOfRequests: string;
}

export interface PendingRequestInfoResponse {
  data: {
    pending_count: number;
    org_id: string | null;
    org_name: string | null;
    isAdminUser: boolean;
  }[];
}

export interface ListAllOrgs {
  data: {
    id: string;
    name: string;
    logo: string;
    created_at: string;
    org_type: string;
    total_hours: string | number;
    supporters: string | number;
    cause_ids: string[];
    custom_orgtype: string | null;
    user_role: string;
  }[];
  numberOfItems: number;
  pageNumber: number;
  totalRecords: number;
}
export interface ListSupporters {
  supporters: {
    id: string;
    supporter: string;
  }[];
  totalCount: number;
}
export interface ListSupportersParams {
  orgId: string;
  pageSize: number;
  page: number;
  totalCount: number | string;
}

export interface ListAdminSupporters {
  supporters: {
    name: string;
    role: string;
    join_at: string;
    email: string;
    phone: string | null;
    is_volunteer: boolean;
    is_donor: boolean;
    user_id: string;
    org_id: string;
    is_disable_remove: boolean;
    volunteerInfo: {
      hours: string | null;
      hours_minutes: number | null;
      numOfPendingVerifications: number;
      recent_supported: string | null;
    };
  }[];
  totalCount: string;
}

export interface AdminSupporter {
  id: string;
  name: string;
  role: string;
  join_at: string;
  email: string;
  phone: string | null;
  groups_joined: string[];
  org_id: string;
  hours: string | null;
  numOfPendingVerifications: number;
  recent_supported: string | null;
  isDonor: boolean;
  isVolunteer: boolean;
  is_disable_remove: boolean;
}

export interface MutationResponseAdminSupporters {
  supporters: AdminSupporter[];
  totalCount: string;
}

export interface MutationCommonResponse {
  message: string;
}

export interface ListManageAdminSupporters {
  data: {
    id: string;
    supporter: string;
    email: string;
    role: string;
  }[];
  totalCount: [{ supporter_count: number }];
}
export interface ListManageAdmins {
  data: {
    id: string;
    supporter: string;
    email: string;
    role: string;
  }[];
}
export interface ListManageAdminParams {
  orgId: string;
}
export interface ManageEditRoleResponse {
  message: string;
}
export interface ManageEditRoleRequestBody {
  organizationId: string;
  targetUserId: string;
  newRole: string;
}
export interface ListManageSupportersParams {
  orgId: string;
  pageSize: number;
  page: number;
  totalCount: number | string;
}
export interface GetUserRole {
  supporter: {
    userId: string;
    ordId: string;
    role: string;
    last_name: string;
    name: string;
    supporterStatus: string;
    organizationLogo: string;
  };
}
export interface GetUserRoleParams {
  orgId: string;
}

export type FetchPendingRequestsCountParams = void;
