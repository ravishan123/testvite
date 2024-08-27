import { styled } from '@mui/material/styles';
import { Step, StepConnector, StepLabel } from '@mui/material';

export const CustomConnector = styled(StepConnector)(({ theme }) => ({
  '&.MuiStepConnector-root': {
    '& .MuiStepConnector-line': {
      borderWidth: '2px',
      borderColor: theme.palette.grey['200'],
      opacity: 0.5,
    },
  },
  '&.Mui-active': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.success.main,
    },
  },
  '&.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.success.main,
    },
  },
}));

export const CustomStep = styled(Step)(() => ({
  '& .MuiStepLabel-iconContainer': {
    paddingRight: 0,
  },
  '& .MuiSvgIcon-root': {
    opacity: 1,
  },
}));

export const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  flexDirection: 'column',
  color: 'inherit !important',
  '& .MuiStepLabel-label': {
    paddingTop: theme.spacing(0.6),
  },

  '& .Mui-active, & .Mui-completed': {
    color: `${theme.palette.success.main}!important`,
  },
}));
