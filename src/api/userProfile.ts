import getHeaders from '@utils/functions/apiHeaders';

import { Api } from '@utils/functions/apiEndpointFactory';
import { UserProfile } from '@utils/types/userProfile.type';

export const getUserProfile = async () => {
  if (Api.endpoints.userProfile?.root) {
    return fetch(Api.endpoints.userProfile.root, {
      method: 'GET',
      headers: await getHeaders(),
    });
  }
};

export const createUserProfile = async (data: UserProfile) => {
  if (Api.endpoints?.userProfile?.root) {
    return fetch(Api.endpoints.userProfile.root, {
      method: 'POST',
      body: JSON.stringify(data as unknown as BodyInit),
      headers: await getHeaders(),
    });
  }
};

export const updateUserProfile = async (data: UserProfile) => {
  if (Api.endpoints?.userProfile?.root) {
    return await fetch(Api.endpoints.userProfile.root, {
      method: 'PATCH',
      body: JSON.stringify(data as unknown as BodyInit),
      headers: await getHeaders(),
    });
  }
};

export const getMigratedUserData = async (email: string) => {
  if (Api.endpoints?.userProfile?.migratedProfile) {
    const params = new URLSearchParams({ email });
    return fetch(`${Api.endpoints.userProfile.migratedProfile}?${params.toString()}`, {
      method: 'GET',
      headers: await getHeaders(),
    });
  }
};

export const getHomeStats = async () => {
  if (Api.endpoints?.homeStats?.root) {
    return fetch(Api.endpoints.homeStats.root, {
      method: 'GET',
      headers: await getHeaders(),
    });
  }
};
