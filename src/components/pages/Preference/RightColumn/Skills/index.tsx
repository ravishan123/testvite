import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import isEqual from 'lodash-es/isEqual';
import { useQueryClient } from '@tanstack/react-query';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

import { storeLanguagesAtom } from '@serverAtoms/preferences/languages/storeLanguages.atom';
import { storeSkillsAtom } from '@serverAtoms/preferences/skills/storeSkills.atom';
import { postSkillsAtom } from '@serverAtoms/preferences/skills/postSkills.atom';
import { patchSkillsAtom } from '@serverAtoms/preferences/skills/patchSkills.atom';
import { postLanguagesAtom } from '@serverAtoms/preferences/languages/postLanguages.atom';
import { patchLanguagesAtom } from '@serverAtoms/preferences/languages/patchLanguages.atom';
import { GET_USER_SKILLS } from '@serverAtoms/preferences/skills/mutationKeys';
import { GET_USER_LANGUAGES } from '@serverAtoms/preferences/languages/mutationKeys';
import { isPreferenceLoadingAtom } from '@applicationAtoms/preference.atom';
import { languages } from '@utils/constants/languages';
import { Language, Skill, SkillsProps } from '@utils/types/preference/languages.type';

import { Button } from '@ui/button';
import { useSnackbar } from '@ui/snackBar';

import SkillSelection from './SkillSelection';
import LanguageSelection from './LanguageSelection';
import { languages as preDefinedLanguage } from '@utils/constants/languages';

