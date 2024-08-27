import { Grid, Box } from '@ui/layout';
import ContentContainer from '@globals/contentContainer';
import CustomTable from '@globals/customTable';
import { Typography } from '@ui/typography';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRoute } from '@utils/configs/routesConfig';
import { useSnackbar } from '@ui/snackBar';
import SearchBar, { SearchValues } from './searchBar';
import { Tab } from '@ui/tab';
import { Tabs } from '@ui/tabs';
import causeList from '@utils/constants/causes.const';
import Image from '@ui/image';
import { useTheme } from '@ui/theme';
import { getOrganizationLogo } from '@utils/functions/avatarUtils';
import ListCauses from '@globals/causesDisplay/listCauses';
import { useListAllOrganizationQuery, useListJoinedGroupsQuery } from '@store/slices/organization/organization.slice';
import { UserRoles } from '@utils/enums/roles.enum';
import SearchEmpty from '@globals/SearchEmpty';
import { formatSupporters } from '@utils/functions/formatData';

const columns = [
  { key: 'name', title: 'Name', width: '35%', maxWidth: '200px' },
  { key: 'causes', title: 'Causes', width: '30%' },
  { key: 'volunteerHours', title: 'Volunteer hours', width: '20%' },
  { key: 'supporters', title: 'Supporters', width: '10%' },
];
const options = [
  { value: 'ALL', label: 'All organizations' },
  { value: 'APPROVED', label: 'Groups joined' },
];

export default function GroupsAndOrganizations() {
  const { fontSize } = useTheme();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [valueTab, setValueTab] = useState(options[0].value);
  const [resetSearch, setResetSearch] = useState<boolean>(false);

  const [isSearch, setIsSearch] = useState<SearchValues>({ name: '', causeId: '', sortByFilter: 'nf' });

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
    setResetSearch(true);
  };

  const {
    data: allOrganizations,
    isLoading,
    isFetching,
    error,
  } = useListAllOrganizationQuery(
    {
      pageSize: 10,
      pageNumber: pageNumber,
      sortByFilter: isSearch.sortByFilter,
      searchTerm: isSearch.name,
      causeId: isSearch.causeId,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: allJoinedGroups,
    isLoading: isLoadingGroups,
    isFetching: isFetchingGroups,
    error: errorGroups,
  } = useListJoinedGroupsQuery(
    {
      pageSize: 10,
      pageNumber: pageNumber,
      sortByFilter: isSearch.sortByFilter,
      searchTerm: isSearch.name,
      causeId: isSearch.causeId,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (error || errorGroups) {
      openSnackbar('Something went wrong.', 'error');
    }
  }, [error, errorGroups]);

  useEffect(() => {
    setPageNumber(1);
    if (resetSearch) {
      // Reset search values after a short delay to ensure proper reset timing
      setTimeout(() => {
        setResetSearch(false);
      }, 100);
    }
  }, [isSearch.name, isSearch.causeId, isSearch.sortByFilter, valueTab, resetSearch]);

  const sortCauses = (causes: string[]) => {
    const causeObj = causes?.map((cause) => {
      return causeList[cause];
    });
    const sortedCause = causeObj?.sort((a, b) => a.name.localeCompare(b.name));
    return sortedCause?.map((cause) => cause.id) || [];
  };
  const tableData =
    valueTab === 'ALL'
      ? allOrganizations &&
        allOrganizations.data.map((value) => ({
          id: value.id,
          causes: (
            <ListCauses
              items={sortCauses(value?.cause_ids) || []}
              tileSize={36}
              spacing={1 / 2}
              borderRadius="6px"
              invert
            />
          ),
          volunteerHours: `${value.total_hours} hours`,
          name: value && (
            <Box display="inline-flex" justifyContent="space-between" alignItems="center">
              <Image
                width={36}
                height={36}
                sx={{ fontSize: fontSize.sm, mr: 2 }}
                alt="groupIcon"
                src={getOrganizationLogo(`${value.logo}`)}
                shape="rounded"
                hasBorder
              />

              <Box
                flexDirection="row"
                sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {value.name}
                </Typography>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {value.custom_orgtype || value.org_type}
                </Typography>
              </Box>
            </Box>
          ),
          supporters: formatSupporters(Number(value.supporters)),
          userRole: value.user_role,
        }))
      : allJoinedGroups &&
        allJoinedGroups.data.map((value) => ({
          id: value.id,
          causes: (
            <ListCauses
              items={sortCauses(value?.cause_ids) || []}
              tileSize={36}
              spacing={1 / 2}
              borderRadius="6px"
              invert
            />
          ),
          volunteerHours: `${value.total_hours} hours`,
          name: value && (
            <Box display="inline-flex" justifyContent="space-between" alignItems="center">
              <Image
                width={36}
                height={36}
                sx={{ fontSize: fontSize.sm, mr: 2 }}
                alt="groupIcon"
                src={getOrganizationLogo(`${value.logo}`)}
                shape="rounded"
                hasBorder
              />

              <Box
                flexDirection="row"
                sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {value.name}
                </Typography>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {value.custom_orgtype || value.org_type}
                </Typography>
              </Box>
            </Box>
          ),
          supporters: formatSupporters(Number(value.supporters)),
          userRole: value.user_role,
        }));

  return (
    <Grid container>
      <ContentContainer size={[1, 0, 2, 0]} sx={{ mt: 2 }}>
        <Box pl={2}>
          <Tabs value={valueTab} onChange={handleChange} aria-label="deed feed tabs">
            <Tab
              value={options[0].value}
              disableRipple
              label={
                <Typography variant="h6" fontWeight={400}>
                  {options[0].label}
                </Typography>
              }
            />
            <Tab
              value={options[1].value}
              disableRipple
              label={
                <Typography variant="h6" fontWeight={400}>
                  {options[1].label}
                </Typography>
              }
            />
          </Tabs>
        </Box>

        <Box ml={2}>
          <SearchBar setSearchValues={setIsSearch} resetSearch={resetSearch} />
        </Box>
        <CustomTable
          loading={isLoading || isFetching || isLoadingGroups || isFetchingGroups}
          columns={columns}
          numberOfItems={valueTab === 'ALL' ? allOrganizations?.totalRecords || 0 : allJoinedGroups?.totalRecords || 0}
          data={tableData || []}
          page={pageNumber}
          setPage={setPageNumber}
          onRowClick={(data) => {
            const allowedRoles = new Set([UserRoles.OWNER, UserRoles.SUPERVISOR, UserRoles.COORDINATOR]);

            if (data && allowedRoles.has(data.userRole as UserRoles)) {
              navigate(getRoute('private.app.organizations.profile', { id: data.id }));
            } else {
              navigate(getRoute('private.app.organizations.viewOrgProfile', { id: data.id }));
            }
          }}
          noDataComponent={<SearchEmpty />}
        />
      </ContentContainer>
    </Grid>
  );
}
