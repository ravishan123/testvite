import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { getLoggedInUser, selectUser } from '@store/slices/user/user.slice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { getRoute } from '@utils/configs/routesConfig';

import { useSnackbar } from '@ui/snackBar';
import PageLoader from '@ui/pageLoader';

import CustomPortal from '@globals/customPortal';

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [iseGettingUser, setIsGettingUser] = useState<boolean>(true);
  const { data: user, isLoading, error } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) {
      void dispatch(getLoggedInUser());
    }

    return () => {
      setIsGettingUser(false);
    };
  }, []);

  /* 
    This useEffect will set iseGettingUser to false
    whenever isLoading becomes false. 
  */
  useEffect(() => {
    if (!isLoading) {
      setIsGettingUser(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      openSnackbar(error || 'Failed to fetch user', 'error');
      setIsGettingUser(false);
    }
  }, [error]);

  useEffect(() => {
    if (!isLoading && !user && !iseGettingUser) {
      navigate(getRoute('public.signin'));
    }

    if (user && !isLoading) {
      setIsGettingUser(false);
    }
  }, [isLoading, user, iseGettingUser]);

  return (
    <>
      {(isLoading || iseGettingUser) && <PageLoader open hideBackdrop />}
      {user ? (
        <CustomPortal>
          <Outlet />
        </CustomPortal>
      ) : (
        ''
      )}
    </>
  );
}
