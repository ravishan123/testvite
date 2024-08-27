import { ReactElement } from 'react';

import FullPageContainer from '@layouts/containers/fullPageContainer';
import GudPplIcon from '@ui/icons/GudPplIcon';
import { Typography } from '@ui/typography';
import { Grid, Box } from '@ui/layout';

export default function HonorCode(): ReactElement {
  return (
    <FullPageContainer
      logo={<GudPplIcon width={115} height={40} />}
      content={
        <Grid
          container
          spacing={2}
          gap={0}
          flexDirection={'row'}
          height="100vh"
          justifyContent="space-around"
          alignItems="flex-start"
          width={758}
        >
          <Grid item mr={2} ml={8}>
            <img
              src="/images/honor_code_image.svg"
              alt={'action banner image'}
              width={'249px'}
              height={'291px'}
              style={{ position: 'relative', zIndex: 1 }}
            />
          </Grid>

          <Grid item sx={{ textAlign: 'center' }} mr={2}>
            <Box mb={6}>
              <Box display="inline-flex" justifyContent="center" mb={2}>
                <GudPplIcon width={119} height={41} />
              </Box>
              <Typography variant="h1" component="div">
                Honor Code
              </Typography>
            </Box>
            {['be honest', 'be accountable', 'be respectful'].map((values) => (
              <Typography variant="h2" component="div" my={0.5}>
                {values}
              </Typography>
            ))}
          </Grid>
        </Grid>
      }
    />
  );
}
