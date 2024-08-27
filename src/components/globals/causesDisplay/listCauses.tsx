import causes from '@utils/constants/causes.const';

import { Grid, Box } from '@ui/layout';
import { Tooltip } from '@ui/toolTip';
import { Skeleton } from '@ui/skeleton';
import { useTheme, styled } from '@ui/theme';
import { Typography } from '@ui/typography';

type CausesDisplayProps = {
  items: string[];
  tileSize?: number;
  spacing?: number;
  borderRadius?: number | string;
  invert?: boolean;
  isLoading?: boolean;
  withLabels?: boolean;
};

const IconContainer = styled(Box, {
  shouldForwardProp: (prop) => !['width', 'height', 'withLabels'].includes(prop as string),
})<{
  width: number;
  height: number;
  withLabels?: boolean;
}>(({ width, height, withLabels }) => ({
  width,
  height,
  position: 'relative',
  '& > svg': {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) ${withLabels ? '' : 'scale(0.56)'}`,
    '& > path': {
      fill: 'currentColor',
    },
  },
}));

export default function ListCauses({
  items,
  tileSize = 108,
  spacing = 1,
  isLoading = false,
  borderRadius = '4px',
  invert = false,
  withLabels = false,
}: CausesDisplayProps) {
  const theme = useTheme();

  return (
    <Grid container columnGap={spacing} rowGap={spacing}>
      {isLoading &&
        Array.from(Array(4).keys()).map((item) =>
          withLabels ? (
            <Box key={`causes-list${item}`}>
              <Skeleton variant="rounded" width={tileSize} height={tileSize} />
              <Skeleton variant="text" width={tileSize} height={20} />
            </Box>
          ) : (
            <Grid item key={`causes-list${item}`} display="inline-flex">
              <Skeleton variant="rounded" width={tileSize} height={tileSize} />
            </Grid>
          )
        )}
      {!isLoading &&
        items.map((item) => {
          const cause = causes[item];

          return cause ? (
            withLabels ? (
              <Box display="flex" alignItems="center" key={`causes-list${item}`}>
                <Box pr="12px">
                  <IconContainer
                    width={tileSize}
                    height={tileSize}
                    withLabels
                    sx={{
                      color: invert ? cause.color : theme.palette.common.white,
                    }}
                  >
                    {cause.Icon}
                  </IconContainer>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body4">{cause.label}</Typography>
                </Box>
              </Box>
            ) : (
              <Grid item key={`causes-list${item}`} display="inline-flex">
                <Tooltip title={cause.label} arrow>
                  <IconContainer
                    width={tileSize}
                    height={tileSize}
                    sx={{
                      backgroundColor: invert ? theme.palette.primary.light : cause.color,
                      color: invert ? cause.color : theme.palette.common.white,
                      borderRadius,
                    }}
                  >
                    {cause.Icon}
                  </IconContainer>
                </Tooltip>
              </Grid>
            )
          ) : (
            ''
          );
        })}
    </Grid>
  );
}
