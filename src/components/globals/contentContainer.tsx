import { ReactNode } from 'react';
import { Box, BoxProps } from '@ui/layout';
import { styled, ResponsiveBreakPointKeys } from '@ui/theme';

type ContentContainerProps = Partial<BoxProps> & {
  children: ReactNode | ReactNode[];
  size?: ResponsiveBreakPointKeys | [number, number, number, number];
  borderTopColor?: string;
};

const sizes: Record<string, [number, number, number, number]> = {
  sm: [2, 2, 2, 2],
  md: [4, 2, 3, 2],
  lg: [2, 4, 2, 4],
  xl: [5, 4, 5, 4],
};

/**
 * A styled container component that wraps content with padding and a white background.
 * @param size - The size of the container. Can be a string or an array of numbers representing padding values.
 * @returns A React component.
 */
const StyledBox = styled(Box, { shouldForwardProp: (props) => props != 'size' })<{
  size: ContentContainerProps['size'];
  borderTopColor?: ContentContainerProps['borderTopColor'];
}>(({ theme, size, borderTopColor }) => {
  const sizeProps = typeof size === 'string' ? sizes[size] : size;
  return {
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.palette.common.white,
    padding: Array.isArray(sizeProps) ? theme.spacing(...sizeProps) : sizes.md,
    width: '100%',
    borderTop: `4px solid ${borderTopColor || theme.palette.common.white}`,
  };
});

export default function ContentContainer({ children, size = 'xl', ...props }: ContentContainerProps) {
  return (
    <StyledBox size={size} {...props}>
      {children}
    </StyledBox>
  );
}
