import FormInput from '@globals/FormInput';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from '@ui/alert';
import { useFetchOrgListQuery } from '@store/slices/organization/organization.slice';
import { OrgList } from './orgList';
import { OrgNameWarningMessage } from './consts';
import { NetworkStatus } from '@globals/networkStatus';
import { Typography } from '@ui/typography';
import { IForm } from '../../orgCreation/orgCreation';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useFormContext } from 'react-hook-form';
import debounce from 'lodash-es/debounce';
import { Box } from '@ui/layout';

export function OrgName({ label, name, id }: { label: string; name: keyof IForm; id: string }) {
  const [showMore, setShowMore] = useState(false);
  const [searchQueryValue, setSearchQueryValue] = useState('');
  const methods = useFormContext<IForm>();

  const {
    data: orgList = [],
    isLoading = true,
    isError,
    error,
    isFetching,
  } = useFetchOrgListQuery(searchQueryValue, { skip: !searchQueryValue, refetchOnMountOrArgChange: true });

  const debouncedOnChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQueryValue(encodeURIComponent(e.target.value.trim()));
      methods.setValue('organizationName', e.target.value);
    }, 600),
    []
  );

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, []);

  const toggleVisibleItems = () => {
    setShowMore(!showMore);
  };

  return (
    <>
      <Typography component="span" variant="h5">
        {label}
      </Typography>
      <Box mb={0.5} display="flex">
        <FormInput placeholder="Enter organization name" fullWidth onChange={debouncedOnChange} name={name} id={id} />
      </Box>
      <NetworkStatus
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={isError && 'error' in error ? error.error : 'Unknown error occurred'}
        loadingText="Checking for existing organizations..."
      />
      <OrgList showMore={showMore} orgList={orgList} toggleVisibleItems={toggleVisibleItems} />
      <Alert
        sx={{ py: 0, px: 1, '& .MuiAlert-icon': { alignItems: 'center' } }}
        severity="warning"
        iconMapping={{ warning: <ErrorOutlineIcon /> }}
      >
        {OrgNameWarningMessage}
      </Alert>
    </>
  );
}
