import { styled, useTheme } from '@ui/theme';
import { Table, TableCell, TableBody, TableRow, TableHead, TableContainer } from '@ui/table';
import { Pagination } from '@ui/pagination';
import { ReactNode } from 'react';
import { Box } from '@ui/layout';
import { Typography } from '@ui/typography';
import { InfoOutlinedIcon } from '@ui/icons';
import { LinearProgress } from '@ui/linearProgress';
import { Skeleton } from '@ui/skeleton';

interface TableColumn<T extends string> {
  width?: string;
  maxWidth?: string;
  key: T;
  title: string;
}

interface TableData<T extends string> {
  id: T;
  [key: string]: string | ReactNode | number;
}

interface ResponsiveTableProps<T extends string> {
  columns: TableColumn<T>[];
  data: TableData<T>[];
  page: number;
  numberOfItems: number;
  setPage: (page: number) => void;
  loading?: boolean;
  onRowClick?: (row: TableData<T>) => void;
  noDataComponent?: ReactNode;
  isSkeleton?: boolean;
}

const ResponsiveTableContainer = styled(TableContainer)`
  max-width: auto;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
`;

function CustomTable<T extends string>({
  columns,
  data,
  page,
  setPage,
  numberOfItems,
  loading,
  onRowClick,
  noDataComponent,
  isSkeleton = true,
}: ResponsiveTableProps<T>) {
  const { palette } = useTheme();
  const rowsPerPage = 10;

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  return (
    <ResponsiveTableContainer>
      {loading ? <LinearProgress sx={{ height: 2, width: '100%' }} /> : null}
      <Table aria-label="responsive table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                sx={{
                  color: 'text.secondary',
                  borderBottom: `1px solid ${palette.grey[100]}`,
                  borderTop: `1px solid ${palette.grey[100]}`,
                  pt: 1,
                  pb: 1,
                  width: column.width ? column.width : 'auto',
                  maxWidth: column.maxWidth ? column.maxWidth : 'none', // Apply maxWidth if provided
                }}
                key={column.key}
              >
                <Typography variant="body1" color="text.secondary">
                  {column.title}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading && isSkeleton
            ? Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton height={20} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : data.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => onRowClick && onRowClick(row)}
                  sx={{ cursor: onRowClick && 'pointer' }}
                >
                  {columns.map((column) => (
                    <TableCell
                      size="small"
                      sx={{
                        py: 1,
                        maxWidth: column.maxWidth || 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }} // Apply truncation styles
                      align="left"
                      key={column.key}
                    >
                      <Typography variant="body1">{row[column.key]}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {/* Render custom "No Data" component if provided, otherwise show default */}
      {data.length === 0 &&
        !loading &&
        (noDataComponent ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={3}
          >
            {noDataComponent}
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={3}
          >
            <InfoOutlinedIcon sx={{ fontSize: 50, color: palette.grey[200], m: 1 }} />
            <Typography variant="h3" sx={{ color: palette.grey[200] }}>
              No Data
            </Typography>
          </Box>
        ))}

      {!loading && data.length !== 0 && (
        <Pagination
          sx={{
            mt: 1,
          }}
          count={Math.ceil(numberOfItems / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      )}
    </ResponsiveTableContainer>
  );
}

export default CustomTable;
