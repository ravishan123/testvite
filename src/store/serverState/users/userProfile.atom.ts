import { atomsWithMutation, atomsWithQuery } from 'jotai-tanstack-query';
import isEmpty from 'lodash-es/isEmpty';
import { atom } from 'jotai';

import { createUserProfile, getMigratedUserData, updateUserProfile } from '@api/userProfile';
import { userEmailAtom, userIdAtom } from '@applicationAtoms/app.atom';

import { GET_MIGRATED_USER_DATA, UPDATE_USER_PROFILE } from './queryKeys';
import { JSONBody } from '@utils/types';
import { postAvailabilityRemoteApi } from '@api/preference/availabilityRemote/postAvailabilityRemote.api';
import { UserProfile, UserProfileComplete } from '@utils/types/userProfile.type';

const userProfileAtom = atom<{ data: UserProfileComplete | null | undefined }>({ data: null });

const [, updateUserProfileAtom] = atomsWithMutation((get) => ({
  mutationKey: [UPDATE_USER_PROFILE],
  mutationFn: async (data: Omit<UserProfile, 'sub' | 'email'>) => {
    try {
      const userId = get(userIdAtom);
      const userProfile = get(userProfileAtom);

      if (userId && isEmpty(userProfile?.data)) {
        const response: Response | undefined = await createUserProfile({ ...data });
        const availabilityRemoteResponse = await postAvailabilityRemoteApi(true);
        const responseJson: JSONBody = (await response?.json()) as JSONBody;

        if (!response?.ok || availabilityRemoteResponse?.message !== 'Data Successfully Created.') {
          throw new Error((responseJson?.message as string) || 'error creating user profile');
        }

        return responseJson;
      } else if (userId && !isEmpty(userProfile?.data)) {
        delete data.joined_date;
        const response: Response | undefined = await updateUserProfile({ ...data });
        const responseJson: JSONBody = (await response?.json()) as JSONBody;

        if (!response?.ok) {
          throw new Error((responseJson?.message as string) || 'error updating user profile');
        }

        return responseJson;
      }

      throw new Error('user id not found');
    } catch (e: unknown) {
      throw new Error((e as Error)?.message || 'error fetching user profile');
    }
  },
}));

const [, migratedUserDataAtom] = atomsWithQuery((get) => ({
  queryKey: [GET_MIGRATED_USER_DATA, get(userEmailAtom)],
  queryFn: async ({ queryKey: [, email] }) => {
    try {
      if (email) {
        const response: Response | undefined = await getMigratedUserData(email as string);
        const responseJson: JSONBody = (await response?.json()) as JSONBody;

        if (!response?.ok) {
          throw new Error((responseJson?.message as string) || 'error updating user profile');
        }

        return responseJson?.data || null;
      }
    } catch (e: unknown) {
      throw new Error((e as Error)?.message || 'error fetching migrated user data');
    }

    return null;
  },
  keepPreviousData: false,
}));

export { userProfileAtom, updateUserProfileAtom, migratedUserDataAtom };
