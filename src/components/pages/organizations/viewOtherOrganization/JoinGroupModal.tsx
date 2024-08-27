import { useEffect, useState } from 'react';
import CustomModal from '@ui/customModal';
import { Grid } from '@ui/layout';
import { Button } from '@ui/button';
import { Skeleton } from '@ui/skeleton';
import Image from '@ui/image';
import { CheckCircleOutlineIcon } from '@ui/icons';
import { Typography } from '@ui/typography';
import { Box } from '@ui/layout';
import { useTheme, styled } from '@ui/theme';
import { CustomCheckbox } from '@globals/customCheckbox';
import { useJoinGroupMutation } from '@store/slices/organization/organization.slice';
import { useSnackbar } from '@ui/snackBar';
import { useForm, Controller } from 'react-hook-form';
import { getRoute } from '@utils/configs/routesConfig';
import { useNavigate } from 'react-router-dom';

type JoinGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  logo: string;
  organizationId: string;
  orgName: string;
  orgType: string | null;
};
const items = [
  {
    label: 'View supporters',
  },
  {
    label: 'Invite friends to support',
  },
  {
    label: 'Log your volunteer hours',
  },
];

const StyledBox = styled(Box)(() => ({
  alignSelf: 'end',
  padding: 2,
  height: 'auto',
  borderRadius: '8px',
  textAlign: 'start',
}));

const JOIN_GROUP_BUTTON_LABEL = 'Join group';
const VIEW_SUPPORTERS_BUTTON_LABEL = 'View supporters';

export default function JoinGroupModal({
  orgName,
  orgType,
  isOpen,
  onClose,
  isLoading,
  logo = '',
  organizationId,
}: JoinGroupModalProps) {
  const { palette, spacing } = useTheme();
  const { openSnackbar } = useSnackbar();
  const [isStepTwo, setIsStepTwo] = useState(false);
  const [
    createJoinGroup,
    { isError: isJoinGroupError, error: joinGroupsError, isSuccess: isJoinGroupSuccess, isLoading: isLoadingJoinGroup },
  ] = useJoinGroupMutation();
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues: {
      isVolunteer: false,
      isDonor: false,
    },
    mode: 'onChange',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isJoinGroupSuccess) {
      openSnackbar('Successfully joined group', 'success');
      setIsStepTwo(true);
      reset();
    } else if (isJoinGroupError) {
      openSnackbar((joinGroupsError as Error)?.message || 'Error occurred while joining group', 'error');
    }
  }, [isJoinGroupSuccess, isJoinGroupError]);

  const onClickJoinGroup = async (data: { isVolunteer: boolean; isDonor: boolean }) => {
    const payload = {
      ...data,
      organizationId,
    };

    try {
      await createJoinGroup(payload);
    } catch (err) {
      openSnackbar((err as Error).message, 'error');
    }
  };

  const isButtonDisabled = !isDirty;

  const viewSupportersBtn = () => {
    navigate(getRoute('private.app.organizations.profile.supporters', { id: organizationId }));
  };

  const onCloseBtn = () => {
    onClose();
    setIsStepTwo(false);
    reset();
  };
  return (
    <CustomModal
      width={433}
      open={isOpen}
      onClose={onCloseBtn}
      maxHeightEnable
      isTitleSeparate={false}
      footerContent={
        <Grid container spacing={1} display="flex" flexDirection="column" paddingX={3} paddingBottom={3}>
          {isStepTwo && (
            <Button variant="contained" color="primary" fullWidth onClick={viewSupportersBtn}>
              {VIEW_SUPPORTERS_BUTTON_LABEL}
            </Button>
          )}
          {!isStepTwo && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit(onClickJoinGroup)}
              disabled={isButtonDisabled}
              loading={isLoadingJoinGroup}
            >
              {JOIN_GROUP_BUTTON_LABEL}
            </Button>
          )}
        </Grid>
      }
    >
      <Grid container spacing={1} display="flex" flexDirection="column" padding={[2, 2, 2, 2]}>
        <>
          <Grid display="flex" flexDirection="column" alignItems="center" item>
            {isStepTwo && (
              <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 4 }}>
                You're now a supporter of
              </Typography>
            )}
            {isLoading ? (
              <Skeleton width={96} height={96} variant="rounded" />
            ) : (
              <Image
                src={logo}
                width={96}
                height={96}
                shape="rounded"
                borderRadius="16px"
                alt="organization logo"
                hasBorder
              />
            )}
            <Box textAlign="center">
              <Typography variant="h4" sx={{ paddingTop: spacing(1) }}>
                {orgName}
              </Typography>
              <Typography variant="body1-secondary" sx={{ paddingTop: spacing(0.5), paddingBottom: spacing(3) }}>
                {orgType}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: 2, textAlign: 'center' }}>
            {!isStepTwo ? (
              <>
                <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 2 }}>
                  How would you like to support?
                </Typography>
                <Typography variant="body4" color="GrayText" sx={{ textAlign: 'center' }}>
                  Join volunteer and/or donor groups to receive relevant updates and notify the organization about how
                  you would like to support
                </Typography>
                <Box marginTop={5}>
                  <Controller
                    name="isVolunteer"
                    control={control}
                    render={({ field }) => <CustomCheckbox label="As a volunteer" {...field} />}
                  />
                  <Controller
                    name="isDonor"
                    control={control}
                    render={({ field }) => <CustomCheckbox label="As a donor" {...field} />}
                  />
                </Box>
              </>
            ) : (
              <StyledBox>
                <Typography variant="h5">What’s next?</Typography>
                <Grid container display="flex" direction="column" mt={1} spacing={1}>
                  {items.map((item, index) => (
                    <Grid
                      key={`${index}_${item.label}`}
                      item
                      xs
                      display="inline-flex"
                      mt={1}
                      justifyContent="flex-start"
                    >
                      <CheckCircleOutlineIcon sx={{ color: palette.success.light, width: '25px', mr: 1 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography key={`${index}`} variant="body4">
                          {item.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </StyledBox>
            )}
          </Grid>
        </>
      </Grid>
    </CustomModal>
  );
}
