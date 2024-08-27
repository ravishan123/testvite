import React, { ReactNode } from 'react';

import { Grid } from '@ui/layout';
import { Button } from '@ui/button';
import { Typography } from '@ui/typography';

import ContentContainer from './contentContainer';

type ActionBannerProps = {
  image: string | ReactNode;
  title: string | ReactNode;
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  description: string | React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  verticalSize?: [number, number, number, number];
  horizontalSize?: [number, number, number, number];
  imageWidth?: number;
  imageHeight?: number;
  action?: {
    text: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined';
    color?: 'primary' | 'secondary';
  };
  hasTitleTopGutter?: boolean;
  alignContent?: 'center' | 'left' | 'right';
  imageOverlay?: ReactNode;
};

export default function ActionBanner({
  image,
  title,
  titleVariant = 'h5',
  description,
  direction = 'horizontal',
  verticalSize,
  horizontalSize,
  action,
  imageWidth = 122,
  imageHeight = 93,
  alignContent,
  imageOverlay,
  hasTitleTopGutter = true,
}: ActionBannerProps) {
  const isVertical = direction === 'vertical';
  return (
    <ContentContainer size={isVertical ? verticalSize || 'md' : horizontalSize || 'xl'}>
      <Grid
        container
        columnSpacing={{ xs: 0, lg: 1 }}
        rowSpacing={{ xs: 1, lg: 0 }}
        alignItems="center"
        flexDirection={isVertical ? 'column' : 'row'}
        sx={{
          justifyContent: { xs: 'center', sm: 'space-between' },
          textAlign: { xs: isVertical ? 'left' : 'center', sm: 'left' },
        }}
      >
        {image && (
          <Grid item width={imageWidth} display="flex" justifyContent="center" sx={{ position: 'relative', zIndex: 0 }}>
            {typeof image === 'string' ? (
              <img
                src={image}
                alt={'action banner image'}
                width={imageWidth}
                height={imageHeight}
                style={{ position: 'relative', zIndex: 1 }}
              />
            ) : (
              image
            )}
            {imageOverlay && imageOverlay}
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sm
          sx={{ ml: { sm: isVertical ? 0 : 4 }, textAlign: alignContent || 'left' }}
          mt={isVertical ? (hasTitleTopGutter ? 5 : 1) : 0}
          zIndex={1}
        >
          <Typography variant={titleVariant} gutterBottom>
            {title}
          </Typography>
          <Typography component="div" variant="body1-secondary">
            {description}
          </Typography>
        </Grid>
        {action && (
          <Grid
            xs={12}
            lg
            sx={{
              pl: { xs: 0, sm: isVertical ? 0 : 19, lg: 0 },
              textAlign: { xs: 'center', sm: 'left', lg: 'right' },
              width: isVertical ? '100%' : 'auto',
              mt: isVertical ? 3 : 0,
            }}
            flexShrink={0}
            item
          >
            <Button
              variant={action?.variant || 'outlined'}
              fullWidth={isVertical}
              sx={{ minHeight: 36, whiteSpace: 'nowrap' }}
              color={action?.color || 'secondary'}
              onClick={action.onClick}
            >
              {action.text}
            </Button>
          </Grid>
        )}
      </Grid>
    </ContentContainer>
  );
}
