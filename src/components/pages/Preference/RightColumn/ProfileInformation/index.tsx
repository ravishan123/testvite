import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash-es/isEmpty';
import { Grid, Typography, Box, styled } from '@mui/material';

import { isPreferenceLoadingAtom } from '@applicationAtoms/preference.atom';
import { useLazyGetProfileQuery } from '@store/slices/profile/profile.slice';
import { UserProfile, UserProfileComplete } from '@utils/types/userProfile.type';
import { GenderType } from '@utils/types';

import { migratedUserDataAtom, updateUserProfileAtom, userProfileAtom } from '@serverAtoms/users/userProfile.atom';
import { useSnackbar } from '@ui/snackBar';
import { LoadingButton } from '@ui/button';
import DoBInput from '@ui/dobInput';
import GenderInput from '@ui/genderInput';

import FormInput from '@globals/FormInput';

import schema from './schema';
import AgeAndGenderInfo from './ageAndGenderInfo';

export type ProfileInformationProps = {
  handleNextStep?: (isUpdate?: boolean) => void;
  handleComplete: () => void;
};

export type ProfileInformation = TypeOf<typeof schema>;

const CustomFormInput = styled(FormInput)({
  width: '100%',
});

function ProfileInformation({ handleNextStep, handleComplete }: ProfileInformationProps) {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [updateUser] = useAtom(updateUserProfileAtom);
  const [userProfile, setUserProfile] = useAtom(userProfileAtom);
  const [getMigrationData] = useAtom(migratedUserDataAtom);
  const [, setIsLoading] = useAtom(isPreferenceLoadingAtom);
  const [getProfileData, getProfileDataResult] = useLazyGetProfileQuery();
  const { openSnackbar } = useSnackbar();
  const userProfileData = userProfile?.data;

  const methods = useForm<ProfileInformation>({
    resolver: zodResolver(schema),
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, errors, isDirty, isValid },
  } = methods;

  useEffect(() => {
    const details = userProfile?.data;

    methods.reset({
      firstName: details?.first_name || '',
      lastName: details?.last_name || '',
      dateOfBirth: details?.date_of_birth ? new Date(details?.date_of_birth) : undefined,
      gender: details?.gender || '',
    });
  }, [userProfile?.data]);

  useEffect(() => {
    if (isEmpty(userProfileData) && !isEmpty(getMigrationData?.data)) {
      const data = getMigrationData?.data as UserProfileComplete;

      methods.reset({
        firstName: data?.first_name || '',
        lastName: data?.last_name || '',
        dateOfBirth: data?.date_of_birth ? new Date(data?.date_of_birth) : undefined,
        gender: data.gender,
        joinedDate: data.joined_date ? new Date(data.joined_date) : new Date(),
      });
    }
  }, [userProfileData, getMigrationData?.data, methods]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(undefined, { keepValues: true });
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (updateUser.isSuccess && !isUpdatingProfile) {
      setIsUpdatingProfile(true);

      void getProfileData(undefined)
        .then(({ data }) => {
          if (data) {
            setUserProfile({ data });
            setIsUpdatingProfile(false);
            openSnackbar('Profile updated successfully', 'success');

            if (handleNextStep && handleComplete) {
              handleComplete();
              updateUser.reset();
              handleNextStep(true);
            }
          }
        })
        .catch((error) => {
          openSnackbar((error as Error)?.message || 'Error updating profile', 'error');
          setIsUpdatingProfile(false);
        });
    }
  }, [updateUser.isSuccess, updateUser.data, openSnackbar, handleNextStep, isUpdatingProfile]);

  useEffect(() => {
    if (updateUser.isError) {
      openSnackbar((updateUser.error as Error)?.message || 'Something went wrong', 'error');
    }
  }, [updateUser.isError, updateUser.error, openSnackbar]);

  useEffect(() => {
    if (!isEmpty(userProfile?.data)) {
      handleComplete();
    }
  }, [userProfile?.data, handleComplete]);

  useEffect(() => {
    setIsLoading(updateUser.isLoading || getMigrationData.isLoading || getProfileDataResult.isFetching);
  }, [updateUser.isLoading, getMigrationData?.isLoading, getProfileDataResult.isFetching, setIsLoading]);

  const onSubmitHandler: SubmitHandler<ProfileInformation> = (values) => {
    const _userProfileData: Omit<UserProfile, 'sub' | 'email'> = {
      first_name: values.firstName?.trim(),
      last_name: values.lastName?.trim(),
      date_of_birth: values.dateOfBirth,
      joined_date: values.joinedDate,
      gender: values.gender || '',
    };

    if (!isEmpty(_userProfileData) && ((isDirty && isValid) || isEmpty(userProfile?.data))) {
      void updateUser.mutate(_userProfileData);
    } else if (handleNextStep && !isEmpty(userProfile?.data)) {
      handleNextStep();
    }
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmitHandler)}>
        <Grid spacing={2} container direction="column" maxWidth="578px">
          <Grid item p={0} mb={3}>
            <Typography variant="h3" gutterBottom>
              Profile information
            </Typography>
          </Grid>
          <Grid item>
            <CustomFormInput required name="firstName" label="First name *" placeholder="Enter your first name" />
          </Grid>
          <Grid item>
            <CustomFormInput required name="lastName" label="Last name *" placeholder="Enter your last name" />
          </Grid>
          <Grid item mt={1}>
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, onBlur, value } }) => (
                <DoBInput value={value} onChange={onChange} onBlur={onBlur} error={errors?.dateOfBirth?.message} />
              )}
            />
          </Grid>
          <Grid item mt={1}>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, onBlur, value } }) => (
                <GenderInput
                  value={value as GenderType}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={errors?.gender?.message}
                />
              )}
            />
          </Grid>
          <Grid item mt={1}>
            <AgeAndGenderInfo />
          </Grid>
          <Grid item display="flex" justifyContent="flex-end">
            <LoadingButton
              sx={{
                width: '45%',
                marginTop: 2,
              }}
              variant="contained"
              color="primary"
              type="submit"
              loading={updateUser.isLoading}
            >
              Next
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
}

export default ProfileInformation;
