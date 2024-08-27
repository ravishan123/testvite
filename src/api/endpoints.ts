import { Api } from '@utils/functions/apiEndpointFactory';
import { ENVIRONMENTS } from '@constants/environments';

const api = new Api();

api.addEndPoint(
  'userProfile',
  {
    [ENVIRONMENTS.ISOLATED]: {
      id: import.meta.env.VITE_API_USER_PROFILE_ID as string,
      paths: { mainPath: '/prod/user-profile' },
    },
    [ENVIRONMENTS.DEV]: {
      id: import.meta.env.VITE_API_USER_PROFILE_ID as string,
      paths: { mainPath: '/prod/user-profile' },
    },
  },
  {
    mainPath: '/profile/user-profile',
    subPaths: {
      migratedProfile: '/profile-migration',
    },
  }
);

api.addEndPoint(
  'preference',
  {
    [ENVIRONMENTS.ISOLATED]: {
      id: import.meta.env.VITE_API_USER_PROFILE_ID as string,
      paths: { mainPath: '/prod/user-profile/preference' },
    },
    [ENVIRONMENTS.DEV]: {
      id: import.meta.env.VITE_API_USER_PROFILE_ID as string,
      paths: { mainPath: '/prod/user-profile/preference' },
    },
  },
  {
    mainPath: '/profile/user-profile/preference',
    subPaths: {
      causes: '/cause',
      unsdg: '/unsdg',
      skill: '/skill',
      language: '/language',
      availability: '/availability',
      skillsSearch: '/skills/search',
      languagesSearch: '/languages/search',
    },
  }
);

api.addEndPoint(
  'forgotPassword',
  {
    [ENVIRONMENTS.ISOLATED]: {
      id: import.meta.env.VITE_API_FORGOT_PASSWORD_ID as string,
      paths: { mainPath: '/prod/forgot-password' },
    },
    [ENVIRONMENTS.DEV]: {
      id: import.meta.env.VITE_API_FORGOT_PASSWORD_ID as string,
      paths: { mainPath: '/prod/forgot-password' },
    },
  },
  '/auth/forgot-password'
);

api.addEndPoint(
  'organization',
  {
    [ENVIRONMENTS.ISOLATED]: {
      id: import.meta.env.VITE_API_ORGANIZATION as string,
      paths: { mainPath: '/prod' },
    },
    [ENVIRONMENTS.DEV]: {
      id: import.meta.env.VITE_API_ORGANIZATION as string,
      paths: { mainPath: '/prod' },
    },
  },
  {
    mainPath: '/organization',
    subPaths: {
      causes: '/cause',
      location: '/location',
      search: '/search',
      type: '/type',
      verificationStats: '/verification-stats',
      verificationRequest: '/verification-requests',
      pendingRequestsCount: '/pending-requests-count',
      pendingRequestsV2: '/v2/pending-requests-count',
      listAllOrganization: '/list-all-organizations',
      listJoinedGroups: '/list-joined-groups',
      joinGroup: '/group/join',
      leaveGroup: '/group/leave',
      myOrgs: '/myOrganizations',
    },
  }
);
api.addEndPoint(
  'supporter',
  {
    [ENVIRONMENTS.ISOLATED]: {
      id: import.meta.env.VITE_API_ORGANIZATION as string,
      paths: { mainPath: '/prod/supporter' },
    },
    [ENVIRONMENTS.DEV]: {
      id: import.meta.env.VITE_API_ORGANIZATION as string,
      paths: { mainPath: '/prod/supporter' },
    },
  },
  {
    mainPath: '/organization/supporter',
    subPaths: {
      public: '/public',
      admin: '/admin',
      listSupporters: 'admin/list-supporters',
      lisAdmins: 'admin/list-admins',
      editRole: 'admin/edit-role',
    },
  }
);

api.addEndPoint(
  'settings',
  {
    [ENVIRONMENTS.ISOLATED]: {
      id: import.meta.env.VITE_API_SETTINGS as string,
      paths: { mainPath: '/prod/master-data' },
    },
    [ENVIRONMENTS.DEV]: {
      id: import.meta.env.VITE_API_SETTINGS as string,
      paths: { mainPath: '/prod/master-data' },
    },
  },
  {
    mainPath: '/settings/master-data',
    subPaths: {
      causes: '/cause/list',
      employees: '/employees/list',
      organizationSizes: '/organization/sizes',
      organizationTypes: '/organization/type',
      skills: '/skill/list',
      unsdgs: '/unsdgs/list',
    },
  }
);

api.addEndPoint(
  'volunteer',
  {
    [ENVIRONMENTS.ISOLATED]: {
      id: import.meta.env.VITE_API_VOLUNTEER as string,
      paths: { mainPath: '/prod' },
    },
    [ENVIRONMENTS.DEV]: {
      id: import.meta.env.VITE_API_VOLUNTEER as string,
      paths: { mainPath: '/prod' },
    },
  },
  {
    mainPath: '/volunteer',
    subPaths: {
      hours: '/hours',
      stats: '/stats',
      view: '/view',
      causes: '/cause',
      verificationRequest: '/hours/verification-request',
      approval: 'approval',
    },
  }
);

api.addEndPoint(
  'homeStats',
  {
    [ENVIRONMENTS.ISOLATED]: {
      id: import.meta.env.VITE_API_USER_PROFILE_ID as string,
      paths: { mainPath: '/prod/home-stats' },
    },
    [ENVIRONMENTS.DEV]: {
      id: import.meta.env.VITE_API_USER_PROFILE_ID as string,
      paths: { mainPath: '/prod/home-stats' },
    },
  },
  {
    mainPath: '/profile/home-stats',
  }
);
