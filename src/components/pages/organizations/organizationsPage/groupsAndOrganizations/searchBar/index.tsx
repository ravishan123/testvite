import { useEffect, useState } from 'react';
import { Box } from '@ui/layout';
import { SearchIcon } from '@ui/icons';
import { TextField } from '@ui/textField';
import { InputAdornment } from '@ui/inputAdornment';
import { Typography } from '@ui/typography';
import { Select } from '@ui/select';
import { MenuItem } from '@ui/menuItem';
import { useTheme } from '@ui/theme';
import causes from '@constants/causes.const';

export interface SearchValues {
  name: string;
  causeId: string;
  sortByFilter: 'nf' | 'sc' | 'vh';
}

interface SearchBarProps {
  setSearchValues: React.Dispatch<React.SetStateAction<SearchValues>>;
  resetSearch: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchValues, resetSearch }) => {
  const { palette, fontSize } = useTheme();
  const [name, setName] = useState<string>('');
  const [causeId, setCauseId] = useState<string>('Show All');
  const [sortByFilter, setSortByFilter] = useState<'nf' | 'sc' | 'vh'>('nf');

  // Effect to reset the search values when the resetSearch flag changes
  useEffect(() => {
    if (resetSearch) {
      setName('');
      setCauseId('Show All');
      setSortByFilter('nf');
    }
  }, [resetSearch]);

  useEffect(() => {
    const searchItems = { name, causeId, sortByFilter };
    setSearchValues(searchItems);
  }, [name, causeId, sortByFilter, setSearchValues]);

  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'stretch', sm: 'flex-start' }}
      justifyContent="flex-start"
      alignContent="space-between"
      mt={1}
    >
      <Box mb={{ xs: 2, sm: 0 }} mr={2} maxWidth={{ sm: '60%', md: '60%', xs: '100%' }} flex="1">
        <TextField
          placeholder="Search by name"
          fullWidth
          onChange={(e) => setName(e.target.value)}
          value={name}
          InputProps={{
            style: { backgroundColor: palette.primary.light, height: 36 },
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ width: 20, color: palette.common.black }} />
              </InputAdornment>
            ),
          }}
          sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
        />
      </Box>

      <Box
        mt={{ xs: 2, sm: 0 }}
        ml={{ xs: 0, sm: 2 }}
        display="flex"
        alignItems="center"
        flexDirection="row"
        flexWrap="wrap"
      >
        <Typography variant="body4" sx={{ mr: { xs: 0, sm: 2 }, mt: 1 }}>
          Filter by
        </Typography>
        <Select
          placeholder="Show All"
          onChange={(e) => setCauseId(e.target.value)}
          value={causeId}
          sx={{
            height: 36,
            bgcolor: palette.primary.light,
            width: { xs: '100%', sm: '148px' },
            mr: 2,
            fontSize: fontSize.xs,
            '.MuiOutlinedInput-notchedOutline': { border: 0 },
          }}
        >
          <MenuItem sx={{ fontSize: fontSize.xs }} value={'Show All'}>
            All causes
          </MenuItem>
          {Object.values(causes).map((cause) => (
            <MenuItem key={cause.id} sx={{ fontSize: fontSize.xs }} value={cause.id}>
              {cause.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box
        mt={{ xs: 2, sm: 0 }}
        ml={{ xs: 0, sm: 2 }}
        display="flex"
        alignItems="center"
        flexDirection="row"
        flexWrap="wrap"
      >
        <Typography variant="body4" component="div" sx={{ mr: 2, mt: 1 }}>
          Sort by
        </Typography>
        <Select
          placeholder="Newest first"
          onChange={(e) => setSortByFilter(e.target.value as 'nf' | 'sc' | 'vh')}
          value={sortByFilter}
          sx={{
            height: 36,
            bgcolor: palette.primary.light,
            width: { xs: '100%', sm: '148px', md: '148px' },
            mr: 2,
            fontSize: fontSize.xs,
            '.MuiOutlinedInput-notchedOutline': { border: 0 },
          }}
        >
          <MenuItem value={'nf'} sx={{ fontSize: fontSize.xs }}>
            Newest First
          </MenuItem>
          <MenuItem value={'vh'} sx={{ fontSize: fontSize.xs }}>
            Volunteer Hours
          </MenuItem>
          <MenuItem sx={{ fontSize: fontSize.xs }} value={'sc'}>
            Supporters Count
          </MenuItem>
        </Select>
      </Box>
    </Box>
  );
};

export default SearchBar;
