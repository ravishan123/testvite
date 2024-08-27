import { ReactElement } from 'react';
import { Grid } from '@ui/layout';
import { styled } from '@ui/theme';
import PageLoader from '@ui/pageLoader';

type PreferenceLayoutProps = {
  leftColumn: ReactElement;
  rightColumn: ReactElement;
  isLoading: boolean;
};

const LeftColumn = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'none',
  overflowY: 'hidden',
  maxWidth: '568px!important',
  minHeight: '100vh',
}));

const RightColumn = styled(Grid)(({ theme }) => ({
  alignItems: 'flex-start',
  overflowY: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    padding: 110,
  },
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: '110px 110px 70px 110px',
  },
}));

export default function PreferenceSetupContainer({ leftColumn, rightColumn, isLoading }: PreferenceLayoutProps) {
  return (
    <Grid p={0} container flexGrow={1} flexWrap={'nowrap'}>
      <LeftColumn xs item>
        {leftColumn}
      </LeftColumn>
      <RightColumn item xs>
        {rightColumn}
      </RightColumn>
      <PageLoader open={isLoading} />
    </Grid>
  );
}
