import { ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  useNavigate,
  unstable_useBlocker as useBlocker,
  unstable_BlockerFunction as BlockerFunction,
  useParams,
} from 'react-router-dom';

import { getRoute, isAppRootRoute } from '@utils/configs/routesConfig';
import { PageRoute } from '@utils/types/router.type';

import { Grid, Box } from '@ui/layout';
import { styled } from '@ui/theme';
import { Typography } from '@ui/typography';
import { IconButton } from '@ui/button';
import { ArrowBackIcon } from '@ui/icons';

import { CustomContextProvider, useCustomContext } from '@globals/context';

type HomeLayoutProps = {
  contentColumn: ReactElement;
  rightColumn: ReactElement;
  routeInfo: PageRoute;
  isVerifyBeforeLeave?: boolean;
  prompt?: (onConfirm: () => void, onCancel: () => void) => ReactNode;
  showRoute?: boolean;
  backButtonPath?: string | number;
};

export type AppContainerContext = {
  prevLocation: string;
};

enum blockStates {
  blocked = 'blocked',
  unblocked = 'unblocked',
  proceeding = 'proceeding',
}

const LeftColumn = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    paddingLeft: `0!important`,
  },
}));

const RightColumn = styled(Grid)(({ theme }) => ({
  width: 341,

  [theme.breakpoints.down('lg')]: {
    width: '100%',
  },
}));

const TitleBar = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  maxHeight: 40,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
  // alignSelf: 'flex-start',

  [theme.breakpoints.down('md')]: {
    paddingLeft: theme.spacing(25),
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(6),
    paddingLeft: 0,
  },
}));

export default function AppContainer({
  contentColumn,
  rightColumn,
  routeInfo,
  isVerifyBeforeLeave = false,
  backButtonPath,
  prompt,
  showRoute = true,
}: HomeLayoutProps) {
  const navigate = useNavigate();
  const params = useParams();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const parentContext = useCustomContext();

  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => currentLocation !== nextLocation && isVerifyBeforeLeave && !isConfirmed,
    [isVerifyBeforeLeave, isConfirmed]
  );
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isVerifyBeforeLeave && !isConfirmed) {
        event.preventDefault();
        return (event.returnValue = '');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isVerifyBeforeLeave, isConfirmed]);

  const handleOnConfirm = () => {
    setIsConfirmed(true);
    blocker?.proceed?.();
  };

  const handleOnCancel = () => {
    setIsConfirmed(false);
    blocker?.reset?.();
  };

  const prevLocation = useMemo<string>(() => {
    let prevPath = '';

    if (routeInfo?.parent && !routeInfo?.isShowBackButton) {
      const subPaths = routeInfo.path?.split('/');

      if (subPaths && subPaths.length > 1 && routeInfo.key) {
        const tempPath = getRoute(`${routeInfo.parent}.${routeInfo.key}`, params);
        prevPath = tempPath.slice(0, tempPath.lastIndexOf('/'));
      } else {
        prevPath = getRoute(routeInfo.parent, params);
      }
    } else {
      prevPath = localStorage.getItem('navigated_from') || '';

      if (!prevPath || prevPath === window.location.pathname) {
        prevPath = getRoute('private.app.home');
      }
    }

    return prevPath;
  }, [routeInfo?.parent, routeInfo?.index, routeInfo?.isShowBackButton]);

  const handleBackClick = () => {
    if (typeof backButtonPath === 'number') {
      navigate(backButtonPath);
    } else {
      navigate(backButtonPath ? backButtonPath : prevLocation);
    }
  };

  return (
    <>
      {showRoute && (
        <TitleBar xs={12} item>
          {((routeInfo?.parent && !isAppRootRoute(routeInfo?.parent)) || routeInfo?.isShowBackButton) && (
            <IconButton sx={{ mr: 1 }} onClick={handleBackClick}>
              <ArrowBackIcon />
            </IconButton>
          )}

          <Box display="flex" flexDirection="column">
            <Typography variant="h4">{routeInfo?.label}</Typography>
            {routeInfo?.description && <Typography variant="body4">{routeInfo.description}</Typography>}
          </Box>
        </TitleBar>
      )}

      <CustomContextProvider prevLocation={prevLocation} {...parentContext}>
        <Grid
          container
          flexGrow={1}
          sx={{
            ml: '0!important',
            width: '100%!important',
          }}
          rowSpacing={{ xs: 2, lg: 0 }}
          columnSpacing={{ xs: 0, lg: 2 }}
        >
          <LeftColumn xs item justifyContent="flex-start">
            {contentColumn}
            {prompt && blocker.state === blockStates.blocked && prompt(handleOnConfirm, handleOnCancel)}
          </LeftColumn>
          <RightColumn item>
            <Grid flexDirection="column" container rowSpacing={2} sx={{ position: 'sticky', top: 0, right: 0 }}>
              {rightColumn}
            </Grid>
          </RightColumn>
        </Grid>
      </CustomContextProvider>
    </>
  );
}
