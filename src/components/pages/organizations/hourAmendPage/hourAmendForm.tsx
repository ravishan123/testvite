import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import endOfDay from 'date-fns/endOfDay';
import formatISO from 'date-fns/formatISO';
import startOfDay from 'date-fns/startOfDay';
import { find } from 'lodash-es';

import { AddHoursForm } from '@utils/types/volunteer.type';
import { ActivityData, ActivityLocation } from '@utils/types/activity.type';
import { Org } from '@utils/types/organization.type';
import { ActivityApprovalStatusEnum } from '@utils/enums/activity.enum';
import { getRoute } from '@utils/configs/routesConfig';
import countries from '@utils/data/countries.data';
import { useFetchVolunteerActivityQuery, useVerifyHourRequestMutation } from '@store/slices/volunteer/volunteer.slice';

import { Grid } from '@ui/layout';
import { Button } from '@ui/button';
import { useSnackbar } from '@ui/snackBar';
import { FormLabel } from '@ui/forms';
import { TextField } from '@ui/textField';
import PageLoader from '@ui/pageLoader';

import ContentContainer from '@globals/contentContainer';
import VolunteerHoursFormBody from '@globals/forms/volunteerHoursFormBody';
import { useCustomContext } from '@globals/context';
import VolunteerAvatar from '@globals/volunteerAvatar';

import { AppContainerContext } from '@layouts/containers/appContainer';

import { amendHoursFormSchema } from './schema';

import { Typography } from '@ui/typography';
import { useTheme } from '@ui/theme';
import HourVerificationConfirmationModal from '../hourDetailsPage/hourVerificationConfirmationModal';
import { CustomPortalContext } from '@globals/customPortal';

type HourAmendFormProps = {
  onChange: (isDirty: boolean) => void;
};

type AmendHoursForm = AddHoursForm & {
  amendedReason: string;
};

type SkillsUnion = {
  customSkills: { skill: string }[];
  defaultSkills: string[];
};

type VolHour = {
  hour?: number;
  minutes?: number;
} | null;

type VolunteerHour = {
  hours: number;
  minutes: number;
};

const defaultValues = (hourDetails: ActivityData | undefined): AmendHoursForm => {
  const {
    startDate,
    endDate,
    volunteerHour,
    activityDescription,
    isRemote,
    activityLocation,
    skills,
    unsdgs,
    causes,
    organization,
    orgId,
  } = hourDetails || {};

  const customSkills = (skills?.customSkills?.map((skill) => skill?.['skill']) || []).filter(Boolean);
  const defaultSkills = (skills?.defaultSkills?.map((skill) => skill.name) || []).filter(Boolean);
  const _skills = [...customSkills, ...defaultSkills];

  const _unsdg = unsdgs?.map((item) => item.id) || [];
  const _causes = causes?.map((item) => item.id) || [];

  const _organization: Org = {
    logo: organization?.logo || '',
    name: organization?.name || '',
    value: orgId || '',
    id: orgId || '',
    orgtype: '',
  };

  return {
    date: {
      startDate: new Date(startDate || ''),
      endDate: new Date(endDate || ''),
    },
    duration: {
      hours: volunteerHour?.hours || 0,
      minutes: volunteerHour?.minutes || 0,
    },
    activityDescription: activityDescription || '',
    activityLocation: {
      address1: activityLocation?.address1 || '',
      address2: activityLocation?.address2 || '',
      postalCode: activityLocation?.postalCode || '',
      state: activityLocation?.state || '',
      city: activityLocation?.city || '',
      country: activityLocation?.country || '',
    },
    isRemote: isRemote || false,
    coordinator: {
      email: '',
      name: '',
    },
    organization: _organization,
    skills: _skills,
    unsdgs: _unsdg,
    causes: _causes,
    amendedReason: '',
  };
};

const parseAddress = (location: ActivityLocation): ActivityLocation => {
  const { address1, address2, postalCode, state, city, country } = location || {};
  const countryCode = find(countries, { name: country.trim() })?.code || null;
  return {
    ...(address1 ? { address1 } : {}),
    ...(address2 ? { address2 } : {}),
    city: city || '',
    ...(state ? { state } : {}),
    ...(postalCode ? { postalCode } : {}),
    country: countryCode || country || '',
  };
};

