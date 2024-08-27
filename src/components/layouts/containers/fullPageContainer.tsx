import { Grid } from '@ui/layout';
import { ReactElement } from 'react';

type FullPageLayoutProps = {
  content?: string | JSX.Element | JSX.Element[];
  logo: ReactElement;
};

export default function FullPageContainer({ content, logo }: FullPageLayoutProps): ReactElement {
  return (
    <Grid p={0} container flexGrow={1} flexWrap={'nowrap'} direction={'column'}>
      <Grid item xs={12} p="38px 38px">
        {logo}
      </Grid>
      <Grid item xs={12} p="52px 38px 38px 38px" display={'flex'} justifyContent={'center'}>
        {content}
      </Grid>
    </Grid>
  );
}
