import { useEffect, useState, useCallback } from 'react';
import Autocomplete from '@mui/material/Autocomplete';

import { Org } from '@utils/types/organization.type';
import { useFetchOrgListQuery } from '@store/slices/organization/organization.slice';

import { TextField } from '@ui/textField';
import { CircularProgress } from '@ui/circularProgress';
import { ListItem, ListItemAvatar, ListItemText } from '@ui/list';
import { Typography } from '@ui/typography';
import Image from '@ui/image';
import { HomeWorkOutlinedIcon } from '@ui/icons';
import { Box, Grid } from '@ui/layout';
import { styled, alpha } from '@ui/theme';
import { FormHelperText, FormLabel } from '@ui/forms';
import { debounce } from 'lodash-es';

type OrgAutoCompleteProps = {
  value: Org | null;
  onChange: (org: Org | null) => void;
  error?: Error | null;
  disabled?: boolean;
};

export const OTHER_ORG_TYPE = 'other';

const emptyOrgOption: Org = {
  name: '',
  value: '',
  id: '',
  logo: '',
  orgtype: '',
};

const DefaultOptionContainer = styled(Box)(({ theme }) => ({
  borderRadius: `${theme.borderRadius.xs}px`,
  backgroundColor: theme.palette.primary[200] || 'transparent',
  display: 'inline-flex',
  alignItems: 'center',
  padding: '12px',
  flexGrow: 1,
  transition: 'background-color .3s',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.1),
  },
}));

const DefaultOptionListItem = styled(ListItem)(() => ({
  background: 'transparent!important',
  paddingLeft: '14px !important',
  paddingRight: '14px !important',
}));

export default function OrgAutoComplete({ value, onChange, error: formError, disabled }: OrgAutoCompleteProps) {
  const [open, setOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(value || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isOtherOrg, setIsOtherOrg] = useState(false);

  const {
    data: orgList = [],
    isError,
    error,
    isFetching,
  } = useFetchOrgListQuery(debouncedSearchTerm, {
    skip: debouncedSearchTerm.length === 0,
    refetchOnMountOrArgChange: true,
  });

  const debouncedSetSearchTerm = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(encodeURIComponent(term));
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (orgList.length && !selectedOrg && !searchTerm) {
      setSelectedOrg(orgList[0]);
    }
  }, [JSON.stringify(orgList)]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormLabel required>Organization name</FormLabel>
        <Typography variant="body1-secondary">This is the organization you volunteered for</Typography>
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          open={open}
          value={selectedOrg}
          autoComplete
          autoSelect={isOtherOrg}
          disabled={disabled}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'clear' || reason === 'reset') {
              setIsOtherOrg(false);
              setSearchTerm('');
            } else {
              setSearchTerm(value);
            }
          }}
          onChange={(_, value, reason) => {
            let selection: Org = { ...emptyOrgOption, name: searchTerm };

            if (value && typeof value !== 'string' && reason === 'selectOption') {
              selection = value;
            }

            if (typeof value !== 'string' && value?.value === OTHER_ORG_TYPE) {
              setIsOtherOrg(true);
              selection = { ...value, name: searchTerm };
            }

            setSelectedOrg(selection);
            onChange && onChange(selection);
          }}
          filterOptions={(x) => [{ ...emptyOrgOption, value: OTHER_ORG_TYPE }, ...x]}
          autoHighlight
          freeSolo
          getOptionLabel={(option) => (option as Org).name}
          options={orgList}
          disablePortal
          loading={isFetching}
          popupIcon={null}
          renderOption={(props, option) =>
            option.value === OTHER_ORG_TYPE ? (
              <DefaultOptionListItem {...props}>
                <DefaultOptionContainer>
                  <Typography variant="body4">Unable to find the organization?</Typography>
                  <Typography variant="body4" fontWeight="bold" color="primary.main">
                    &nbsp;Add details manually
                  </Typography>
                </DefaultOptionContainer>
              </DefaultOptionListItem>
            ) : (
              <ListItem {...props} key={option.id}>
                {option.value !== OTHER_ORG_TYPE && (
                  <ListItemAvatar>
                    <Image src={option.logo} isAvatar shape="rounded" alt={option.name} width={56} height={56}>
                      <HomeWorkOutlinedIcon />
                    </Image>
                  </ListItemAvatar>
                )}
                <ListItemText
                  sx={{ paddingLeft: 2 }}
                  primary={<Typography variant="h4">{option.name}</Typography>}
                  secondary={
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        pt: 0.5,
                      }}
                    >
                      {option.orgtype}
                    </Typography>
                  }
                />
              </ListItem>
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              error={isError || !!formError}
              InputProps={{
                ...params.InputProps,
                placeholder: 'Organization name',
                disabled: disabled,
                style: { paddingRight: 45 },
                ...(selectedOrg &&
                  selectedOrg.value &&
                  selectedOrg.value !== OTHER_ORG_TYPE && {
                    startAdornment: (
                      <Image
                        src={selectedOrg.logo}
                        isAvatar
                        shape="rounded"
                        alt={selectedOrg.name}
                        borderRadius="4px"
                        width={24}
                        height={24}
                      >
                        <HomeWorkOutlinedIcon sx={{ width: 18, height: 18 }} />
                      </Image>
                    ),
                  }),
                endAdornment: (
                  <>
                    {isFetching ? <CircularProgress color="inherit" size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Grid>
      {(isError || !!formError) && (
        <Grid item xs={12}>
          <FormHelperText error>
            {isError ? (error as Error)?.message : ''}
            {formError ? formError?.message : ''}
          </FormHelperText>
        </Grid>
      )}
    </Grid>
  );
}