const Skills: React.FC<SkillsProps> = ({ handleNextStep, handleBackStep, handleComplete }) => {
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbar();
  const initialAvailability = languages.map((language) => ({
    language: language.label,
    id: language.value,
    fluency: [],
  }));

  const [skillsAtom] = useAtom(storeSkillsAtom);
  const [languagesAtom] = useAtom(storeLanguagesAtom);

  const [skill, setSkills] = useState<Skill[]>([]);
  const [language, setLanguage] = useState<Language[]>(initialAvailability);

  const [skillErrors, setSkillErrors] = useState<boolean>(false);
  const [languageErrors, setLanguageErrors] = useState<boolean>(false);

  const [postSkills, mutate] = useAtom(postSkillsAtom);
  const [patchSkills, mutatePatch] = useAtom(patchSkillsAtom);

  const [postLanguages, mutateLanguagePost] = useAtom(postLanguagesAtom);
  const [patchLanguages, mutateLanguagePatch] = useAtom(patchLanguagesAtom);
  const [isLoading, setIsLoading] = useAtom(isPreferenceLoadingAtom);

  const fluencyError = language.filter((item: Language) => !item.fluency?.length && item.id !== languages[0].value);

  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [languageData, setLanguageData] = useState<Language[]>([]);

  useEffect(() => {
    setSkillsData(skillsAtom?.data?.data as unknown as Skill[]);
  }, [skillsAtom?.data?.data]);

  useEffect(() => {
    setLanguageData(languagesAtom?.data?.data as unknown as Language[]);
  }, [languagesAtom?.data?.data]);

  const postSkillsMutation = async () => {
    const payload = skill.map((item) => {
      return { ...(item.default_skill && { id: item.id }), name: item.name, default_skill: item.default_skill };
    });

    if (skill.length) {
      await mutate([payload]);
      return true;
    }

    return false;
  };

  const patchSkillsMutation = async () => {
    const payload = skill.map((item) => {
      return { id: item.id, name: item.name, default_skill: item.default_skill };
    });

    if (!isEqual(skillsAtom.data?.data, payload)) {
      await mutatePatch([payload]);
      return true;
    }

    return false;
  };

  const postLanguagesMutation = async () => {
    const payload = language.map((item) => {
      return {
        language_id: item.id,
        abilities: {
          read: item.fluency?.map((str) => str.toLowerCase()).includes('read') || false,
          write: item.fluency?.map((str) => str.toLowerCase()).includes('write') || false,
          speak: item.fluency?.map((str) => str.toLowerCase()).includes('speak') || false,
          type: item.fluency?.map((str) => str.toLowerCase()).includes('type') || false,
        },
      };
    });

    if (payload.length) {
      await mutateLanguagePost([payload]);
      return true;
    }

    return false;
  };

  const patchLanguagesMutation = async () => {
    const payload = language.map((item) => {
      return {
        language_id: item.id,
        abilities: {
          read: item.fluency?.map((str) => str.toLowerCase()).includes('read') || false,
          write: item.fluency?.map((str) => str.toLowerCase()).includes('write') || false,
          speak: item.fluency?.map((str) => str.toLowerCase()).includes('speak') || false,
          type: item.fluency?.map((str) => str.toLowerCase()).includes('type') || false,
        },
      };
    });

    const currentLanguages = (languagesAtom?.data?.data as unknown as Language[])?.map((item) => {
      return {
        language_id: item?.id,
        abilities: item?.abilities,
      };
    });

    if (!isEqual(currentLanguages, payload)) {
      await mutateLanguagePatch([payload]);
      return true;
    }

    return false;
  };

  const validateSteps = async () => {
    let hasLanguageUpdate = false;
    let hasSkillsUpdate = false;
    let isUpdated = false;

    if (fluencyError?.length > 0 || language.length > 5) {
      setLanguageErrors(true);
    } else if (skill?.length > 50) {
      setSkillErrors(true);
    } else {
      setSkillErrors(false);
      setLanguageErrors(false);
      try {
        if (skillsData?.length > 0) {
          hasSkillsUpdate = await patchSkillsMutation();

          if (hasSkillsUpdate) {
            void queryClient.invalidateQueries([GET_USER_SKILLS]);
            void skillsAtom.refetch();
            isUpdated = true;
          }
        } else {
          hasSkillsUpdate = await postSkillsMutation();

          if (hasSkillsUpdate) {
            void queryClient.invalidateQueries([GET_USER_SKILLS]);
            void skillsAtom.refetch();
            isUpdated = true;
          }
        }

        if (languageData.length > 0) {
          hasLanguageUpdate = await patchLanguagesMutation();

          if (hasLanguageUpdate) {
            void queryClient.invalidateQueries([GET_USER_LANGUAGES]);
            void languagesAtom.refetch();
            isUpdated = true;
          }
        } else {
          hasLanguageUpdate = await postLanguagesMutation();

          if (hasLanguageUpdate) {
            void queryClient.invalidateQueries([GET_USER_LANGUAGES]);
            void languagesAtom.refetch();
            isUpdated = true;
          }
        }

        if (hasLanguageUpdate || hasSkillsUpdate) {
          openSnackbar('Successfully saved your skills & talents', 'success');
          handleComplete();
        }

        handleNextStep(isUpdated);
      } catch (error) {
        openSnackbar('Something went wrong', 'error');
      }
    }
  };

  useEffect(() => {
    if (skillsData?.length > 0) {
      const newSkills = skillsData.map((skill: Skill) => {
        return {
          id: skill.id,
          name: skill.name,
          default_skill: skill.default_skill,
        };
      });
      setSkills(newSkills);
    } else {
      setSkills([]);
    }
  }, [skillsData]);

  useEffect(() => {
    if (languageData?.length > 0) {
      let newLanguage = languageData.map((_language: Language) => {
        const abilitiesObj: { [key: string]: unknown } = _language.abilities as { [key: string]: unknown };

        return {
          id: _language.id,
          name: _language.name,
          language: _language.name,
          default_language: _language.default_language,
          fluency: Object.keys(abilitiesObj)
            .filter((key: string) => abilitiesObj[key])
            .map((str: string) => str.charAt(0).toUpperCase() + str.slice(1)),
        } as Language;
      });
      const isEnglishAvailable = newLanguage.find((item) => item.name === `English`);
      const engObj = preDefinedLanguage.find((item) => item.label === `English`);
      if (!isEnglishAvailable && engObj) {
        newLanguage = [
          {
            language: engObj?.label,
            name: engObj.label,
            id: engObj?.value,
            fluency: [],
            default_language: undefined,
            isManuallyAdded: false,
          },
          ...newLanguage,
        ];
      }
      setLanguage(newLanguage);
    } else {
      setLanguage(language);
    }
  }, [languageData]);

  useEffect(() => {
    setIsLoading(
      postSkills?.isLoading ||
        patchSkills?.isLoading ||
        postLanguages?.isLoading ||
        patchLanguages?.isLoading ||
        skillsAtom?.isLoading ||
        languagesAtom?.isLoading
    );
  }, [
    postSkills.isLoading,
    patchSkills.isLoading,
    postLanguages.isLoading,
    patchLanguages.isLoading,
    skillsAtom?.isLoading,
    languagesAtom?.isLoading,
  ]);

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Your skills & talents
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
        }}
      >
        Add up to 50 skills & talents that you wish to offer voluntarily
      </Typography>
      <SkillSelection skill={skill} setSkills={setSkills} errors={skillErrors} />
      <Box>
        <Typography variant="h3" margin="35px 0 35px 0">
          What languages do you know?
        </Typography>
        <LanguageSelection language={language} setLanguage={setLanguage} errors={languageErrors} />
      </Box>

      <Grid container spacing={2} mt={6} sx={{ justifyContent: 'flex-end' }}>
        <Grid item xs={4} md={4.5} display="block">
          <Button onClick={handleBackStep} fullWidth variant="outlined" color="secondary">
            Back
          </Button>
        </Grid>
        <Grid item xs={4} md={4.3}>
          <Button onClick={validateSteps} fullWidth color="primary" loading={isLoading}>
            Next
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Skills;