export default function HourAmendForm({ onChange }: HourAmendFormProps) {
  const CHARACTER_LIMIT = 250;
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { hourId, id: orgId } = useParams();
  const { openSnackbar } = useSnackbar();
  const [volHours, setVolHours] = useState<VolHour>(null);

  const { data: hourDetails, isFetching } = useFetchVolunteerActivityQuery(hourId || '', { skip: !hourId });
  const [
    verifyHours,
    { isLoading, isError: isErrorVerifyHours, error: verifyHourError, isSuccess: isSuccessVerifyHours },
  ] = useVerifyHourRequestMutation();

  const methods = useForm<AmendHoursForm>({
    defaultValues: defaultValues(hourDetails),
    resolver: zodResolver(amendHoursFormSchema),
  });

  const { prevLocation, portal, destroyPortal } = useCustomContext<CustomPortalContext & AppContainerContext>();

  const {
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitSuccessful, dirtyFields },
  } = methods;

  useEffect(() => {
    reset(defaultValues(hourDetails));
    setVolHours(null);
  }, [hourDetails]);

  const handleOnSubmit = (data: AmendHoursForm) => {
    const {
      date: { startDate, endDate },
      duration: { hours, minutes },
      activityLocation,
      isRemote,
      organization,
      coordinator,
      skills,
      ...rest
    } = data;

    setVolHours({
      ...(hours && { hours }),
      ...(minutes && { minutes }),
    });

    const isFormDirty = Object.keys(dirtyFields).filter((key) => key !== 'amendedReason').length > 0;

    if (!isFormDirty) {
      openSnackbar('Please update the details to amend the hour request', 'error');
      return;
    }

    let amendSkills: SkillsUnion = { customSkills: [], defaultSkills: [] };

    if (skills.length) {
      amendSkills = skills.reduce(
        (acc: SkillsUnion, cur) => {
          if (typeof cur === 'string') {
            const foundObj = find(hourDetails?.skills?.defaultSkills, { name: cur.trim() });
            return foundObj
              ? {
                  ...acc,
                  defaultSkills: [...acc.defaultSkills, foundObj.id],
                }
              : {
                  ...acc,
                  customSkills: [...acc.customSkills, { skill: cur }],
                };
          }
          return {
            ...acc,
            defaultSkills: [...acc.defaultSkills, cur?.id],
          };
        },
        { customSkills: [], defaultSkills: [] }
      );
    }

    if (hourId && orgId && startDate && endDate) {
      const payload = {
        requestId: hourId,
        orgId,
        approvalState: ActivityApprovalStatusEnum.Amended,
        processDetails: {
          startDate: formatISO(startOfDay(startDate)),
          endDate: formatISO(endOfDay(endDate)),
          hours,
          minutes,
          ...rest,
          ...(!isRemote ? { isRemote, activityLocation: parseAddress(activityLocation) } : { isRemote }),
          ...(amendSkills.customSkills.length || amendSkills.defaultSkills.length
            ? {
                skills: {
                  ...(amendSkills.customSkills.length ? { customSkills: amendSkills.customSkills } : {}),
                  ...(amendSkills.defaultSkills.length ? { defaultSkills: amendSkills.defaultSkills } : {}),
                },
              }
            : {}),
        },
      };

      void verifyHours(payload);
    } else {
      openSnackbar('Please select an organization', 'error');
    }
  };

  useEffect(() => {
    onChange(isDirty && (!isSubmitSuccessful || !isSuccessVerifyHours || isErrorVerifyHours));
  }, [isDirty, isSubmitSuccessful, isSuccessVerifyHours, isErrorVerifyHours]);

  useEffect(() => {
    if (isErrorVerifyHours) {
      openSnackbar((verifyHourError as Error)?.message || 'Error occurred while creating hour request', 'error');
    }
  }, [isErrorVerifyHours, verifyHourError]);

  useEffect(() => {
    if (isSuccessVerifyHours && !isErrorVerifyHours) {
      portal &&
        portal(
          <HourVerificationConfirmationModal
            userId={hourDetails?.userDetails?.id || ''}
            firstName={hourDetails?.userDetails?.firstName || ''}
            lastName={hourDetails?.userDetails?.lastName || ''}
            receivedHours={isSuccessVerifyHours ? (volHours as VolunteerHour) : hourDetails?.volunteerHour}
            onClick={destroyPortal}
          />
        );

      setTimeout(() => {
        navigate(getRoute('private.app.organizations.profile.verifyHours', { id: orgId }));
      }, 100);
    }
  }, [
    isSuccessVerifyHours,
    isErrorVerifyHours,
    hourDetails?.userDetails?.id,
    hourDetails?.userDetails?.firstName,
    hourDetails?.userDetails?.lastName,
    hourDetails?.volunteerHour?.hours,
    hourDetails?.volunteerHour?.minutes,
    orgId,
  ]);

  return isFetching ? (
    <PageLoader target="component" open />
  ) : (
    <ContentContainer size={[4, 4, 4, 4]}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <Grid container columnSpacing={2}>
                <Grid item xs={12}>
                  <FormLabel component="label">Requested by</FormLabel>
                </Grid>
                <Grid item xs={12} mt={1}>
                  <VolunteerAvatar
                    id={hourDetails?.userDetails?.id || ''}
                    firstName={hourDetails?.userDetails?.firstName || ''}
                    lastName={hourDetails?.userDetails?.lastName || ''}
                    isLoading={isFetching}
                    isFilled
                  />
                </Grid>
              </Grid>
            </Grid>
            <VolunteerHoursFormBody isAmend />
            <Grid item xs={12}>
              <Grid container columnSpacing={2}>
                <Grid item xs={12}>
                  <FormLabel component="label" required>
                    Name of the person who can verify the above details
                  </FormLabel>
                </Grid>
                <Grid item xs={12}>
                  <TextField disabled value={hourDetails?.coordinatorDetails?.ownerName} fullWidth />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="amendedReason"
                control={methods.control}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Grid container columnSpacing={2}>
                    <Grid item xs={12}>
                      <FormLabel component="label" required>
                        Reason to amend hours verification request
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={Boolean(error)}
                        helperText={error?.message}
                        multiline
                        rows={7}
                        fullWidth
                        placeholder="Enter reason to modify"
                        inputProps={{
                          maxLength: CHARACTER_LIMIT,
                        }}
                        InputProps={{
                          endAdornment: (
                            <div style={{ position: 'absolute', right: '12px', bottom: '8px', marginBottom: 6 }}>
                              <Typography sx={{ color: palette.grey[200] }}>
                                {value?.length}/{CHARACTER_LIMIT}
                              </Typography>
                            </div>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end" sx={{ textAlign: 'right' }} columnGap={1}>
              <Button
                variant="contained-secondary"
                color="secondary"
                sx={{ maxWidth: 186, minHeight: 44, height: 44 }}
                disabled={isLoading}
                fullWidth
                onClick={() => navigate(prevLocation)}
              >
                Cancel
              </Button>
              <Button type="submit" sx={{ maxWidth: 186, minHeight: 44, height: 44 }} loading={isLoading} fullWidth>
                Amend &amp; Approve
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </ContentContainer>
  );
}
