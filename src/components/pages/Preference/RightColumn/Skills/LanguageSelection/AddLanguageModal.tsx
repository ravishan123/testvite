import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import TextField from '@mui/material/TextField';

import { searchLanguagesQueryAtom, searchStringAtom } from '@serverAtoms/preferences/languages/searchLanguages.atom';
import { LanguageResponse } from '@utils/types/preference/languages.type';

import CustomModal from '@ui/customModal';
import { Button } from '@ui/button';
import Autocomplete from '@ui/autocomplete';
import { Typography } from '@ui/typography';

interface LanguageOption {
  label: string;
  value: string;
}

interface AddLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onAddLanguage: (arg0: LanguageOption) => void;
  availableLanguages: LanguageOption[];
}

const AddLanguageModal: React.FC<AddLanguageModalProps> = ({
  isOpen,
  onClose,
  title,
  onAddLanguage,
  availableLanguages,
}) => {
  const [searchString, setSearchString] = useAtom(searchStringAtom);
  const [language, setLanguage] = useState<LanguageOption | null>(null);
  const [languages] = useAtom(searchLanguagesQueryAtom);
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLanguageValid = !language?.value || availableLanguages.some((item) => item.value === language?.value);

  const handleInputChange = (_: React.SyntheticEvent, newInputValue: string) => {
    if (newInputValue.length > 30) {
      setErrorMessage('Maximum character limit is 30');
      return;
    } else {
      setErrorMessage(null);
    }

    if (!language?.value) {
      setSearchString(newInputValue);
    }
    setLanguage({ label: newInputValue, value: '' });
  };

  useEffect(() => {
    if (languages && languages?.data) {
      const _language = languages as unknown as LanguageResponse;
      const languagesData = _language?.data || [];
      if (languagesData?.data?.length) {
        const options: LanguageOption[] = languagesData.data.map((lang) => ({
          label: lang.name || '',
          value: lang.id,
        }));
        setLanguageOptions(options);
      }
    }
  }, [languages]);

  useEffect(() => {
    if (searchString.length < 3) {
      setLanguageOptions([]);
    }
  }, [searchString]);

  return (
    <CustomModal
      open={isOpen}
      onClose={() => {
        onClose();
        setLanguage(null);
        setSearchString('');
      }}
      title={title}
      width={521}
      footerContent={
        <Button
          sx={{ width: 208 }}
          variant="contained"
          color="primary"
          onClick={() => {
            if (!language?.value) {
              setErrorMessage('Please add the language');
              return;
            }
            onAddLanguage(language);
            setLanguage(null);
            setSearchString('');
          }}
          disabled={isLanguageValid}
        >
          Add
        </Button>
      }
    >
      <div>
        <Typography variant="body4">Language name</Typography>
        <Autocomplete
          value={language}
          open={languageOptions.length > 0 && !language?.value && searchString.length > 0}
          onInputChange={handleInputChange}
          onChange={(_, value) => {
            if (!value) return;
            setLanguage({ label: value.label, value: value.value });
            setSearchString('');
          }}
          options={languageOptions}
          renderInput={(params) => <TextField {...params} placeholder="Enter language name" />}
          loading={languages?.isLoading}
          noOptionsText="No languages found"
          loadingText="Loading..."
          popupIcon={false}
        />
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </div>
    </CustomModal>
  );
};

export default AddLanguageModal;
