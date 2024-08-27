import { atomsWithMutation } from 'jotai-tanstack-query';
import { FORGOT_PASSWORD } from './mutationKeys';
import { forgotPasswordAPI } from '@api/Auth/forgotPassword.api';

const [, forgotPasswordMutationAtom] = atomsWithMutation(() => ({
  mutationKey: [FORGOT_PASSWORD],
  mutationFn: async (email: string) => {
    return forgotPasswordAPI(email);
  },
}));

export { forgotPasswordMutationAtom };
