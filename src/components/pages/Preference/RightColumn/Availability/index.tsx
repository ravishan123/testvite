import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import {
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  SvgIcon,
  Box,
  Divider,
  Alert,
} from '@mui/material';
import isEqual from 'lodash-es/isEqual';
import isEmpty from 'lodash-es/isEmpty';

import {
  AvailabilityActionProps,
  GetAvailabilityAPIResponse,
  GetAvailabilityRemoteAPIResponse,
} from '@utils/types/preference/availability.type';
import { postAvailabilityAtom } from '@serverAtoms/preferences/availability/postAvailability.atom';
import { getAvailabilityQueryAtom } from '@serverAtoms/preferences/availability/getAvailability.atom';
import { patchAvailabilityAtom } from '@serverAtoms/preferences/availability/patchAvailability.atom';
import { getAvailabilityRemoteQueryAtom } from '@serverAtoms/preferences/availabilityRemote/getAvailabilityRemote.atom';
import { postAvailabilityRemoteAtom } from '@serverAtoms/preferences/availabilityRemote/postAvailabilityRemote.atom';
import { patchAvailabilityRemoteAtom } from '@serverAtoms/preferences/availabilityRemote/patchAvailabilityRemote.atom';
import { isPreferenceLoadingAtom } from '@applicationAtoms/preference.atom';

import { Button } from '@ui/button';
import MorningIcon from '@ui/icons/MorningIcon';
import AfternoonIcon from '@ui/icons/AfternoonIcon';
import EveningIcon from '@ui/icons/EveningIcon';
import CommonSwitch from '@ui/switch';
import { useSnackbar } from '@ui/snackBar';
import { ErrorOutlineIcon } from '@ui/icons';

import { convertToAvailabilityPayload } from './convertToAvailabilityPayload';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const timeSlots = ['morning', 'afternoon', 'evening'];
const icons: JSX.Element[] = [MorningIcon, AfternoonIcon, EveningIcon];

