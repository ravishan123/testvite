import { useState } from 'react';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

import { Typography } from '@ui/typography';
import { Box } from '@ui/layout';
import { styled } from '@ui/theme';
import InfoPopper from '@ui/infoPopper';
import { IconButton } from '@ui/button';

const List = styled('ul')(({ theme }) => ({
  paddingLeft: 16,
  color: theme.palette.grey[300],
  '& li': {
    marginBottom: 16,
    '&:last-child': {
      marginBottom: 0,
    },
  },
}));

export default function AgeAndGenderInfo() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const showTooltip = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl((elem) => (!elem ? (e.currentTarget as HTMLButtonElement) : null));
  };

  const onPopperClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center">
      <Typography pr={1}>Why age and gender? </Typography>
      <IconButton onClick={showTooltip} sx={{ p: 0 }}>
        <InfoOutlined fontSize="medium" />
      </IconButton>
      <InfoPopper anchorEl={anchorEl} placement="top" onClose={onPopperClose} title="Why age & gender">
        <List>
          <li>The minimum age requirement to use gudppl platform is 13 years.</li>

          <li>
            Due to legal, health and safety reasons some volunteer activities are available to specific age groups and
            genders. (e.g. Volunteer driver above 18 years, women caretakers for a women’s refuge, etc.)
          </li>

          <li>
            Your age and gender will remain private. <br />
            An organization might ask your age and/or gender when joining their volunteer group or activity. Then, you
            can choose to share or not.
          </li>
        </List>
      </InfoPopper>
    </Box>
  );
}
