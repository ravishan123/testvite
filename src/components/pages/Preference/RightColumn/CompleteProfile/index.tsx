import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler, FormProvider, Controller, FieldError } from 'react-hook-form';
import { TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { isEqual } from 'lodash-es';

import { getRoute } from '@utils/configs/routesConfig';
import { UserProfileComplete } from '@utils/types/userProfile.type';
import { userProfilePictureAtom } from '@serverAtoms/users/userProfilePicture.atom';
import { isPreferenceLoadingAtom } from '@applicationAtoms/preference.atom';
import { useLazyGetProfileQuery } from '@store/slices/profile/profile.slice';
import { updateUserProfileAtom, userProfileAtom } from '@serverAtoms/users/userProfile.atom';

import { Grid, Box } from '@ui/layout';
import { useTheme } from '@ui/theme';
import { Button } from '@ui/button';
import InputLabel from '@ui/inputLabel';
import { Typography } from '@ui/typography';
import { LoadingButton } from '@ui/button';
import { FormHelperText } from '@ui/forms';
import { useSnackbar } from '@ui/snackBar';
import Image from '@ui/image';
import CountryCitySelector from '@ui/CountryCitySelector';
import { countryCodes } from '@utils/data/countries.data';

import CustomPhoneInput from '@globals/CustomPhoneInput';

import schema from './schema';
import UploadPictureModal from './UploadPictureModal';

type CompleteProfile = TypeOf<typeof schema>;

type CompleteProfileProps = {
  handleBackStep: () => void;
};

type UserProfilePayload = Pick<UserProfileComplete, 'country' | 'city' | 'phone' | 'about_me'> | null;
type Payload =
  | {
      [K in keyof UserProfilePayload]?: UserProfilePayload[K];
    }
  | null;

const CHARACTER_LIMIT = 2000;

function CompleteProfile({ handleBackStep }: CompleteProfileProps) {
  const { palette, fontSize } = useTheme();
  const navigate = useNavigate();
  const appLocation: { state: { from: string } } = useLocation();
  const [updateUser] = useAtom(updateUserProfileAtom);
  const [userProfile, setUserProfile] = useAtom(userProfileAtom);
  const [isLoading, setIsLoading] = useAtom(isPreferenceLoadingAtom);
  const [getProfileData, getProfileDataResult] = useLazyGetProfileQuery();
  const { openSnackbar } = useSnackbar();

  const [userProfilePicture] = useAtom(userProfilePictureAtom);

  const [open, setOpen] = useState(false);
  const userProfileData = userProfile?.data;

  const onClose = () => setOpen(false);

  const methods = useForm<CompleteProfile>({
    resolver: zodResolver(schema),
  });

  const {
    reset,
    handleSubmit,
    control,
    register,
    formState: { isSubmitSuccessful, errors, isDirty, isValid },
    watch,
  } = methods;

  useEffect(() => {
    const details = userProfile?.data;

    methods.reset({
      location: {
        country: details?.country || '',
        city: details?.city || '',
      },
      phone: details?.phone || '',
      about: details?.about_me || '',
    });
  }, [userProfile?.data]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(undefined, { keepValues: true });
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (updateUser.isSuccess) {
      void getProfileData(undefined)
        .then((data) => {
          setUserProfile({ data: data?.data });
          openSnackbar('Profile updated successfully', 'success');

          updateUser.reset();
          navigate(getRoute(`private.app.${appLocation.state?.from?.replace('/', '.') || 'home'}`));
        })
        .catch((error) => {
          openSnackbar((error as Error)?.message || 'Error updating profile', 'error');
        });
    }
  }, [updateUser.isSuccess, updateUser.data, userProfile, openSnackbar]);

  useEffect(() => {
    if (updateUser.isError) {
      openSnackbar((updateUser.error as Error)?.message || 'Something went wrong', 'error');
    }
  }, [updateUser.isError, updateUser.error, openSnackbar]);

  const onSubmitHandler: SubmitHandler<CompleteProfile> = (values) => {
    const {
      location: { country, city },
      phone,
      about,
    }: CompleteProfile = values;

    const _userProfileData: Payload = {
      ...((!isEqual(userProfileData?.country, country) || !isEqual(userProfileData?.city, city)) && { city, country }),
      ...(phone && !isEqual(userProfileData?.phone, phone) && { phone: !countryCodes.includes(phone) ? phone : '' }),
      ...(!isEqual(userProfileData?.about_me, about) && { about_me: about }),
    };

    if (isDirty && isValid && _userProfileData) {
      void updateUser.mutate(_userProfileData);
    } else {
      navigate(getRoute(`private.app.${appLocation.state?.from?.replace('/', '.') || 'home'}`));
    }
  };

  useEffect(() => {
    setIsLoading(updateUser.isLoading || getProfileDataResult.isFetching);
  }, [updateUser.isLoading, getProfileDataResult.isFetching, setIsLoading]);

  return (
    <FormProvider {...methods}>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmitHandler)}>
        <Grid spacing={2} container direction="column" maxWidth="578px" minWidth="518px">
          <Grid item p={0} mb={3}>
            <Typography variant="h3" gutterBottom>
              Complete your profile
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
              }}
            >
              A little bit of information would make your profile complete
            </Typography>
          </Grid>
          <Grid item display="flex" flexDirection="row" alignContent="flex-start" alignItems="flex-start" mb={3}>
            <Box
              sx={{
                height: '90px',
                width: '90px',
              }}
            >
              <Image
                isAvatar
                width={88}
                height={88}
                src={userProfilePicture.data}
                alt="profile image"
                sx={{ fontSize: fontSize.sm, border: `1px solid ${palette.grey['200']}` }}
              />
            </Box>
            <Button
              variant="outlined"
              sx={{ marginLeft: '24px', marginTop: '25px', width: '140px' }}
              onClick={() => setOpen(true)}
            >
              Upload picture
            </Button>
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomPhoneInput
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={(errors?.phone as FieldError)?.message}
                />
              )}
            />
          </Grid>

          <Grid item>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <CountryCitySelector value={value} onChange={onChange} onBlur={onBlur} />
              )}
            />
            <FormHelperText error={Boolean(errors.location)}>
              {errors.location?.city?.message || errors.location?.country?.message || errors.location?.message}
            </FormHelperText>
          </Grid>

          <Grid item marginTop="20px">
            <InputLabel component="label" sx={{ fontSize: '12px', color: palette.text.primary }}>
              About me
            </InputLabel>
            <TextField
              {...register('about')}
              placeholder="Write few sentences about you"
              style={{ width: '100%' }}
              minRows={2}
              maxRows={4}
              multiline
              InputProps={{
                endAdornment: (
                  <div style={{ position: 'absolute', right: '12px', bottom: '6px' }}>
                    <Typography sx={{ color: palette.grey[200] }}>
                      {watch('about')?.length}/{CHARACTER_LIMIT}
                    </Typography>
                  </div>
                ),
              }}
            />
            <FormHelperText error={Boolean(errors.about?.message)}>
              {(errors.about as FieldError)?.message}
            </FormHelperText>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={6} pr="16px">
                <Button onClick={handleBackStep} fullWidth variant="outlined" color="secondary">
                  Back
                </Button>
              </Grid>
              <Grid item xs={6} pl="16px">
                <LoadingButton fullWidth color="primary" variant="contained" type="submit" loading={isLoading}>
                  Complete
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <UploadPictureModal isOpen={open} onClose={onClose} />
    </FormProvider>
  );
}

export default CompleteProfile;
