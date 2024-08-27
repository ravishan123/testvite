import { useTheme } from '@ui/theme';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export type CustomStepIconProps = {
  active: boolean;
  completed: boolean;
};

export const CustomStepIcon = ({ active, completed }: CustomStepIconProps) => {
  const { palette } = useTheme();
  if (completed) {
    return <CheckCircleOutlineIcon sx={{ color: palette.success[100], opacity: 0.5 }} />;
  }

  if (active) {
    return <CheckCircleOutlineIcon sx={{ color: palette.success.main }} />;
  }

  return <RadioButtonUncheckedIcon sx={{ color: palette.grey[200] }} />;
};
