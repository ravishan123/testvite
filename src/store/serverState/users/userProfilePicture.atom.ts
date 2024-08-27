import { atomsWithQuery } from 'jotai-tanstack-query';
import { GET_USER_PROFILE_PICTURE } from './queryKeys';
import { Storage } from 'aws-amplify';
import { userAtom } from '@applicationAtoms/app.atom';

const getUserProfile = async (id: string) => {
  return await Storage.get(`${id}`);
};

const [, userProfilePictureAtom] = atomsWithQuery((get) => {
  return {
    queryKey: [GET_USER_PROFILE_PICTURE],
    queryFn: () => {
      return getUserProfile(get(userAtom)?.attributes.sub as string);
    },
    refetchOnMount: true,
  };
});

export { userProfilePictureAtom };
