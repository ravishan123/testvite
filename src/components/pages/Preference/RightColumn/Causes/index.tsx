import React, { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { Typography, Box, Grid } from '@mui/material';
import isEqual from 'lodash-es/isEqual';

import { postCausesQueryAtom } from '@serverAtoms/preferences/causes/postCauses.atom';
import { getCausesAtom } from '@serverAtoms/preferences/causes/getCauses.atom';
import { patchCausesQueryAtom } from '@serverAtoms/preferences/causes/patchCauses.atom';
import { isPreferenceLoadingAtom } from '@applicationAtoms/preference.atom';

import { AnimalWelfare, DisasterRelief, Environment, Education, People } from '@ui/icons/CausesIcons';
import CasesSelect from '@ui/casesSelect';
import { Button, LoadingButton } from '@ui/button';
import { CasesSelectRef } from '@ui/casesSelect';
import { useSnackbar } from '@ui/snackBar';

const checkboxData = [
  { name: 'ANIMAL_WELFARE', label: 'Animal welfare', icon: AnimalWelfare },
  { name: 'DISASTER_RELIEF', label: 'Disaster relief', icon: DisasterRelief },
  { name: 'ENVIRONMENT', label: 'Environment', icon: Environment },
  { name: 'EDUCATION', label: 'Education', icon: Education },
  { name: 'PEOPLE', label: 'People', icon: People },
];

const causesItems: Category[] = [
  { id: '58aaaad0-28f5-4515-a1dc-e5578e00b046', name: 'ANIMAL_WELFARE' },
  { id: '9604e711-274b-451a-b4c7-036fab8578ed', name: 'DISASTER_RELIEF' },
  { id: '99fef02e-be7c-41c0-8958-c56f4d20cfae', name: 'EDUCATION' },
  { id: '5fc699fc-6057-4dc1-8983-8e7fd4cad03d', name: 'ENVIRONMENT' },
  { id: '75b310fb-47f9-48bf-9b5d-1d34286ac0cb', name: 'PEOPLE' },
];

interface ListCause {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
}
interface Cause {
  id: string;
}

interface CausesProps {
  handleNextStep: (isUpdated?: boolean) => void;
  handleBackStep: () => void;
  handleComplete: () => void;
}

interface Category {
  id: string;
  name: string;
}

interface CheckedStates {
  [categoryName: string]: boolean;
}

const Causes: React.FC<CausesProps> = ({ handleBackStep, handleNextStep, handleComplete }) => {
  const [, setSelectedIds] = useState<string[]>([]);
  const casesSelectRef = useRef<CasesSelectRef>(null);
  const [causesAtom, causesMutate] = useAtom(postCausesQueryAtom);
  const [patchCauses, patchCausesMutate] = useAtom(patchCausesQueryAtom);
  const [isLoading, setIsLoading] = useAtom(isPreferenceLoadingAtom);
  const { openSnackbar } = useSnackbar();
  const [causesData, setCausesData] = useState<Cause[]>();

  const [getCauses] = useAtom(getCausesAtom);

  const handleSelectAllCases = () => {
    casesSelectRef.current?.selectAllCases();
  };

  const [checkedStates, setCheckedStates] = useState<{ [key: string]: boolean }>(
    checkboxData.reduce((acc, checkbox) => ({ ...acc, [checkbox.name]: false }), {})
  );

  const handleCheckedStatesChange = (newCheckedStates: { [key: string]: boolean }) => {
    setCheckedStates(newCheckedStates);
  };

  const getSelectedIds = (checkedStates: CheckedStates, list: Category[]): string[] => {
    const selectedId: string[] = [];
    for (const item of list) {
      if (checkedStates[item.name]) {
        selectedId.push(item.id);
      }
    }
    return selectedId;
  };

  const getSelectedNames = (listCausesData: ListCause[], causesData: Cause[]): CheckedStates => {
    const statusMap: CheckedStates = {};
    listCausesData.forEach((cause) => {
      statusMap[cause.name] = causesData?.some((target) => target.id === cause.id);
    });

    return statusMap;
  };

  const handleNextStepBtn = async () => {
    const selectedId = getSelectedIds(checkedStates, causesItems);
    const _causesData = causesData?.map((cause) => cause.id);
    let isUpdated = false;
    setSelectedIds(selectedId);

    if (!!causesData?.length && !isEqual(selectedId, _causesData)) {
      await patchCausesMutate([{ causesList: selectedId }]).catch(() => {
        openSnackbar('Something went wrong', 'error');
      });
      handleComplete();
      void getCauses.refetch();
      isUpdated = true;
      openSnackbar('Causes updated successfully', 'success');
    } else if (!isEqual(selectedId, _causesData)) {
      await causesMutate([{ causesList: selectedId }]).catch(() => {
        openSnackbar('Something went wrong', 'error');
      });
      handleComplete();
      void getCauses.refetch();
      isUpdated = true;
      openSnackbar('Causes updated successfully', 'success');
    }

    handleNextStep(isUpdated);
  };

  useEffect(() => {
    setCausesData(getCauses?.data?.data);
  }, [getCauses?.data?.data]);

  useEffect(() => {
    if (causesData) {
      const statusMap = getSelectedNames(causesItems, causesData);
      casesSelectRef.current?.setCausesValue(statusMap);
    }
    const selectedId = getSelectedIds(checkedStates, causesItems);
    setSelectedIds(selectedId);
  }, [causesData]);

  useEffect(() => {
    setIsLoading(patchCauses.isLoading || causesAtom.isLoading || getCauses.isLoading);
  }, [patchCauses.isLoading, causesAtom.isLoading, getCauses.isLoading]);

  const selectAllAndProceed = async () => {
    let isUpdated = false;
    const causeIds = causesItems.map((cause) => cause.id);
    handleSelectAllCases();
    if (causesData?.length) {
      await patchCausesMutate([{ causesList: causeIds }]).catch(() => {
        openSnackbar('Something went wrong', 'error');
      });
      handleComplete();
      void getCauses.refetch();
      isUpdated = true;
      openSnackbar('Causes updated successfully', 'success');
      handleNextStep(isUpdated);
    } else {
      await causesMutate([{ causesList: causeIds }]).catch(() => {
        openSnackbar('Something went wrong', 'error');
      });
      handleComplete();
      void getCauses.refetch();
      isUpdated = true;
      openSnackbar('Causes updated successfully ', 'success');
      handleNextStep(isUpdated);
    }
  };

  return (
    <Grid maxWidth="518px">
      <Typography variant="h3" gutterBottom>
        Causes you care about
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
        }}
      >
        You can select multiple causes
      </Typography>
      <CasesSelect ref={casesSelectRef} checkboxData={checkboxData} onCheckedStatesChange={handleCheckedStatesChange} />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button onClick={selectAllAndProceed} fullWidth variant="outlined" color="secondary">
              Select all and proceed
            </Button>
          </Grid>
          <Grid item xs={6} pr="16px">
            <Button onClick={handleBackStep} fullWidth variant="outlined" color="secondary">
              Back
            </Button>
          </Grid>
          <Grid item xs={6} pl="16px">
            <LoadingButton
              onClick={handleNextStepBtn}
              fullWidth
              color="primary"
              variant="contained"
              loading={isLoading}
            >
              Next
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default Causes;
