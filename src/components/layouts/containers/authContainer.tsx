import { ReactElement, useEffect, useRef } from 'react';

import { Grid } from '@ui/layout';
import { styled, useMediaQuery, useTheme } from '@ui/theme';
import ImageCarousel from '@ui/carousel';

type AuthenticationLayoutProps = {
  rightColumn: ReactElement;
};

const Container = styled(Grid)(({ theme }) => ({
  flexWrap: 'nowrap',
  height: '100%',
  flexGrow: 1,
  padding: 0,

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    overflow: 'auto',
  },
}));

const LeftColumn = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: 16,
  overflowY: 'hidden',
  maxHeight: '100vh',
  maxWidth: '568px!important',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',

  '& .MuiTypography-root': {
    color: theme.palette.common.white,
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 'none!important',
    maxHeight: '100vh',
    flexShrink: 0,
    flexGrow: 1,
  },
}));

const RightColumn = styled(Grid)(({ theme }) => ({
  padding: '65px',
  overflowY: 'auto',
  maxHeight: '100vh',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',

  [theme.breakpoints.down('md')]: {
    flexBasis: 'auto',
    flexShrink: 0,
    flexGrow: 1,
    maxHeight: 'none',
  },
}));

export default function AuthContainer({ rightColumn }: AuthenticationLayoutProps) {
  const { breakpoints } = useTheme();
  const isDesktop = useMediaQuery(breakpoints.up('md'));
  const leftColRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOnSignIn = () => {
    // scroll containerRef for the amount of leftColRef height
    if (containerRef.current && leftColRef.current) {
      containerRef.current.scrollTo({
        top: leftColRef.current.offsetHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (!isDesktop && containerRef.current && leftColRef.current && window.location.pathname !== '/signin') {
      containerRef.current.scrollTo({
        top: leftColRef.current.offsetHeight,
        behavior: 'auto',
      });
    }
  }, [isDesktop]);

  return (
    <Container ref={containerRef} container>
      <LeftColumn ref={leftColRef} xs={12} md item>
        <ImageCarousel onAction={handleOnSignIn} />
      </LeftColumn>
      <RightColumn xs={12} md item>
        {rightColumn}
      </RightColumn>
    </Container>
  );
}
