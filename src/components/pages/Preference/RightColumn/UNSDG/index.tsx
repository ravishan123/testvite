import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import isEqual from 'lodash-es/isEqual';
import { useAtom } from 'jotai';

import { UserUNSDG } from '@utils/types/preference/unsdg.type';
import { getUserUNSDGAtom, selectedSDGAtom, updateUserSDGAtom } from '@serverAtoms/preferences/unsdg/unsdg.atom';
import { isPreferenceLoadingAtom } from '@applicationAtoms/preference.atom';

import { Button, LoadingButton } from '@ui/button';
import { useSnackbar } from '@ui/snackBar';

import icons, { IconProps } from './icons';
import IconComponent from './IconComponent';

export type UNSDGProps = {
  handleNextStep?: (isUpdated?: boolean) => void;
  handleBackStep?: () => void;
  handleComplete?: () => void;
};

const getSelectedSDGIds = (iconList: IconProps[]): string[] => {
  const selectedIcons = iconList.filter((icon) => icon.selected);
  const selectedIconIds = selectedIcons.map((icon) => icon.id);
  return selectedIconIds;
};

function UNSDG({ handleNextStep, handleBackStep, handleComplete }: UNSDGProps) {
  const [userUNSDG] = useAtom(getUserUNSDGAtom);
  const [selectedSDG, setSelectedSDG] = useAtom(selectedSDGAtom);
  const [updateUserSDG] = useAtom(updateUserSDGAtom);
  const [, setIsLoading] = useAtom(isPreferenceLoadingAtom);
  const [iconList, setIconList] = useState<IconProps[]>([...icons]);
  const [isSaveData, setIsSaveData] = useState<boolean>(false);
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    if (isSaveData && updateUserSDG.isSuccess && handleComplete && handleNextStep) {
      openSnackbar('Successfully updated your SDG preferences', 'success');
      setIsSaveData(false);
      handleComplete();
      handleNextStep(true);
      setSelectedSDG([]);
      void userUNSDG.refetch();
    }

    if (isSaveData && updateUserSDG.isError && handleNextStep) {
      openSnackbar('Error occurred when updating your SDG preferences', 'error');
      handleNextStep();
      setIsSaveData(false);
      void userUNSDG.refetch();
      updateUserSDG.reset();
    }
  }, [updateUserSDG.isSuccess, updateUserSDG.isError, isSaveData]);

  useEffect(() => {
    setIsLoading(userUNSDG.isLoading || updateUserSDG.isLoading);
  }, [userUNSDG.isLoading, updateUserSDG.isLoading]);

  // select SDG icons from users SDG preferences. Also if user has selected SDG in and navigate back to the previous step and come back again, then that selection should persist until user save it
  useEffect(() => {
    const userSDG = (userUNSDG?.data?.data as unknown as UserUNSDG) || [];

    const updatedIconList = iconList.map((icon) => {
      const selected: boolean = [...userSDG, ...selectedSDG].includes(icon.id);
      return { ...icon, selected };
    });

    if (updatedIconList.length) {
      setIconList(updatedIconList);

      if (userSDG.length && handleComplete) {
        handleComplete();
      }
    }
  }, [userUNSDG?.data?.data, selectedSDG, setIconList]);

  const toggleIconAtIndex = (index: number): void => {
    const iconIndex = { ...iconList[index - 1] };
    iconIndex.selected = !iconIndex.selected;
    setIconList([...iconList.slice(0, index - 1), iconIndex, ...iconList.slice(index)]);
  };

  const handleButtonClick = () => {
    const selectedIconIds = getSelectedSDGIds(iconList);

    if (selectedIconIds.length > 5) {
      openSnackbar('Please select maximum of 5 options', 'error');
    } else if (!isEqual(selectedIconIds?.sort(), (userUNSDG?.data?.data as unknown as UserUNSDG)?.sort() || [])) {
      setIsSaveData(true);
      void updateUserSDG.mutate(selectedIconIds);
    } else {
      if (handleNextStep) {
        handleNextStep();
      }
    }
  };

  const handleBackButtonClick = () => {
    setSelectedSDG(getSelectedSDGIds(iconList));

    if (handleBackStep) {
      handleBackStep();
    }
  };

  return (
    <Grid container direction="column">
      <Grid item xs={12} style={{ paddingBottom: 40 }}>
        <Typography variant="h3" gutterBottom>
          United Nations Sustainable Development Goals
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
          }}
        >
          Select up to 5 goals you like to support.
        </Typography>
      </Grid>
      <Grid container spacing={1} justifyContent={'flex-start'} maxWidth="607px">
        {iconList.map(({ index, selected, label }) => (
          <Grid key={`sdg-icon-${index}`} item>
            <IconComponent selected={selected} index={index} handleIconToggle={toggleIconAtIndex} label={label} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={1} mt={5} justifyContent="flex-end">
        <Grid item sx={{ maxWidth: '243px', width: '100%' }}>
          <Button onClick={handleBackButtonClick} fullWidth variant="outlined" color="secondary">
            Back
          </Button>
        </Grid>
        <Grid item sx={{ maxWidth: '243px', width: '100%' }}>
          <LoadingButton
            onClick={handleButtonClick}
            fullWidth
            color="primary"
            variant="contained"
            loading={userUNSDG?.isLoading || updateUserSDG?.isLoading}
          >
            Next
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default UNSDG;
