import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useAtom } from 'jotai';

import { userProfileAtom } from '@serverAtoms/users/userProfile.atom';
import { userAtom } from '@applicationAtoms/app.atom';
import { resetUserState, selectUser } from '@store/slices/user/user.slice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { profileApi } from '@store/slices/profile/profile.slice';
import { getRoute } from '@utils/configs/routesConfig';

export default function useSignOutHook() {
  const navigate = useNavigate();
  const [, setUserProfile] = useAtom(userProfileAtom);
  const [, setUser] = useAtom(userAtom);
  const { data: user } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const handleSignOut = useCallback(() => {
    void Auth.signOut().then(() => {
      navigate(getRoute('public.signin'));
      setUser(null);
      setUserProfile({ data: null });
      dispatch(resetUserState());
      dispatch(profileApi.util.resetApiState());
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('logout', Date.now().toString());
    });
  }, [navigate, user?.attributes]);

  return { handleSignOut };
}