const Availability: React.FC<AvailabilityActionProps> = ({ handleNextStep, handleBackStep, handleComplete }) => {
  const { openSnackbar } = useSnackbar();
  const [getAvailability] = useAtom(getAvailabilityQueryAtom);
  const [postAvailability, mutatePostAvailability] = useAtom(postAvailabilityAtom);
  const [patchAvailability, mutatePatchAvailability] = useAtom(patchAvailabilityAtom);

  const [getAvailabilityRemote] = useAtom(getAvailabilityRemoteQueryAtom);
  const [postAvailabilityRemote, mutatePostAvailabilityRemote] = useAtom(postAvailabilityRemoteAtom);
  const [patchAvailabilityRemote, mutatePatchAvailabilityRemote] = useAtom(patchAvailabilityRemoteAtom);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<{ [key: string]: string[] }>({});
  const [selectedRemoteAvailability, setSelectedRemoteAvailability] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useAtom(isPreferenceLoadingAtom);

  let availability = getAvailability.data as GetAvailabilityAPIResponse;
  const remoteAvailability = getAvailabilityRemote.data as GetAvailabilityRemoteAPIResponse;

  const handleDayChange = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays((prev) => prev.filter((d) => d !== day));
      setSelectedSlots((prev) => {
        const updatedSlots = { ...prev };
        updatedSlots[day] = [];
        return updatedSlots;
      });
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[day];
        return updatedErrors;
      });
    } else {
      setSelectedDays((prev) => [...prev, day]);
    }
  };

  const handleSlotChange = (day: string, slot: string) => {
    const updatedSlots = { ...selectedSlots };
    if (!updatedSlots[day]) updatedSlots[day] = [];
    if (updatedSlots[day].includes(slot)) {
      updatedSlots[day] = updatedSlots[day].filter((s) => s !== slot);
    } else {
      updatedSlots[day].push(slot);
    }
    setSelectedSlots(updatedSlots);

    /*
     * Check if any slots are selected for the day
     * If true, add the day to selectedDays.
     * Else remove the day from selectedDays
     */
    if (updatedSlots[day].length > 0) {
      if (!selectedDays.includes(day)) {
        setSelectedDays((prevDays) => [...prevDays, day]);
      }
    } else {
      setSelectedDays((prevDays) => prevDays.filter((d) => d !== day));
    }

    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[day];
      return updatedErrors;
    });
  };

  const validateAndProceed = async () => {
    const newErrors: Record<string, string> = {};
    let hasAvailabilityUpdates = false;
    let hasRemoteAvailabilityUpdates = false;

    for (const day of selectedDays) {
      if (!selectedSlots[day] || selectedSlots[day].length === 0) {
        newErrors[day] = `Please select a slot on ${day.charAt(0).toUpperCase() + day.slice(1)}`;
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const availabilityPayload = convertToAvailabilityPayload(selectedSlots);
    try {
      if (availability?.isAvailability) {
        const currentAvailability: Record<string, object> = {};

        availability.data.forEach(({ weekday, ...dayAvailability }) => {
          currentAvailability[weekday] = dayAvailability;
        });

        hasAvailabilityUpdates = !isEqual(currentAvailability, availabilityPayload);

        if (hasAvailabilityUpdates) {
          await mutatePatchAvailability([availabilityPayload]).then(() => {
            void getAvailability.refetch();
          });
        }
      } else {
        if (!isEmpty(availabilityPayload)) {
          await mutatePostAvailability([availabilityPayload]).then(() => {
            void getAvailability.refetch();
          });

          hasAvailabilityUpdates = true;
        }
      }
      if (remoteAvailability?.data?.availability !== undefined) {
        hasRemoteAvailabilityUpdates = remoteAvailability.data.availability !== selectedRemoteAvailability;

        if (hasRemoteAvailabilityUpdates) {
          await mutatePatchAvailabilityRemote([selectedRemoteAvailability]).then(() => {
            void getAvailabilityRemote.refetch();
          });
        }
      } else {
        await mutatePostAvailabilityRemote([selectedRemoteAvailability]).then(() => {
          void getAvailabilityRemote.refetch();
        });

        hasRemoteAvailabilityUpdates = true;
      }

      if (hasAvailabilityUpdates || hasRemoteAvailabilityUpdates) {
        handleComplete();
        openSnackbar('Availability updated successfully', 'success');
      }

      handleNextStep(hasAvailabilityUpdates || hasRemoteAvailabilityUpdates);
    } catch (error) {
      openSnackbar('Something went wrong', 'error');
    }
  };

  useEffect(() => {
    if (getAvailability?.data?.data) {
      availability = getAvailability.data as GetAvailabilityAPIResponse;
      const initialSelectedDays = availability?.data?.map((a) => a.weekday);
      const initialSelectedSlots: { [key: string]: string[] } = {};

      setSelectedDays(initialSelectedDays);

      for (const day of initialSelectedDays) {
        const slots: string[] = [];
        const currentDay = availability.data.find((a) => a.weekday === day);

        if (currentDay) {
          if (currentDay?.morning) slots.push('morning');
          if (currentDay?.afternoon) slots.push('afternoon');
          if (currentDay?.evening) slots.push('evening');
        }

        initialSelectedSlots[day] = slots;
      }

      setSelectedSlots(initialSelectedSlots);
    }
  }, [getAvailability?.data?.data]);

  useEffect(() => {
    setSelectedRemoteAvailability(remoteAvailability?.data?.availability || false);
  }, [remoteAvailability?.data]);

  useEffect(() => {
    setIsLoading(
      postAvailability.isLoading ||
        patchAvailability.isLoading ||
        patchAvailabilityRemote.isLoading ||
        postAvailabilityRemote.isLoading ||
        getAvailability.isLoading ||
        getAvailabilityRemote.isLoading
    );
  }, [
    postAvailability.isLoading,
    patchAvailability.isLoading,
    patchAvailabilityRemote.isLoading,
    postAvailabilityRemote.isLoading,
    getAvailability.isLoading,
    getAvailabilityRemote.isLoading,
  ]);

  return (
    <Grid maxWidth={488}>
      <Typography variant="h3" gutterBottom>
        Availability to volunteer
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
        }}
      >
        Select days & the time of day you are available to volunteer
      </Typography>
      <Grid container>
        <Grid item sx={{ marginTop: '24px', padding: '0!important' }}>
          <TableContainer>
            {/**
             * Commenting below error component as it is not required for now
             */}
            {
              errors && Object.values(errors).length > 0 && (
                // Object.values(errors).map((value) => {
                //   return (
                <Box
                  sx={{
                    marginTop: '16px',
                    marginBottom: '20px',
                  }}
                >
                  <Alert
                    severity="error"
                    sx={{
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: 'none',
                      borderRadius: '4px',
                      background: '#FFF0EB',
                      boxShadow: 'none',
                      padding: '0px',
                    }}
                    icon={<ErrorOutlineIcon sx={{ color: '#EF5D2F' }} />}
                  >
                    <Typography sx={{ color: '#EF5D2F', fontSize: '12px' }}>
                      You need to select a time of the day to proceed
                    </Typography>
                  </Alert>
                </Box>
              )
              //   );
              // })
            }

            <Table style={{ tableLayout: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ borderBottom: 'none', paddingTop: '40px', paddingLeft: '30px', opacity: '0.4' }}>
                    <Typography variant="body1" color="text.secondary">
                      Days
                    </Typography>
                  </TableCell>
                  {timeSlots.map((slot, index) => (
                    <TableCell key={slot} style={{ borderBottom: 'none' }}>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <SvgIcon sx={{ marginRight: '8px' }}>{icons[index]}</SvgIcon>
                        <Typography variant="body1">{slot.charAt(0).toUpperCase() + slot.slice(1)}</Typography>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {daysOfWeek.map((day, index) => (
                  <>
                    <TableRow key={day}>
                      <TableCell key={`${day}_${index}`} style={{ borderBottom: 'none' }}>
                        <FormControlLabel
                          key={`${index}${day}_`}
                          control={
                            <Checkbox
                              key={`${index}_${day}_`}
                              checked={selectedDays.includes(day)}
                              onChange={() => handleDayChange(day)}
                              color="success"
                              sx={{ paddingRight: '5px' }}
                            />
                          }
                          label={
                            <Typography key={`${day}_${index}`} variant="body1">
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </Typography>
                          }
                        />
                      </TableCell>
                      {timeSlots.map((slot, index) => (
                        <TableCell key={slot} style={{ borderBottom: 'none', minWidth: 125 }}>
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <Checkbox
                              key={`${day}_${index}`}
                              checked={selectedSlots[day]?.includes(slot) || false}
                              onChange={() => handleSlotChange(day, slot)}
                              color="success"
                            />
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                    {/* {errors[day] && (
                      <TableRow>
                        <TableCell colSpan={timeSlots.length + 2} sx={{ border: 'none', padding: 0 }}>
                          <Box>
                            <Alert
                              severity="error"
                              sx={{
                                textAlign: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: 'none',
                                borderRadius: '4px',
                                background: '#FFF0EB',
                                boxShadow: 'none',
                                padding: '0px',
                              }}
                              icon={<ErrorOutlineIcon sx={{ color: '#EF5D2F' }} />}
                            >
                              <Typography sx={{ color: '#EF5D2F', fontSize: '12px' }}>{errors[day]}</Typography>
                            </Alert>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}{' '} */}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} mb={6} mt={1}>
          <Divider light />
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={3}>
            <Typography variant="body1" fontSize={14}>
              Are you interested to volunteer remotely?
            </Typography>
            <CommonSwitch
              checked={selectedRemoteAvailability}
              onChange={() => setSelectedRemoteAvailability((prev) => !prev)}
            />
          </Box>
          <Divider light />
        </Grid>
        <Grid container spacing={1} direction="row">
          <Grid item xs>
            <Button onClick={handleBackStep} variant="outlined" color="secondary" fullWidth>
              Back
            </Button>
          </Grid>
          <Grid item xs>
            <Button onClick={validateAndProceed} color="primary" loading={isLoading} fullWidth>
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Availability;
