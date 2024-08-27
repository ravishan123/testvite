import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Storage } from 'aws-amplify';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useCreateOrganizationMutation } from '@store/slices/organization/organization.slice';
import { getRoute } from '@utils/configs/routesConfig';

import { StepOne } from '../common/stepper/steps/stepOne';
import { StepperFooter } from '../common/stepper/stepperFooter';
import { StepperHeader } from '../common/stepper/stepperHeader';

import OrgDetails from '../common/orgDetails';
import { stepOneSchema, stepTwoSchema, stepThreeSchema } from './schema';
import OrgCauses from '../common/selectCauses';
import OrgUnsdg from '../common/selectUnsgd';
import { StepThree } from '../common/stepThree';
import { useSnackbar } from '@ui/snackBar';

type OrgCreationProps = {
  onChange: (isDirty: boolean) => void;
};
export interface IForm {
  organizationName: string;
  companyType: string;
  causes: string[];
  organizationType: string;
  organizationTypeOther: string;
  orgSize: string;
  isSocialEnterprise: string;
  organizationDescription: string;
  phoneNumber: string;
  unsdg: string[];
  location: {
    country: string;
    city: string;
  };
  nofEmployees: string;
  website: string;
  profileInformation: string;
  termsAndConditions: boolean;
  organizationProfilePicture: string;
}

const steps = ['Step 1', 'Step 2', 'Step 2'];
const bucket = import.meta.env.VITE_ORGANIZATION_RESOURCE_BUCKET as string;

const OrgCreation = ({ onChange }: OrgCreationProps) => {
  const { openSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createOrg, createOrgResult] = useCreateOrganizationMutation();
  const [isComplete, setIsComplete] = useState(false);

  const navigate = useNavigate();

  const currentSchema = useMemo(() => {
    switch (activeStep) {
      case 0:
        return stepOneSchema;
      case 1:
        return stepTwoSchema;
      case 2:
        return stepThreeSchema;
      default:
        return z.object({});
    }
  }, [activeStep]);

  const methods = useForm<IForm>({
    defaultValues: {
      organizationName: '',
      companyType: '',
      causes: [],
      organizationType: '',
      organizationTypeOther: '',
      orgSize: '',
      isSocialEnterprise: 'no',
      organizationDescription: '',
      phoneNumber: '',
      unsdg: [],
      location: {
        city: '',
        country: '',
      },
      nofEmployees: '',
      website: '',
      profileInformation: '',
      termsAndConditions: false,
      organizationProfilePicture: '',
    },
    resolver: zodResolver(currentSchema),
    mode: 'onChange',
  });
  const {
    formState: { isDirty, isSubmitSuccessful },
    reset,
  } = methods;

  const onSubmit = async () => {
    setIsComplete(true);
    const formData = methods.getValues();
    const payload = {
      organizationName: formData.organizationName,
      organizationType:
        formData.organizationType === '0'
          ? { custom_orgtype: formData.organizationTypeOther }
          : { orgType: formData.organizationType },
      isSocialEnterprise: formData.isSocialEnterprise === 'yes' ? true : false,
      aboutOrganization: formData.organizationDescription,
      organizationLocation: {
        city: formData.location.city,
        country: formData.location.country,
      },
      organizationContactNumber: formData.phoneNumber.replace(' ', ''),
      ...(formData.causes.length > 0 && {
        organizationCauses: {
          causes: formData.causes.map((cause) => cause),
        },
      }),
      ...(formData.unsdg.length > 0 && {
        organizationUnsdg: {
          sdg: formData.unsdg,
        },
      }),
      ...(formData.nofEmployees && {
        numberOfEmployees: formData.nofEmployees,
      }),
      ...(formData.website && {
        organizationWebsite: formData.website,
      }),
      ...(formData.profileInformation && {
        organizationSocialLink: formData.profileInformation,
      }),
      ...(selectedFile &&
        formData.organizationProfilePicture && {
          organizationProfile: formData.organizationProfilePicture, //TODO: Generate and update user profile picture id
        }),
    };
    try {
      await createOrg(payload)
        .then(async (response) => {
          if ('data' in response) {
            if (selectedFile) {
              await Storage.put(formData.organizationProfilePicture, selectedFile, {
                bucket: bucket,
                contentType: selectedFile.type,
              });
            }

            navigate(getRoute('private.app.organizations.profile', { id: response.data.data?.organizationId }), {
              state: { organizationCreated: true },
            });
          }
        })
        .catch((err: unknown) => {
          openSnackbar((err as Error).message, 'error');
        });
    } catch (err) {
      openSnackbar((err as Error).message, 'error');
    }
    if (createOrgResult.isSuccess) {
      reset();
    }
    setIsComplete(false);
  };

  const handleNextClick = () => async () => {
    const data = await methods.trigger();
    data && setActiveStep((prev) => prev + 1);
  };

  useEffect(() => {
    onChange(isDirty && (!createOrgResult.isSuccess || !isSubmitSuccessful || createOrgResult.isError));
  }, [isDirty, isSubmitSuccessful, createOrgResult.isError, createOrgResult.isSuccess]);

  const isLocked = isDirty && (!createOrgResult.isSuccess || !isSubmitSuccessful || createOrgResult.isError);

  return !isLocked && !isComplete && createOrgResult.data && createOrgResult.data.data?.organizationId ? (
    <Navigate
      to={getRoute('private.app.organizations.profile', { id: createOrgResult.data.data?.organizationId })}
      state={{ organizationCreated: true }}
    />
  ) : (
    <>
      <FormProvider {...methods}>
        <StepperHeader activeStep={activeStep} steps={steps} />

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {activeStep === 0 && <StepOne />}
          {activeStep === 1 && (
            <>
              <OrgDetails />
              <OrgCauses />
              <OrgUnsdg />
            </>
          )}
          {activeStep === 2 && (
            <>
              <StepThree setSelectedFile={setSelectedFile} />
            </>
          )}

          <StepperFooter
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            steps={steps}
            handleNextClick={handleNextClick}
            isLoading={createOrgResult.isLoading || isComplete}
            type="create"
          />
        </form>
      </FormProvider>
    </>
  );
};

export default OrgCreation;
