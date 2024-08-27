import React, { ReactElement, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Checkbox, FormControlLabel, Button, SvgIcon, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SelectedIcon } from '@ui/icons/SelectedIcon';
import { UnselectedIcon } from '@ui/icons/UnselectedIcon';

interface CheckboxData {
  name: string;
  label: string;
  icon: ReactElement<HTMLOrSVGElement>;
}

interface CasesSelectProps {
  checkboxData: CheckboxData[];
  onCheckedStatesChange: (newCheckedStates: { [key: string]: boolean }) => void;
}

export interface CasesSelectRef {
  selectAllCases: () => void;
  setCausesValue: (value: { [key: string]: boolean }) => void;
}

const CasesSelect: React.ForwardRefRenderFunction<CasesSelectRef, CasesSelectProps> = (
  { checkboxData, onCheckedStatesChange },
  ref
) => {
  const [checkedStates, setCheckedStates] = useState<{ [key: string]: boolean }>(
    checkboxData.reduce((acc, checkbox) => ({ ...acc, [checkbox.name]: false }), {})
  );

  const handleCheckboxChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedStates({ ...checkedStates, [name]: event.target.checked });
  };

  const IconButton = styled(Button)({
    minWidth: '100%',
    height: '155px',
    display: 'flex',
    flexDirection: 'column',
    border: 'none',
    backgroundColor: '#F9FAFB',
    borderRadius: '16px',
  });

  const selectAllCases = () => {
    const updatedCheckedStates: { [key: string]: boolean } = {};
    checkboxData.forEach((checkbox) => {
      updatedCheckedStates[checkbox.name] = true;
    });
    setCheckedStates(updatedCheckedStates);
  };

  useEffect(() => {
    onCheckedStatesChange(checkedStates);
  }, [checkedStates, onCheckedStatesChange]);

  useImperativeHandle(ref, () => ({
    selectAllCases: selectAllCases,
    setCausesValue: (value) => {
      setCheckedStates(value);
    },
  }));

  return (
    <Grid container spacing={1} mt={5} mb={5}>
      {checkboxData.map((checkbox) => (
        <Grid item xs={12} md={6} key={checkbox.name}>
          <FormControlLabel
            style={{ margin: 0, width: '100%' }}
            control={
              <Checkbox
                style={{ margin: 0, width: '100%' }}
                checked={checkedStates[checkbox.name]}
                onChange={handleCheckboxChange(checkbox.name)}
                icon={
                  <IconButton variant="outlined" color="primary">
                    <div>
                      <SvgIcon sx={{ fontSize: 40 }}>{checkbox.icon}</SvgIcon>
                    </div>
                    <div style={{ width: '90px' }}>{checkbox.label}</div>
                    <div style={{ position: 'absolute', bottom: 8, right: 8, height: 25, width: 25 }}>
                      <UnselectedIcon />
                    </div>
                  </IconButton>
                }
                checkedIcon={
                  <IconButton
                    variant="outlined"
                    color="secondary"
                    sx={{
                      border: '1px solid',
                      borderColor: 'theme.palette.primary.main',
                    }}
                  >
                    <div>
                      <SvgIcon sx={{ fontSize: 40 }}>{checkbox.icon}</SvgIcon>
                    </div>
                    <div style={{ width: '90px' }}>{checkbox.label}</div>
                    <div style={{ position: 'absolute', bottom: 8, right: 8, height: 25, width: 25 }}>
                      <SelectedIcon />
                    </div>
                  </IconButton>
                }
              />
            }
            label={null}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default forwardRef(CasesSelect);
