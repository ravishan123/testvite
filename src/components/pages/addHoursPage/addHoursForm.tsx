import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import endOfDay from 'date-fns/endOfDay';
import formatISO from 'date-fns/formatISO';
import startOfDay from 'date-fns/startOfDay';

import { AddHoursForm } from '@utils/types/volunteer.type';
import { useAddHourRequestMutation } from '@store/slices/volunteer/volunteer.slice';

import { Grid } from '@ui/layout';
import { Button } from '@ui/button';
import { useSnackbar } from '@ui/snackBar';
import { Typography } from '@ui/typography';

import { OTHER_ORG_TYPE } from '@globals/orgAutoComplete';
import { useCustomContext } from '@globals/context';
import { CustomPortalContext } from '@globals/customPortal';

import ContentContainer from '@globals/contentContainer';

import { AppContainerContext } from '@layouts/containers/appContainer';

import ConfirmationModal from './confirmationModal';
import { addHoursFormSchema } from './schema';
import VolunteerHoursFormBody from '@globals/forms/volunteerHoursFormBody';

type AddHoursFormProps = {
  onChange: (isDirty: boolean) => void;
};

const defaultValues: AddHoursForm = {
  date: {
    startDate: null,
    endDate: null,
  },
  duration: {
    hours: 0,
    minutes: 0,
  },
  activityDescription: '',
  activityLocation: {
    address1: '',
    address2: '',
    postalCode: '',
    city: '',
    state: '',
    country: '',
  },
  isRemote: false,
  coordinator: {
    email: '',
    name: '',
  },
  organization: null,
  skills: [],
  unsdgs: [],
  causes: [],
};

export default function AddHoursForm({ onChange }: AddHoursFormProps) {
  const { prevLocation, portal, destroyPortal } = useCustomContext<CustomPortalContext & AppContainerContext>();
  const navigate = useNavigate();
  const [createAddHourRequest, { isLoading, isError, isSuccess, error }] = useAddHourRequestMutation();
  const { openSnackbar } = useSnackbar();
  const methods = useForm<AddHoursForm>({
    defaultValues,
    resolver: zodResolver(addHoursFormSchema),
  });
  const {
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitSuccessful },
  } = methods;

  const { organization } = methods.getValues();

  const handleOnSubmit = (data: AddHoursForm) => {
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
    const { name: orgName, value: orgValue, id: orgId } = organization || {};
    const { email: coordinatorEmail, name: coordinatorName } = coordinator || {};

    const customSkills: { skill: string }[] = [];
    const defaultSkills: string[] = [];

    if (skills.length) {
      skills.forEach((skill) => {
        if (typeof skill === 'string') {
          customSkills.push({ skill });
        } else {
          defaultSkills.push(skill?.id);
        }
      });
    }

    if (orgName && startDate && endDate) {
      const payload = {
        startDate: formatISO(startOfDay(startDate)),
        endDate: formatISO(endOfDay(endDate)),
        hours,
        minutes,
        ...(!isRemote ? { isRemote, activityLocation } : { isRemote }),
        ...rest,
        ...(orgValue === OTHER_ORG_TYPE
          ? { organizationName: orgName, coordinator: { name: coordinatorName, email: coordinatorEmail } }
          : { organizationName: orgName, orgId, coordinator: { name: coordinatorName } }),
        ...(customSkills.length || defaultSkills.length
          ? {
              skills: {
                ...(customSkills.length ? { customSkills } : {}),
                ...(defaultSkills.length ? { defaultSkills } : {}),
              },
            }
          : {}),
      };

      void createAddHourRequest(payload);
    } else {
      openSnackbar('Please select an organization', 'error');
    }
  };

  useEffect(() => {
    onChange(isDirty && (!isSubmitSuccessful || !isSuccess || isError));
  }, [isDirty, isSubmitSuccessful, isSuccess, isError]);

  useEffect(() => {
    if (isError) {
      openSnackbar((error as Error)?.message || 'Error occurred while creating hour request', 'error');
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      portal && portal(<ConfirmationModal onClick={destroyPortal} />);

      if (prevLocation !== window.location.pathname) {
        setTimeout(() => {
          navigate(prevLocation);
        }, 100);
      } else {
        reset(defaultValues);
      }
    }
  }, [isSuccess, portal, prevLocation]);

  return (
    <ContentContainer size={[4, 4, 4, 4]}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Grid container rowSpacing={4}>
            <VolunteerHoursFormBody />
            <Grid item xs={12}>
              <Typography variant="helper-text">
                Once the verification request is submitted, you will not be able to edit or delete it.
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button type="submit" sx={{ maxWidth: 327 }} loading={isLoading} fullWidth>
                {organization?.id ? `Submit` : `Invite to verify hours`}
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </ContentContainer>
  );
}
