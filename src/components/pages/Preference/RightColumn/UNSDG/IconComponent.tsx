import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@ui/theme';

import { IconButton } from '@ui/button';
import { UnselectedIcon } from '@ui/icons/UnselectedIcon';
import { SelectedIcon } from '@ui/icons/SelectedIcon';

import Sprite from '@ui/icons/sdg_sprite_opt.png';

interface IconComponentProps {
  index: number;
  selected: boolean;
  label: string;
  handleIconToggle: (index: number) => void;
}
interface StyledBoxProps {
  index: number;
  selected: boolean;
}

const StyledBox = styled(Box)(({ selected, index }: StyledBoxProps) => ({
  transform: selected ? `translate(-${108 * (index - 1)}px, 0)` : `translate(-${108 * (index - 1)}px, -108px)`,
  position: 'absolute',
  top: 0,
  left: 0,
}));

const StyledButton = styled(IconButton)(() => ({
  width: 108,
  height: 108,
  overflow: 'hidden',
  borderRadius: 0,
  padding: 0,
  position: 'relative',
}));

const StyleContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  height: 25,
  width: 25,
  bottom: 8,
  right: 8,
  color: theme.palette.primary.main,
}));

const IconComponent: React.FC<IconComponentProps> = ({ index, selected, handleIconToggle, label }) => {
  return (
    <>
      <StyledButton onClick={() => handleIconToggle(index)}>
        <StyledBox selected={selected} index={index}>
          <img src={Sprite} alt={label} />
        </StyledBox>
        <StyleContainer> {selected ? <SelectedIcon /> : <UnselectedIcon />}</StyleContainer>
      </StyledButton>
    </>
  );
};

export default IconComponent;
