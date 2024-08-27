import { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Storage } from 'aws-amplify';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  useGetOrganizationsEditQuery,
  useUpdateOrganizationMutation,
} from '@store/slices/organization/organization.slice';
import { getRoute } from '@utils/configs/routesConfig';
import { StepOne } from './stepper/steps/stepOne';
import { StepperFooter } from '../common/stepper/stepperFooter';
import { StepperHeader } from '../common/stepper/stepperHeader';
import { getStep } from '@utils/functions/getLocationStep';
import OrgDetails from '../common/orgDetails';
import { stepTwoSchema, stepThreeSchema, getStepOneSchema } from './schema';
import OrgCauses from '../common/selectCauses';
import OrgUnsdg from '../common/selectUnsgd';
import { StepThree } from '../common/stepThree';
import { useSnackbar } from '@ui/snackBar';
import PageLoader from '@ui/pageLoader';
import { getOrganizationLogo } from '@utils/functions/avatarUtils';
import { isEqual } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { FormSkeleton } from '@globals/formSkeleton';

const profileImageKey: string = uuidv4();

type OrgEditProps = {
  onChange: (isDirty: boolean) => void;
};
export interface IForm {
  orgId: string;
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

const OrgEdit = ({ onChange }: OrgEditProps) => {
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const contextParam = queryParams.get('context');

  const [updateOrg, { isError: orgError, isLoading: orgLoading, isSuccess: orgSuccess, data: updatedResult }] =
    useUpdateOrganizationMutation();
  const { id: orgId } = useParams() as { id: string };

  const { data: organization, isFetching } = useGetOrganizationsEditQuery(
    { orgId: orgId, contextType: 'edit' },
    { refetchOnMountOrArgChange: true }
  );

  const currentSchema = useMemo(() => {
    switch (activeStep) {
      case 0:
        return getStepOneSchema(orgId);
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
      orgId: '',
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
    context: orgId,
    mode: 'onChange',
  });
  const {
    formState: { isDirty, isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (contextParam) {
      setActiveStep(getStep({ contextParam: contextParam, locationType: 'orgEdit' }));
    }
  }, [contextParam]);

  useEffect(() => {
    onChange(isDirty && (!orgSuccess || !isSubmitSuccessful || orgError));
    if (orgSuccess && !orgError && updatedResult?.data.organizationId) {
      navigate(getRoute('private.app.organizations.profile', { id: updatedResult?.data.organizationId }));
    }
  }, [isDirty, isSubmitSuccessful, orgError, orgSuccess, updatedResult?.data.organizationId]);

  useEffect(() => {
    const details = organization;
    methods.reset({
      orgId: orgId || '',
      organizationName: details?.name || '',
      causes: details?.causes || [],
      organizationType: details?.organizationType?.isCustom ? '0' : details?.organizationType?.id || '0',
      organizationTypeOther: details?.organizationType?.custom_orgtype || '',
      orgSize: details?.numberOfEmployees?.id || '',
      isSocialEnterprise: details?.social_enterprise === true ? 'yes' : 'no',
      organizationDescription: details?.about_us || '',
      phoneNumber: details?.phone_number || '',
      unsdg: details?.sdgs || [],
      location: {
        country: details?.country || '',
        city: details?.city || '',
      },
      nofEmployees: details?.numberOfEmployees?.id || '',
      website: details?.website || '',
      profileInformation: details?.social_link || '',
      termsAndConditions: true,
    });
  }, [organization]);

  const onSubmit = async () => {
    setIsComplete(true);
    const formData = methods.getValues();
    const _isSocialEnterprise = formData.isSocialEnterprise === 'yes' ? true : false;
    const _causes = formData.causes.map((cause) => cause);
    const _website = organization?.website === null ? '' : organization?.website;
    const _social_link = organization?.social_link === null ? '' : organization?.social_link;
    const _numberOfEmployees =
      organization?.numberOfEmployees?.id === null || undefined ? '' : organization?.numberOfEmployees?.id;
    const _organizationType = organization?.organizationType?.isCustom ? '0' : organization?.organizationType?.id;

    if (organization?.logo && selectedFile) {
      try {
        await Storage.put(organization.logo, selectedFile, {
          bucket,
          contentType: selectedFile.type,
        }).catch((error) => {
          openSnackbar((error as Error)?.message || 'Error updating logo', 'error');
        });
      } catch (error) {
        openSnackbar((error as Error)?.message || 'Error updating logo', 'error');
      }
    } else if (organization?.logo === null && selectedFile?.type) {
      await Storage.put(profileImageKey, selectedFile, {
        bucket,
        contentType: selectedFile?.type,
      }).catch((error) => {
        openSnackbar((error as Error)?.message || 'Error updating logo', 'error');
      });
    }
    const _orgUpdateData = {
      ...(!isEqual(organization?.name, formData.organizationName) && {
        organizationName: formData.organizationName.trim(),
      }),
      ...(!isEqual(organization?.social_enterprise, _isSocialEnterprise) && {
        isSocialEnterprise: _isSocialEnterprise,
      }),
      ...(!isEqual(organization?.about_us, formData.organizationDescription) && {
        aboutOrganization: formData.organizationDescription,
      }),

      ...(!isEqual(organization?.phone_number, formData.phoneNumber.replace(' ', '')) && {
        organizationContactNumber: formData.phoneNumber.replace(' ', ''),
      }),

      ...((!isEqual(organization?.country, formData.location.country) ||
        !isEqual(organization?.city, formData.location.city)) && {
        organizationLocation: {
          country: formData.location.country,
          city: formData.location.city,
        },
      }),
      ...(!isEqual(organization?.causes, _causes) && { organizationCauses: { causes: _causes } }),
      ...(!isEqual(organization?.sdgs, formData.unsdg) && {
        organizationUnsdg: {
          sdg: formData.unsdg,
        },
      }),
      ...(!isEqual(_website, formData.website) && {
        organizationWebsite: formData.website === '' ? null : formData.website,
      }),
      ...(!isEqual(_social_link, formData.profileInformation) && {
        organizationSocialLink: formData.profileInformation === '' ? null : formData.profileInformation,
      }),
      ...(!isEqual(_numberOfEmployees, formData.nofEmployees) && {
        numberOfEmployees: formData.nofEmployees === '' ? null : formData.nofEmployees,
      }),

      ...(formData.organizationType === '0' &&
        !isEqual(formData.organizationTypeOther, organization?.organizationType?.custom_orgtype) && {
          organizationType: {
            custom_orgtype: formData.organizationTypeOther,
          },
        }),

      ...(formData.organizationType !== '0' &&
        !isEqual(_organizationType, formData.organizationType) && {
          organizationType: {
            orgType: formData.organizationType,
          },
        }),

      ...(organization?.logo === null && selectedFile && { organizationProfile: profileImageKey }),
    };

    if (organization?.id && Object.keys(_orgUpdateData).length > 0) {
      await updateOrg({ payload: _orgUpdateData, id: organization?.id })
        .then((response) => {
          if ('data' in response) {
            response.data?.data.organizationId && openSnackbar('Organization profile updated successfully!', 'success');
          } else {
            openSnackbar((response.error as Error)?.message || 'Error updating organization', 'error');
          }
        })
        .catch((error) => {
          openSnackbar((error as Error)?.message || 'Error updating organization', 'error');
        });
    }
    if (Object.keys(_orgUpdateData).length === 0) {
      navigate(getRoute('private.app.organizations.profile', { id: organization?.id }));
    }
    setIsComplete(false);
  };

  const handleNextClick = () => async () => {
    const data = await methods.trigger();
    data && setActiveStep((prev) => prev + 1);
  };

  return isFetching ? (
    <>
      <PageLoader open target="component" />
      <FormSkeleton />
    </>
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
              <StepThree
                setSelectedFile={setSelectedFile}
                orgLogo={organization?.logo && getOrganizationLogo(organization?.logo)}
              />
            </>
          )}

          <StepperFooter
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            steps={steps}
            handleNextClick={handleNextClick}
            isLoading={orgLoading || isComplete}
            type="edit"
          />
        </form>
      </FormProvider>
    </>
  );
};

export default OrgEdit;
