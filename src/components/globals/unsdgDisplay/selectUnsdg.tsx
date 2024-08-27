import { useState } from 'react';

import { useTheme, styled } from '@ui/theme';
import { Typography } from '@ui/typography';
import { Grid } from '@ui/layout';
import InfoPopper from '@ui/infoPopper';
import { IconButton } from '@ui/button';
import { InfoOutlined } from '@ui/icons';

import ListUnsdg from '@globals/unsdgDisplay/listUnsdg';

type SelectUnsdgProps = {
  selection: string[];
  onChange: (selection: string[]) => void;
  hasMax?: boolean;
  limit?: number;
  subTitle?: string;
};

const List = styled('ul')(({ theme }) => ({
  paddingLeft: 2,
  color: theme.palette.grey[300],
  lineHeight: '17px',
  '& li': {
    marginBottom: 16,
    '&:last-child': {
      marginBottom: 0,
    },
  },
}));

function SelectUnsdg({ selection, onChange, hasMax = false, limit = 0, subTitle }: SelectUnsdgProps) {
  const { palette } = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const showTooltip = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl((elem) => (!elem ? e.currentTarget : null));
  };

  const onPopperClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Grid container direction="column">
        <Grid item xs={12} sx={{ pb: 2 }}>
          <Typography component="span" variant="h5">
            United Nations Sustainable Development Goals
            <IconButton onClick={showTooltip} sx={{ ml: 1, p: 0, color: palette.grey[300] }}>
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Typography>
          <InfoPopper anchorEl={anchorEl} placement="top" onClose={onPopperClose} title="What are UNSDGs">
            <List>
              In 2015, global goals, or Sustainable Development Goals (SDGs), were adopted by the United Nations to
              support collective action to end poverty, protect the planet, and ensure that by 2030 all people enjoy
              peace and prosperity.
            </List>
          </InfoPopper>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
            }}
          >
            {subTitle || 'You can select multiple goals.'}
          </Typography>
        </Grid>
        <ListUnsdg
          spacing={1}
          selected={selection}
          tileSize={84}
          onChange={onChange}
          selectable
          isShowSelectAll={false}
          hasMax={hasMax}
          limit={limit}
        />
      </Grid>
    </>
  );
}

export default SelectUnsdg;
