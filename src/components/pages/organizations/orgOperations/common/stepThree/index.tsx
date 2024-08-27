import RadioGroup from '@ui/radioGroup';
import Radio from '@ui/radio';
import { useFetchOrgSizesQuery } from '@store/slices/settings/settings.slice';
import { styled, useTheme } from '@ui/theme';
import { FormHelperText, FormControlLabel } from '@ui/forms';
import { Typography, Link } from '@mui/material';
import { Grid } from '@ui/layout';
import CustomTextField from '@globals/CustomTextField';
import { Checkbox } from '@ui/checkbox';
import { Controller, useFormContext } from 'react-hook-form';
import { IForm } from '../../orgCreation/orgCreation';
import UploadOrgProfilePicture from './uploadOrgProfilePicture';
import { Skeleton } from '@ui/skeleton';

const CheckedEmployeeSize = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  border: '1px solid',
  padding: '12px 24px',
  borderRadius: '16px',
  cursor: 'pointer',
  Width: '74px',
  height: '44px',
  transition: 'border 500ms',
  backgroundColor: `${theme.palette.background.chip}`,
}));
const SkeletonEmployeeSize = styled(Skeleton)(() => ({
  alignItems: 'center',
  borderRadius: '18px',
}));
const UncheckedEmployeeSize = styled(CheckedEmployeeSize)(() => ({
  border: '1px solid transparent',
}));
const StyledRadio = styled(Radio)(({ theme }) => ({
  padding: theme.spacing(1, 1, 0, 1),
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
})) as typeof Radio;

interface StepThreeProps {
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  orgLogo?: string | undefined;
}
export function StepThree(props: StepThreeProps) {
  const methods = useFormContext<IForm>();

  const { data: options, isLoading: isLoadingOptions } = useFetchOrgSizesQuery(undefined);

  const { spacing } = useTheme();

  return (
    <>
      <UploadOrgProfilePicture setSelectedFile={props.setSelectedFile} orgLogo={props.orgLogo} />
      <Typography component="div" variant="h5">
        Number of employees
      </Typography>
      {isLoadingOptions && (
        <>
          <Grid display="inline-flex" sx={{ mt: 2 }} wrap="wrap" height="auto" width="70%">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonEmployeeSize sx={{ mx: 1 }} animation="wave" width={60 + 10 * index} height={70} />
            ))}
          </Grid>
        </>
      )}

      <Controller
        control={methods.control}
        name="nofEmployees"
        render={({ field }) => (
          <RadioGroup row sx={{ mt: 2, '& > .MuiFormControlLabel-root': { mr: 0 } }} {...field}>
            {options &&
              options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  htmlFor={option.value}
                  value={option.value}
                  control={
                    <StyledRadio
                      disableRipple
                      icon={<UncheckedEmployeeSize>{option.label}</UncheckedEmployeeSize>}
                      checkedIcon={<CheckedEmployeeSize>{option.label}</CheckedEmployeeSize>}
                      id={option.value}
                      onClick={() => {
                        const currentValue = methods.watch('nofEmployees');

                        if (currentValue === option.value) {
                          methods.setValue('nofEmployees', '');
                        } else {
                          methods.setValue('nofEmployees', option.value);
                        }
                      }}
                    />
                  }
                  label=""
                />
              ))}
          </RadioGroup>
        )}
      />

      <Grid container direction="row" spacing={4} mt={0}>
        <Grid item width={0.5}>
          <Typography component="span" variant="h5">
            Website
          </Typography>

          <Controller
            name="website"
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                {...field}
                fullWidth
                name="website"
                my={0}
                errorMessages={error?.message?.toString()}
                placeholder="https://"
              />
            )}
          />
        </Grid>
        <Grid item width={0.5}>
          <Typography component="span" variant="h5">
            Social link
          </Typography>
          <Controller
            name="profileInformation"
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                {...field}
                fullWidth
                name="profileInformation"
                my={0}
                errorMessages={error?.message?.toString()}
                placeholder="https://"
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid>
        <FormControlLabel
          sx={{ mt: 4, alignItems: 'flex-start' }}
          control={
            <Checkbox
              name="termsAndConditions"
              sx={{ marginLeft: spacing(1) }}
              onChange={(e) => methods.setValue('termsAndConditions', e.target.checked)}
              defaultChecked={methods.watch('termsAndConditions')}
            />
          }
          label={
            <>
              <span>
                I verify that I am an authorized representative of this organization and have the right to act on its
                behalf in the creation and management of this profile. The organization and I agree to gudppl's{' '}
                <Link target="_blank" href="https://app.gudppl.com/privacy">
                  Terms & Conditions
                </Link>
                .
              </span>
              <FormHelperText error={Boolean(methods.formState.errors.termsAndConditions?.message)}>
                {methods.formState.errors.termsAndConditions?.message}
              </FormHelperText>{' '}
            </>
          }
        />
      </Grid>
    </>
  );
}
