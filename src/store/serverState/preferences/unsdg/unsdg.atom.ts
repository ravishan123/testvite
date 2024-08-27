import { atom } from 'jotai';
import { atomsWithMutation, atomsWithQuery } from 'jotai-tanstack-query';
import isEmpty from 'lodash-es/isEmpty';

import { getUserUNSDG, assignUserUNSDG, updateUserUNSDG } from '@api/unsdg';
import { userIdAtom } from '@applicationAtoms/app.atom';
import { UserUNSDG, UserUNSDGResponse } from '@utils/types/preference/unsdg.type';
import { JSONBody } from '@utils/types';

import { GET_USER_UNSDG, UPDATE_USER_UNSDG } from './queryKeys';

const [, getUserUNSDGAtom] = atomsWithQuery((get) => ({
  queryKey: [GET_USER_UNSDG, get(userIdAtom)],
  queryFn: async () => {
    try {
      const userId = get(userIdAtom);

      if (userId) {
        const response: Response | undefined = await getUserUNSDG();
        const responseJson = (await response?.json()) as UserUNSDGResponse;

        if (!response?.ok) {
          throw new Error((responseJson?.message as string) || 'error getting user UN SDGs');
        }

        return responseJson;
      }
    } catch (e: unknown) {
      throw new Error((e as Error)?.message || 'error fetching user UN SDGs');
    }
  },
  keepPreviousData: false,
  suspense: true,
}));

const [, updateUserSDGAtom] = atomsWithMutation((get) => ({
  mutationKey: [UPDATE_USER_UNSDG],
  mutationFn: async (data: UserUNSDG) => {
    try {
      const userId = get(userIdAtom);
      const userUNSDG = get(getUserUNSDGAtom);

      if (userId && isEmpty(userUNSDG?.data?.data)) {
        const response: Response | undefined = await assignUserUNSDG(data);
        const responseJson: JSONBody = (await response?.json()) as JSONBody;

        if (!response?.ok) {
          throw new Error((responseJson?.message as string) || 'error assigning UN SDGs');
        }

        return responseJson;
      } else if (userId && !isEmpty(userUNSDG?.data?.data)) {
        const response: Response | undefined = await updateUserUNSDG(data);
        const responseJson: JSONBody = (await response?.json()) as JSONBody;

        if (!response?.ok) {
          throw new Error((responseJson?.message as string) || 'error updating UN SDGs');
        }

        return responseJson;
      }

      throw new Error('user id not found');
    } catch (e: unknown) {
      throw new Error((e as Error)?.message || 'error fetching user profile');
    }
  },
}));

const selectedSDGAtom = atom<UserUNSDG>([]);

export { getUserUNSDGAtom, updateUserSDGAtom, selectedSDGAtom };
