import { ReactElement } from 'react';

import FullPageContainer from '@layouts/containers/fullPageContainer';
import { getDaysRemaining } from '@utils/functions/dateTime';
import GudPplIcon from '@ui/icons/GudPplIcon';
import { styled, useTheme } from '@ui/theme';
import { Typography, Link } from '@ui/typography';
import { Grid } from '@ui/layout';

import bannerImage from '@assets/images/maintenance_banner.svg';

const Banner = styled('div')`
  width: 324px;
  height: 320px;
  background: url(${bannerImage}) no-repeat 0 0 transparent;
`;

export default function Maintenance(): ReactElement {
  const theme = useTheme();
  const remainingDays = getDaysRemaining('10/1/2023');

  return (
    <FullPageContainer
      logo={<GudPplIcon width={115} height={40} />}
      content={
        <Grid display="flex" flexDirection={'column'} flexWrap={'wrap'} alignItems={'center'} textAlign={'center'}>
          <Banner />
          <Grid mt="88px" mb="60px" maxWidth="520px">
            <div>
              <Typography variant="title">We will be back in</Typography>
              &nbsp;&nbsp;
              <Typography variant="title" color={theme.palette.primary.main}>
                {remainingDays} days
              </Typography>
            </div>

            <Typography variant="h5-secondary" color="" fontWeight={'normal'} mt="12px">
              We are making something better to help you grow the good you do.
            </Typography>
          </Grid>
          <Typography variant="h5-secondary" color="" fontWeight={'normal'}>
            Visit our&nbsp;
            <Link href="https://help.gudppl.com" underline="hover" fontWeight={600}>
              help center
            </Link>
            &nbsp;for more information.
          </Typography>
        </Grid>
      }
    />
  );
}
