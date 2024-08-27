import { lazy } from 'react';

import { LayoutOutlet, PageRoute } from '@utils/types/router.type';

import {
  HomeOutlinedIcon,
  HomeWorkOutlinedIcon,
  PermIdentityOutlinedIcon,
  NotificationsOutlinedIcon,
  SettingsOutlinedIcon,
} from '@ui/icons';

import PublicOutlet from '@layouts/outlets/publicOutlet';
import ProtectedOutlet from '@layouts/outlets/protectedOutlet';

const AppOutlet = lazy(() => import('@layouts/outlets/appOutlet'));
const NestedOutlet = lazy(() => import('@layouts/outlets/nestedOutlet'));

const HomePage = lazy(() => import('@pages/HomePage'));
const SignUpPage = lazy(() => import('@pages/Auth/SignUpFlow'));
const SignInPage = lazy(() => import('@pages/Auth/SignInFlow'));
const EmailVerificationPage = lazy(() => import('@pages/Auth/VerifyEmail/VerifyEmail'));
const PrivacyPolicyPage = lazy(() => import('@pages/TermsAndConditions'));
const MaintenancePage = lazy(() => import('@pages/Maintenance'));
const Preference = lazy(() => import('@pages/Preference'));
const Error404 = lazy(() => import('@pages/errorPages/Error404'));
const ForgetPassword = lazy(() => import('@pages/Auth/ForgetPassword'));
const EarlyBirdLanding = lazy(() => import('@pages/EarlyBirdLanding'));
const UserProfilePage = lazy(() => import('@pages/userProfilePage'));
const OrganizationsPage = lazy(() => import('@pages/organizations/organizationsPage'));
const OrganizationProfilePage = lazy(() => import('@pages/organizations/organizationProfilePage'));
const OrgCreationPage = lazy(() => import('@pages/organizations/orgOperations/orgCreation'));
const OrgEditPage = lazy(() => import('@pages/organizations/orgOperations/orgEdit'));
const VerifyHours = lazy(() => import('@pages/organizations/verifyHours'));
const HourDetailsPage = lazy(() => import('@pages/organizations/hourDetailsPage'));
const AddHoursPage = lazy(() => import('@pages/addHoursPage'));
const HourAmendPage = lazy(() => import('@pages/organizations/hourAmendPage'));
const HonorCode = lazy(() => import('@pages/HonorCode'));
const ManageSupporters = lazy(() => import('@pages/organizations/manageSupporters'));
const ManageRoles = lazy(() => import('@pages/organizations/manageRoles'));
const viewOtherOrgProfile = lazy(() => import('@pages/organizations/viewOtherOrganization'));
const Supporters = lazy(() => import('@pages/organizations/supporters'));

