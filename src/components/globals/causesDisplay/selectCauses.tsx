import { useEffect, useState } from 'react';
import { SvgIcon } from '@mui/material';

import causesConfig from '@utils/constants/causes.const';
import { useFetchCausesQuery } from '@store/slices/settings/settings.slice';

import { Typography } from '@ui/typography';
import { styled, useTheme, alpha } from '@ui/theme';
import { Box, Grid } from '@ui/layout';
import { SelectedIcon } from '@ui/icons/SelectedIcon';
import { UnselectedIcon } from '@ui/icons/UnselectedIcon';
import { Button } from '@ui/button';
import { FormHelperText } from '@ui/forms';

type SelectCausesProps = {
  title?: string;
  description?: string;
  selection: string[];
  error?: string;
  onChange: (selection: string[]) => void;
};

const CauseItem = styled(Button, { shouldForwardProp: (props) => props !== 'selected' })<{ selected: boolean }>(
  ({ theme, selected }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.secondary.main}`,
    padding: '12px 24px',
    borderRadius: '16px',
    margin: '0 8px 8px 0px',
    cursor: 'pointer',
    height: '48px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
    },
    transition: 'border .3s, background-color .3s',
    backgroundColor: `${theme.palette.background.chip}`,
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.chip, 0.6),
    },
  })
);

export function SelectCauses({
  title = 'Causes we care about',
  description = 'You can select multiple causes',
  selection,
  error,
  onChange,
}: SelectCausesProps) {
  const [causes, setCauses] = useState<string[]>(selection);
  const [selectAll, setSelectAll] = useState(false);
  const { data: causesList = [] } = useFetchCausesQuery(undefined);
  const { palette, fontSize } = useTheme();

  const handleOnClick = (id: string) => {
    const newSelection = [...causes];
    const itemIndex = newSelection.indexOf(id);

    if (itemIndex === -1) {
      newSelection.push(id);
    } else {
      newSelection.splice(itemIndex, 1);
    }

    setCauses(newSelection);

    if (onChange) {
      onChange(newSelection);
    }
  };

  const handleSelectAll = () => {
    let newCauses: string[];
    if (selectAll) {
      newCauses = [];
    } else {
      newCauses = causesList.map((cause) => cause.id);
    }
    setCauses(newCauses);
    if (onChange) {
      onChange(newCauses);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setCauses(selection);
  }, [selection]);

  return (
    <Grid container direction="column">
      <Grid item xs={12}>
        <Typography component="span" variant="h5">
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </Grid>
      <Grid item xs={12} mt={2} mb={1}>
        {causesList.map((cause) => (
          <CauseItem
            variant="custom"
            key={cause.id}
            onClick={() => handleOnClick(cause.id)}
            selected={causes.indexOf(cause.id) !== -1}
          >
            <SvgIcon sx={{ fontSize: 24, marginRight: '16px' }}>{causesConfig[cause.id]?.Icon}</SvgIcon>
            <Typography
              variant="body2"
              sx={{
                color: causes.indexOf(cause.id) !== -1 ? palette.primary.main : null,
                fontSize: fontSize.sm,
                fontWeight: 400,
              }}
            >
              {cause.title}
            </Typography>
          </CauseItem>
        ))}
        {error && <FormHelperText error={Boolean(error)}>{error}</FormHelperText>}
      </Grid>

      <Grid item xs={12} alignItems="center" onClick={handleSelectAll}>
        <Button variant="custom-compact" color="primary" sx={{ m: 0 }} onClick={handleSelectAll}>
          <Grid item display="flex" alignItems="center">
            <Box width="25px" height="25px" mr={1}>
              {causes.length === causesList.length ? <SelectedIcon /> : <UnselectedIcon />}
            </Box>
            <Box>
              <Typography>Select all</Typography>
            </Box>
          </Grid>
        </Button>
      </Grid>
    </Grid>
  );
}
