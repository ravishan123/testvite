import { Stepper } from '@mui/material';
import { CustomStepIcon } from './customStepIcon';
import { CustomConnector, CustomStep, CustomStepLabel } from './customConnector';

export function StepperHeader({ activeStep, steps }: { activeStep: number; steps: string[] }) {
  return (
    <Stepper nonLinear activeStep={activeStep} sx={{ width: '100%', mb: 3, mt: 1 }} connector={<CustomConnector />}>
      {steps.map((_, index) => (
        <CustomStep key={index} completed={index < activeStep}>
          <CustomStepLabel StepIconComponent={(props) => <CustomStepIcon {...props} />}>
            Step {index + 1}
          </CustomStepLabel>
        </CustomStep>
      ))}
    </Stepper>
  );
}
