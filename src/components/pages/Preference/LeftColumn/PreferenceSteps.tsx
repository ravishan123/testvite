import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import isEmpty from 'lodash-es/isEmpty';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import { CheckCircleOutline } from '@mui/icons-material';
import StepLabel from '@mui/material/StepLabel';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { ProfileTags, profileApi, selectUserPreference } from '@store/slices/profile/profile.slice';
import { userProfileAtom } from '@serverAtoms/users/userProfile.atom';
import { getRoute } from '@utils/configs/routesConfig';

import { Box } from '@ui/layout';
import { Button } from '@ui/button';
import { styled } from '@ui/theme';
import { getStep } from '@utils/functions/getLocationStep';

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  margin: '0 0 10px 0',

  '& .MuiStepLabel-label': {
    fontSize: '14px',
    color: theme.palette.text.secondary,
    fontWeight: 400,

    '&.Mui-active': {
      fontWeight: 600,
      color: theme.palette.text.primary,
    },

    '&.Mui-completed:not(.Mui-active)': {
      opacity: 0.5,
    },
  },
  '& .MuiStepLabel-iconContainer': {
    paddingRight: '10px',

    '&.Mui-completed:not(.Mui-active)': {
      opacity: 0.5,
    },
  },
}));

const steps = [
  'Profile information',
  'Causes you care about',
  'United Nations Sustainable Development Goals',
  'Your skills & talents',
  'Availability to volunteer',
  'Complete your profile',
];

interface CustomStepIconProps {
  active: boolean;
  completed: boolean;
}

const CustomStepIcon: React.FC<CustomStepIconProps> = (props) => {
  const { active, completed } = props;

  return (
    <CheckCircleOutline sx={{ fontSize: 24 }} fontSize="small" color={active || completed ? 'success' : 'action'} />
  );
};

interface PreferenceStepsProps {
  onValueChange: (value: number) => void;
}

export interface PreferenceStepsRef {
  // Define the function you want to expose to the parent component here.
  // In this case, we want to expose the `handleNext` function.
  handleNext: (isPreferenceUpdated?: boolean) => void;
  handleBack: () => void;
  handleComplete: () => void;
}

const PreferenceSteps: React.ForwardRefRenderFunction<PreferenceStepsRef, PreferenceStepsProps> = (
  { onValueChange },
  ref
) => {
  const { data } = useAppSelector(selectUserPreference);

  const dispatch = useAppDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{
    [key: number]: boolean;
  }>({});
  const [userProfileData] = useAtom(userProfileAtom);
  const navigate = useNavigate();
  const location: { state: { from: string }; search: string } = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const contextParam = queryParams.get('context');

  const totalSteps = () => {
    return steps.length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const isFirstStep = () => {
    return activeStep === 0;
  };

  useEffect(() => {
    if (contextParam) {
      setActiveStep(getStep({ contextParam: contextParam, locationType: 'preference' }));
    }
  }, [contextParam]);

  useEffect(() => {
    onValueChange(activeStep);
  }, [activeStep, onValueChange]);

  const handleNext = (isPreferenceUpdated?: boolean) => {
    const newActiveStep = !isLastStep() ? activeStep + 1 : totalSteps() - 1;
    setActiveStep(newActiveStep);

    if (isPreferenceUpdated) {
      dispatch(profileApi.util.invalidateTags([ProfileTags.PREFERENCE]));
    }
  };

  const handleBack = () => {
    const newActiveStep = !isFirstStep() ? activeStep - 1 : 0;
    setActiveStep(newActiveStep);
  };

  const handleComplete = () => {
    setCompleted((prevCompleted) => ({ ...prevCompleted, [activeStep]: true }));
  };

  useImperativeHandle(ref, () => ({
    handleNext,
    handleBack,
    handleComplete,
  }));

  // Create a function to update the 'completed' state based on the 'progress' object.
  const updateCompletedSteps = () => {
    const newCompleted: { [key: number]: boolean } = {};
    if (data?.progress) {
      newCompleted[0] = data.progress.profile;
      newCompleted[1] = data.progress.userCauses;
      newCompleted[2] = data.progress.userSdgs;
      newCompleted[3] = data.progress.skillsAndLanguage;
      newCompleted[4] = data.progress.dailyAvailability;
      newCompleted[5] = data.progress.completeProfile;
      setCompleted(newCompleted);
    }
  };

  useEffect(() => {
    updateCompletedSteps();
  }, [data]);

  return (
    <>
      <Box sx={{ padding: '0' }}>
        <Stepper
          sx={{ margin: '56px 0 20px 0' }}
          nonLinear
          activeStep={activeStep}
          orientation="vertical"
          connector={null}
        >
          {steps.map((step, index) => (
            <Step key={step} completed={completed[index]}>
              <StyledStepLabel StepIconComponent={CustomStepIcon}>{step}</StyledStepLabel>
            </Step>
          ))}
        </Stepper>
        <Button
          onClick={() => {
            navigate(getRoute(`private.app.${location?.state?.from?.replace('/', '.') || 'home'}`));
          }}
          fullWidth
          variant="outlined"
          color="secondary"
          disabled={isEmpty(userProfileData?.data)}
        >
          Skip this, I’ll do it later
        </Button>
      </Box>
    </>
  );
};

export default forwardRef(PreferenceSteps);
