import { useEffect, useState } from 'react';
import { uniqBy } from 'lodash-es';

import { Skill } from '@utils/types/preference/languages.type';
import { useSearchSkillsQuery } from '@store/slices/preference/preference.slice';

import Autocomplete from '@ui/autocomplete';
import { Chip } from '@ui/chip';
import { Grid, Stack } from '@ui/layout';
import { TextField } from '@ui/textField';
import { Close } from '@ui/icons';
import { CircularProgress } from '@ui/circularProgress';
import { FormLabel } from '@ui/forms';
import { Typography } from '@ui/typography';

type SkillsAutoCompleteProps = {
  skills: (string | Skill)[];
  error?: Error | null;
  maxItems?: number;
  textLimit?: number;
  onChange: (skills: (string | Skill)[]) => void;
};

const SkillsAutoComplete = ({
  skills: skills = [],
  error: formError,
  maxItems = 3,
  textLimit = 15,
  onChange,
}: SkillsAutoCompleteProps) => {
  const [searchString, setSearchString] = useState('');
  const {
    data: skillsData,
    error: apiCallError,
    isError,
    isFetching,
  } = useSearchSkillsQuery(searchString, {
    skip: searchString?.length < 4,
    refetchOnMountOrArgChange: true,
  });
  const [error, setError] = useState<Error | null | undefined>(formError);

  useEffect(() => {
    if (searchString.length > textLimit) {
      setError(new Error('Maximum character limit reached'));
    } else if (skills.length > maxItems) {
      setError(new Error(`Maximum of ${maxItems} skills allowed`));
    } else if (formError) {
      setError(new Error(formError?.message));
    } else if (isError) {
      setError(new Error((apiCallError as Error)?.message));
    } else {
      setError(null);
    }
  }, [skills.length, searchString, formError?.message, isError, apiCallError]);

  const handleDelete = (skillToDelete: string | Skill) => {
    const updatedSkills = [...skills].filter((skill) => {
      if (typeof skill === 'string' && typeof skillToDelete === 'string') {
        return skill !== skillToDelete;
      } else if (typeof skill !== 'string' && typeof skillToDelete !== 'string') {
        return skill?.id !== skillToDelete?.id;
      }
    });

    onChange && onChange(updatedSkills);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormLabel>Your skills and talents</FormLabel>
        <Typography variant="body1-secondary">You can add up to ten skills and talents</Typography>
      </Grid>
      <Grid item xs={12} mb={2} mt={1}>
        <Autocomplete
          multiple
          autoComplete
          options={skillsData || []}
          renderTags={() => null}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          onInputChange={(_, value) => {
            setSearchString(value);
          }}
          onChange={(_, value, reason) => {
            if (reason !== 'removeOption') {
              if (searchString.length < textLimit && reason !== 'clear') {
                onChange && onChange(uniqBy(value, (item) => (typeof item === 'string' ? item : item.id)));
              }
            }
          }}
          freeSolo
          inputValue={searchString}
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!error}
              helperText={error?.message}
              InputProps={{
                ...params.InputProps,
                placeholder: 'Add skills and talents',
                style: { paddingRight: 45 },
                endAdornment: (
                  <>
                    {isFetching ? <CircularProgress color="inherit" size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          value={skills || []}
        />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {skills.map((skill) => (
            <Chip
              key={`skill-${typeof skill === 'string' ? skill : skill.id}`}
              deleteIcon={<Close />}
              label={typeof skill === 'string' ? skill : skill.name}
              color="primary"
              variant="outlined"
              onDelete={() => handleDelete(skill)}
            />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default SkillsAutoComplete;