const Routes: Record<string, LayoutOutlet | PageRoute> = {
  public: {
    Layout: PublicOutlet,
    path: '/',
    children: {
      root: {
        path: '/',
        label: 'Root',
        Component: SignInPage,
      },
      signup: {
        path: 'signup',
        label: 'Sign Up',
        Component: SignUpPage,
      },
      signin: {
        path: 'signin',
        label: 'Sign In',
        Component: SignInPage,
      },
      verifyEmail: {
        path: 'verify-email',
        label: 'Verify Email',
        Component: EmailVerificationPage,
      },
      preference: {
        path: 'preference',
        label: 'Preference',
        Component: Preference,
      },
      privacyPolicy: {
        path: 'privacy',
        label: 'Privacy Policy',
        Component: PrivacyPolicyPage,
      },
      honorCode: {
        path: 'honor-code',
        label: 'Honor Code',
        Component: HonorCode,
      },
      maintenance: {
        path: 'maintenance',
        label: 'Maintenance',
        Component: MaintenancePage,
      },
      forgotPassword: {
        path: 'forgot-password',
        label: 'Forgot Password',
        Component: ForgetPassword,
      },
    },
  },
  private: {
    Layout: ProtectedOutlet,
    path: '/',
    children: {
      app: {
        label: 'App',
        Layout: AppOutlet,
        children: {
          home: {
            label: 'Home',
            path: 'home',
            Icon: HomeOutlinedIcon,
            Component: HomePage,
          },
          organizations: {
            label: 'Organizations',
            Icon: HomeWorkOutlinedIcon,
            path: 'organizations',
            Layout: NestedOutlet,
            children: {
              list: {
                label: 'Organizations',
                index: true,
                Component: OrganizationsPage,
              },
              create: {
                label: 'Create Organization',
                path: 'create',
                Component: OrgCreationPage,
              },
              viewOrgProfile: {
                label: '',
                path: ':id/view',
                Component: viewOtherOrgProfile,
              },

              profile: {
                path: ':id',
                Layout: NestedOutlet,
                children: {
                  view: {
                    label: 'My Organization',
                    index: true,
                    Component: OrganizationProfilePage,
                  },
                  edit: {
                    label: 'Edit Organization',
                    path: 'edit',
                    Component: OrgEditPage,
                  },
                  verifyHours: {
                    path: 'volunteer-hours',
                    Layout: NestedOutlet,
                    children: {
                      view: {
                        label: 'Verify volunteer hours',
                        index: true,
                        Component: VerifyHours,
                      },
                      hourDetails: {
                        label: 'Verify hours',
                        path: ':hourId',
                        Component: HourDetailsPage,
                      },
                      hourDetailEdit: {
                        label: 'Amend hours verification',
                        path: ':hourId/edit',
                        Component: HourAmendPage,
                      },
                    },
                  },
                  manageSupporters: {
                    path: 'manage-supporters',
                    Layout: NestedOutlet,
                    children: {
                      view: {
                        label: 'Manage Supporters',
                        index: true,
                        Component: ManageSupporters,
                      },
                    },
                  },
                  manageRoles: {
                    path: 'manage-roles',
                    Layout: NestedOutlet,
                    children: {
                      view: {
                        label: 'Manage Roles',
                        index: true,
                        Component: ManageRoles,
                      },
                    },
                  },
                  supporters: {
                    path: 'supporters',
                    Layout: NestedOutlet,
                    children: {
                      view: {
                        label: 'Supporters',
                        index: true,
                        Component: Supporters,
                      },
                    },
                  },
                },
              },
            },
          },
          profile: {
            label: 'Profile',
            Icon: PermIdentityOutlinedIcon,
            path: 'profile',
            Component: UserProfilePage,
          },
          addHours: {
            label: 'Add Hours',
            path: 'add-hours',
            description: 'Get your volunteer contributions verified',
            isShowBackButton: true,
            skipLeftNav: true,
            Component: AddHoursPage,
          },
          notifications: {
            label: 'Notifications',
            Icon: NotificationsOutlinedIcon,
            path: 'notifications',
          },
          settings: {
            label: 'Settings & Support',
            Icon: SettingsOutlinedIcon,
            path: 'settings',
          },
          error404: {
            label: 'Error 404',
            path: '*',
            skipLeftNav: true,
            Component: Error404,
          },
        },
      },
      preference: {
        label: 'Preference',
        path: 'user-onboarding',
        Component: Preference,
      },
    },
  },
  migration: {
    Layout: PublicOutlet,
    path: '/',
    children: {
      landing: {
        label: 'Landing',
        path: 'landing',
        Component: EarlyBirdLanding,
      },
    },
  },
};

/**
 * The function first splits the route string into an array of path segments using the . character as a delimiter.
 * It then initializes a routePath variable to hold the current route object, and a link variable to hold the parsed link string.
 *
 * The function then checks if the route string has any path segments, and if so, extracts the first segment as the layout variable.
 * It then looks up the corresponding routePath object in the Routes object, which is likely an object that defines the application's routing configuration.
 *
 * If the routePath object is found, the function iterates over the remaining path segments and looks up the corresponding child route object in the
 * routePath.children object. It then appends the child route's path property to the link variable, separated by a forward slash.
 *
 * After iterating over all the path segments, the function removes any consecutive forward slashes in the link variable using a regular expression.
 *
 * If the parameters object is provided, the function replaces any path parameters in  the link variable with their corresponding values from the parameters object.
 *
 * Returns a parsed link for a given route and parameters.
 * @param route - The route to parse.
 * @param parameters - Optional parameters to replace in the route.
 * @returns The parsed link.
 *
 */
const getRoute = (route: string, parameters?: Partial<Record<string, string>>) => {
  const paths: string[] = route.split('.');
  let routePath: LayoutOutlet | PageRoute;
  let link = '';

  if (paths.length) {
    const layout: string | undefined = paths.shift();

    if (layout) {
      routePath = Routes?.[layout];

      if (routePath) {
        paths.forEach((path) => {
          if (routePath?.children) {
            routePath = routePath.children[path];
            link += `/${routePath?.path || ''}`;
          }
        });
      }
    }
  }

  let parsedLink = link.replace(/\/(?=\/)/gm, '') || '';

  if (parameters) {
    Object.entries(parameters).forEach(([key, value]) => {
      if (value) {
        parsedLink = parsedLink.replace(`:${key}`, value);
      }
    });
  }

  // store previous location in local storage so we can use it for app back button
  localStorage.setItem('navigated_from', window.location.pathname);

  return parsedLink;
};

const isAppRootRoute = (route: string) => {
  const _route = route.split('.');

  if (_route[0] === 'private' && _route[1] === 'app') {
    return _route.length === 2;
  }
};

export { Routes, getRoute, isAppRootRoute };
