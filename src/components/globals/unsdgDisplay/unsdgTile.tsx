import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@ui/theme';

import { IconButton } from '@ui/button';
import { UnselectedIcon } from '@ui/icons/UnselectedIcon';
import { SelectedIcon } from '@ui/icons/SelectedIcon';
import { Tooltip } from '@ui/toolTip';
import Sprite from '@ui/icons/sdg_sprite_opt.png';

interface UnsdgTitleProps {
  index: number;
  id: string;
  selected: boolean;
  selectable?: boolean | undefined;
  label?: string;
  tileSize?: number;
  disabled?: boolean;
  onChange?: (index: string) => void;
}

interface StyledBoxProps {
  index: number;
  selected: boolean;
  tileSize: number;
}

const StyledBox = styled(Box, {
  shouldForwardProp: (props) => !['index', 'tileSize'].includes(String(props)),
})<StyledBoxProps>(({ selected, index, tileSize }) => ({
  transform: selected
    ? `translate(-${tileSize * (index - 1)}px, 0)`
    : `translate(-${tileSize * (index - 1)}px, -${tileSize}px)`,
  position: 'absolute',
  top: 0,
  left: 0,
}));

const StyledButton = styled(IconButton, {
  shouldForwardProp: (props) => !['tileSize', 'selectable'].includes(props as string),
})<{
  tileSize: number;
  selectable: boolean;
}>(({ tileSize, selectable }) => ({
  width: tileSize,
  height: tileSize,
  overflow: 'hidden',
  borderRadius: 4,
  padding: 0,
  position: 'relative',
  ...(!selectable && {
    cursor: 'default',
  }),
}));

const StyleContainer = styled('div')(() => ({
  position: 'absolute',
  height: 25,
  width: 25,
  bottom: 8,
  right: 8,
}));

const UnsdgTitle: React.FC<UnsdgTitleProps> = ({
  index,
  id,
  tileSize = 108,
  selected,
  onChange = () => false,
  label,
  selectable = undefined,
  disabled = false,
}) => {
  return (
    <Tooltip title={label} arrow>
      <StyledButton
        color="primary"
        tileSize={tileSize}
        disableRipple={!selectable}
        disabled={disabled}
        selectable={Boolean(selectable)}
        onClick={() => selectable && onChange(id)}
      >
        <StyledBox tileSize={tileSize} selected={selected} index={index}>
          <img height={tileSize * 2} src={Sprite} alt={label} />
        </StyledBox>
        {selectable ? <StyleContainer> {selected ? <SelectedIcon /> : <UnselectedIcon />}</StyleContainer> : ''}
      </StyledButton>
    </Tooltip>
  );
};

export default UnsdgTitle;
