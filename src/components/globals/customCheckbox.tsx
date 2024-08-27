import { Box } from '@ui/layout';
import { styled } from '@ui/theme';
import { Typography } from '@ui/typography';
import { Checkbox, CheckboxProps } from '@ui/checkbox';

type CustomCheckboxProps = CheckboxProps & {
  label: string;
};

const StyledLabel = styled(Typography)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 8,
  padding: 16,
  marginBottom: 4,
  backgroundColor: theme.palette.primary[200],
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  outlinedCheckbox: {
    '&.Mui-checked': {
      '& .MuiSvgIcon-root': {
        fill: 'transparent',
        border: `2px solid ${theme.palette.primary.main}`,
      },
    },
  },
}));

export function CustomCheckbox({ label, ...rest }: CustomCheckboxProps) {
  return (
    <StyledContainer>
      <StyledCheckbox {...rest} />
      <StyledLabel variant="body3">{label}</StyledLabel>
    </StyledContainer>
  );
}
