import { useNavigate, useParams } from 'react-router-dom';

import { Grid, Box } from '@ui/layout';
import { useSnackbar } from '@ui/snackBar';
import ContentContainer from '@globals/contentContainer';
import AppContainer from '@layouts/containers/appContainer';
import { getRoute } from '@utils/configs/routesConfig';
import { PageRoute } from '@utils/types/router.type';
import { Pagination } from '@ui/pagination';
import { useEffect, useState } from 'react';
import { useGetPublicSupportersQuery } from '@store/slices/supporters/supporters.slice';
import SupportersList from './supportersList';

type ManageRolesPageProps = {
  routeInfo: PageRoute;
};

const rowsPerPage = 30;

export default function Supporters({ routeInfo }: ManageRolesPageProps) {
  const { id: orgId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const {
    data: allSupporters,
    isFetching,
    isLoading,
    error,
  } = useGetPublicSupportersQuery(
    { orgId: orgId || '', pageSize: rowsPerPage, page: pageNumber, totalCount: '' },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (error) {
      openSnackbar('Error loading supporters', 'error');
    }
  }, [error]);

  useEffect(() => {
    if (!orgId) {
      openSnackbar('Organization is not available', 'error');
      navigate(getRoute('private.app.organizations'));
    }
  }, [orgId]);

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPageNumber(newPage);
  };

  return (
    <AppContainer
      routeInfo={routeInfo}
      backButtonPath={-1}
      contentColumn={
        <Grid container spacing={2} sx={{ flexDirection: 'column', alignItems: 'center' }}>
          <ContentContainer size={[1.5, 3, 2, 4]} sx={{ mt: 2 }}>
            <Box ml={2}>
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'flex-start' }}
                justifyContent="flex-start"
                alignContent="space-between"
                mt={1}
              />
            </Box>
            <SupportersList supporters={allSupporters?.supporters || []} isLoading={isLoading || isFetching} />
            {allSupporters && !isLoading && (
              <Box display="flex" justifyContent="center">
                <Pagination
                  sx={{
                    mt: 2,
                  }}
                  count={Math.ceil(allSupporters?.totalCount / rowsPerPage)}
                  page={pageNumber}
                  onChange={handleChangePage}
                />
              </Box>
            )}
          </ContentContainer>
        </Grid>
      }
      rightColumn={<Grid item xs></Grid>}
    />
  );
}
