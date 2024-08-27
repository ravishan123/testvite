import { Grid, Box } from '@ui/layout';
import { Typography } from '@ui/typography';
import GudPplIcon from '@ui/icons/GudPplIcon';

import PreferenceSteps, { PreferenceStepsRef } from './PreferenceSteps';

interface LeftColumnProps {
  handleStepValueChange: (value: number) => void;
  preferenceStepsRef: React.RefObject<PreferenceStepsRef>;
}

const LeftColumn: React.FC<LeftColumnProps> = ({ handleStepValueChange, preferenceStepsRef }) => {
  return (
    <>
      <Box
        sx={{
          objectPosition: 'left top',
          flexGrow: 1,
          overflow: 'hidden',
          p: '38px',
        }}
      >
        <Grid item xs={12} p="0 0 80px 0">
          <GudPplIcon width={115} height={40} />
        </Grid>

        <Grid item>
          <Typography variant="h1" gutterBottom>
            Hello there! <br /> Welcome to gudppl!
          </Typography>
          <Typography variant="h5" fontWeight="400">
            Let’s complete your profile to get you started
          </Typography>
        </Grid>
        <Grid item>
          <PreferenceSteps ref={preferenceStepsRef} onValueChange={handleStepValueChange} />
        </Grid>
      </Box>
    </>
  );
};

export default LeftColumn;
