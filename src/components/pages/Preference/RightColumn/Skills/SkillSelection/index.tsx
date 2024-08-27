import { CloseOutlined } from '@mui/icons-material';
import { Autocomplete, Box, Chip, FormControl, Stack, TextField, Typography } from '@mui/material';
import { searchSkillsQueryAtom, searchStringAtom } from '@serverAtoms/preferences/skills/searchSkills.atom';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Skill, SkillSelectionProps, SkillsApiResponse } from '../../../../../../utils/types/preference/languages.type';

const chipContainer = {
  overflowY: 'auto',
  maxHeight: '200px',
  borderBottom: '1px solid #E0E0E0',
  paddingBottom: '20px',
  mt: 1,
};

const SkillSelection: React.FC<SkillSelectionProps> = ({ skill, errors, setSkills }) => {
  const [searchString, setSearchString] = useAtom(searchStringAtom);
  const [skillsData] = useAtom(searchSkillsQueryAtom);

  const handleDelete = (skillId: string) => {
    setSkills((prevSkills: Skill[]) => prevSkills.filter((skill) => skill.id !== skillId));
  };
  const [skillsDataOptions, setSkillsDataOptions] = useState<Skill[]>([]);
  const [error, setError] = useState<boolean>(errors);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddSkill = (newSkills: Skill[]) => {
    if (errors || error) {
      return;
    }
    const filteredSkills = newSkills.filter(
      (newSkill) => !skill.some((existingSkill) => existingSkill.name === newSkill.name)
    );

    setSkills((prevSkills) => [...filteredSkills, ...prevSkills]);
  };

  useEffect(() => {
    const data = (skillsData as unknown as SkillsApiResponse)?.data;
    if (data?.data?.length > 0) {
      setSkillsDataOptions(
        data.data.map((skill) => {
          return { id: skill.id, name: skill.name, ...(skill.id && { default_skill: true }) };
        })
      );
    }
  }, [skillsData]);

  useEffect(() => {
    if (searchString.length < 3) {
      setSkillsDataOptions([]);
    }
  }, [searchString]);

  useEffect(() => {
    if (
      searchString &&
      skill.length > 0 &&
      skill.filter((skill) => skill.name?.toLowerCase() === searchString?.toLowerCase()).length > 0
    ) {
      setErrorMessage('Skill already added');
      setError(true);
    } else if (searchString.length > 15) {
      setErrorMessage('Maximum character limit reached');
      setError(true);
    } else if (skill.length > 49) {
      setErrorMessage('Maximum of 50 skills allowed');
      setError(true);
    } else {
      setErrorMessage(null);
      setError(false);
    }
  }, [searchString, skill]);

  return (
    <Box>
      <FormControl sx={{ m: '40px 0px 10px 0px', width: 600 }}>
        <Autocomplete
          popupIcon={''}
          filterSelectedOptions={true}
          multiple
          limitTags={50}
          id="auto-complete"
          size="small"
          options={skillsDataOptions}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          renderTags={() => ''}
          renderInput={(params) => <TextField {...params} placeholder="Add skills and talents" />}
          onInputChange={(_, newInputValue) => setSearchString(newInputValue)}
          onChange={(_, newValue: (string | Skill)[]) => {
            if (newValue) {
              const lastItem = newValue[newValue.length - 1];
              if (typeof lastItem === 'string') {
                const newSkillName = lastItem;
                const newSkill: Skill = { id: `custom_${newSkillName}`, name: newSkillName, default_skill: false };
                newValue[newValue.length - 1] = newSkill;
              }
              handleAddSkill(newValue as Skill[]);
            } else {
              setSkills([]);
            }
          }}
          freeSolo
          loading={skillsData.isLoading}
          loadingText="Loading..."
          disabled={skill.length > 50}
          value={skill}
        />

        {(errors || error) && <Typography color="error">{errorMessage}</Typography>}
        <Stack
          {...(skill.length && { sx: chipContainer })}
          mt="4px"
          direction="row"
          flexWrap="wrap"
          spacing={1}
          width={600}
          useFlexGap
        >
          {skill.map((skill, index) => (
            <Chip
              key={`${skill.id}_${skill.name}_${index}`}
              label={skill.name}
              onDelete={() => handleDelete(skill.id)}
              deleteIcon={<CloseOutlined />}
              variant="outlined"
              color="primary"
            />
          ))}
        </Stack>
      </FormControl>
    </Box>
  );
};

export default SkillSelection;
