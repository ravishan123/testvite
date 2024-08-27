import { useAppSelector } from '@store/hooks';
import { selectFetchOrgResult } from '@store/slices/organization/organization.slice';
import { Button } from '@ui/button';
import { Grid } from '@ui/layout';
import { useTheme } from '@ui/theme';

export function StepperFooter({
  activeStep,
  setActiveStep,
  steps,
  handleNextClick,
  isLoading,
  type,
}: {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  steps: string[];
  handleNextClick: () => () => void;
  isLoading: boolean;
  type: 'create' | 'edit';
}) {
  const { spacing } = useTheme();
  const fetchOrgResult = useAppSelector(selectFetchOrgResult);

  return (
    <>
      <Grid container width="100%" justifyContent="flex-end">
        <Grid container spacing={1} xs={12} md={10} sx={{ mt: spacing(4), display: 'flex', alignSelf: 'flex-end' }}>
          <Grid item xs>
            <Button
              disabled={activeStep === 0}
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              Back
            </Button>
          </Grid>
          <Grid item xs>
            {activeStep < steps.length - 1 && (
              <Button
                color="primary"
                fullWidth
                onClick={handleNextClick()}
                disabled={fetchOrgResult.isLoading}
                loading={fetchOrgResult.isLoading}
              >
                Next
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <Button type="submit" fullWidth color="primary" disabled={isLoading} loading={isLoading}>
                {type === 'create' && 'Complete'}
                {type === 'edit' && 'Update'}
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
