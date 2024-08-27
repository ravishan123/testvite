import { useState, useRef, Suspense, useEffect } from 'react';
import { useAtom } from 'jotai';

import { useAppSelector } from '@store/hooks';
import { useGetProfileQuery } from '@store/slices/profile/profile.slice';
import { userAtom } from '@applicationAtoms/app.atom';
import { userProfileAtom } from '@serverAtoms/users/userProfile.atom';
import { isPreferenceLoadingAtom } from '@applicationAtoms/preference.atom';

import { Grid } from '@ui/layout';
import PageLoader from '@ui/pageLoader';

import PreferenceSetupContainer from '@layouts/containers/preferenceSetupContainer';
import LeftColumn from '@pages/Preference/LeftColumn';

import { PreferenceStepsRef } from './LeftColumn/PreferenceSteps';
import { Causes, Availability, Skills, ProfileInformation, CompleteProfile, UNSDG } from './RightColumn';
import { selectUser } from '@store/slices/user/user.slice';

export default function Preference() {
  const [activeStep, setActiveStep] = useState(0);
  const preferenceStepsRef = useRef<PreferenceStepsRef>(null);
  const [isLoading] = useAtom(isPreferenceLoadingAtom);
  const [, setProfile] = useAtom(userProfileAtom);
  const [, setUser] = useAtom(userAtom);
  const { data: profile, isFetching, isSuccess, isError } = useGetProfileQuery();
  const { data: user } = useAppSelector(selectUser);

  const handleStepValueChange = (value: number) => {
    setActiveStep(value);
  };
  const handleNextStep = (isPreferenceUpdated?: boolean) => {
    preferenceStepsRef.current?.handleNext(isPreferenceUpdated);
  };
  const handleBackStep = () => {
    preferenceStepsRef.current?.handleBack();
  };
  const handleCompleteStep = () => {
    preferenceStepsRef.current?.handleComplete();
  };

  useEffect(() => {
    if (user?.attributes.sub) {
      setUser(user);
    }
  }, [user?.attributes.sub]);

  useEffect(() => {
    if (profile && isSuccess && !isError) {
      setProfile({ data: profile });
    }
  }, [profile, isSuccess, isError]);

  const Component = (currentComponent: number) => {
    switch (currentComponent) {
      case 0:
        return <ProfileInformation handleNextStep={handleNextStep} handleComplete={handleCompleteStep} />;
      case 1:
        return (
          <Causes handleComplete={handleCompleteStep} handleNextStep={handleNextStep} handleBackStep={handleBackStep} />
        );
      case 2:
        return (
          <UNSDG handleNextStep={handleNextStep} handleBackStep={handleBackStep} handleComplete={handleCompleteStep} />
        );
      case 3:
        return (
          <Skills handleNextStep={handleNextStep} handleBackStep={handleBackStep} handleComplete={handleCompleteStep} />
        );
      case 4:
        return (
          <Availability
            handleNextStep={handleNextStep}
            handleBackStep={handleBackStep}
            handleComplete={handleCompleteStep}
          />
        );
      case 5:
        return <CompleteProfile handleBackStep={handleBackStep} />;

      default:
        return <div>Invalid component type</div>;
    }
  };

  return (
    <Suspense fallback={<PageLoader open hideBackdrop />}>
      <PreferenceSetupContainer
        leftColumn={
          <LeftColumn preferenceStepsRef={preferenceStepsRef} handleStepValueChange={handleStepValueChange} />
        }
        rightColumn={
          <Grid maxWidth={651} sx={{ alignContent: 'center' }} item>
            {Component(activeStep)}
          </Grid>
        }
        isLoading={isLoading || isFetching}
      />
    </Suspense>
  );
}
