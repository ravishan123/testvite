import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import AddLanguageModal from './AddLanguageModal';
import { useSnackbar } from '@ui/snackBar';
import { fluencies, languages } from '../../../../../../utils/constants/languages';
import {
  Language,
  LanguageOption,
  LanguageWithAbilities,
} from '../../../../../../utils/types/preference/languages.type';
import { AddIcon } from '@ui/icons';

interface LanguageSelectionProps {
  language: Language[] | LanguageWithAbilities[];
  setLanguage: React.Dispatch<React.SetStateAction<Language[]>>;
  errors: boolean;
}
const LanguageSelection: React.FC<LanguageSelectionProps> = ({ language, setLanguage, errors = false }) => {
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    if (language.length >= 5) {
      openSnackbar('Maximum of 5 languages allowed', 'error');
      return null;
    }
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleAddLanguage = (obj: LanguageOption) => {
    if (obj.label && obj.value) {
      setLanguage((prevLanguage) => [
        ...prevLanguage,
        { language: obj.label, id: obj.value, fluency: [], isManuallyAdded: true },
      ]);
      closeModal();
    } else return null;
  };

  const toggleFluency = (id: string, fluency: string) => {
    setLanguage((prevLanguage) =>
      prevLanguage.map((item) => {
        if (item.id === id) {
          if (fluency === 'All') {
            return {
              ...item,
              fluency: item.fluency?.includes('All') ? [] : [...fluencies.slice(0, 5)],
            };
          } else {
            const updatedFluency = item.fluency?.includes(fluency)
              ? item.fluency.filter((f) => f !== fluency)
              : [...(Array.isArray(item.fluency) ? item.fluency : []), fluency];

            if (updatedFluency.length < 5) {
              return {
                ...item,
                fluency: updatedFluency.filter((f) => f !== 'All'),
              };
            } else {
              return {
                ...item,
                fluency: ['All', ...fluencies.slice(0, 5)],
              };
            }
          }
        }
        return item;
      })
    );
  };

  const deleteRow = (id: string) => {
    setLanguage((prevLanguage) => prevLanguage.filter((item) => item.id !== id));
  };
  return (
    <Box>
      <TableContainer>
        <Table sx={{ tableLayout: 'auto' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderBottom: 'none', width: '160px' }} />
              {fluencies.map((fluency) => (
                <TableCell variant="head" align="center" key={fluency} sx={{ borderBottom: 'none' }}>
                  <Typography variant="body1">{fluency}</Typography>
                </TableCell>
              ))}
              <TableCell sx={{ borderBottom: 'none' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {language.map((item, index) => (
              <>
                <TableRow key={item.language} sx={{ borderBottom: 'none' }}>
                  <TableCell sx={{ borderBottom: 'none' }}>
                    <Typography variant="body1" fontSize={14}>
                      {item.language}
                    </Typography>
                  </TableCell>
                  {fluencies.map((fluency, index) => (
                    <TableCell
                      padding="normal"
                      align="center"
                      variant="body"
                      key={fluency}
                      sx={{ borderBottom: 'none' }}
                    >
                      <Checkbox
                        key={`${fluency}_${index}`}
                        onChange={() => toggleFluency(item.id, fluency)}
                        color="success"
                        checked={item.fluency?.includes(fluency)}
                      />
                    </TableCell>
                  ))}
                  <TableCell sx={{ borderBottom: 'none' }}>
                    {index !== 0 && (
                      <IconButton
                        sx={{ color: theme.palette.grey[200], padding: 0 }}
                        onClick={() => deleteRow(item.id)}
                        aria-label="delete"
                      >
                        <DeleteOutline />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ textAlign: 'right' }}>
                  <TableCell colSpan={fluencies.length + 2} sx={{ border: 'none', padding: 0 }}>
                    {errors && item.id !== languages[0].value && item.fluency?.length === 0 && (
                      <Typography sx={{ color: 'red', textAlign: 'right' }}>Please add your fluency areas.</Typography>
                    )}
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ width: '600px', display: 'flex', justifyContent: 'flex-end' }} mt={2}>
        <Typography
          sx={{ fontWeight: 500, display: 'flex', cursor: 'pointer', width: '124px' }}
          variant="button"
          color="primary"
          onClick={openModal}
        >
          <AddIcon /> Add language
        </Typography>
      </Box>

      <AddLanguageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Add language"
        onAddLanguage={handleAddLanguage}
        availableLanguages={language.map<LanguageOption>((item) => {
          return { label: item.language || '', value: item.id };
        })}
      />
      {errors ||
        (language.length > 5 && <Typography sx={{ color: 'red' }}>Maximum of 5 languages allowed.</Typography>)}
    </Box>
  );
};

export default LanguageSelection;
