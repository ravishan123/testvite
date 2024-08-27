import Carousel from 'react-material-ui-carousel';

import { homeBannerRotatorSlides } from '@utils/configs/homeBannerRotator';

import { Typography } from '@ui/typography';
import { styled, useTheme, useMediaQuery } from '@ui/theme';
import { Box } from '@ui/layout';
import { Button } from '@ui/button';

interface ImageCarouselItem {
  image: string;
  title: string;
  subTitle: string;
  description: string;
  isComingSoon: boolean;
}

interface ImageCarouselProps {
  items?: ImageCarouselItem[];
  duration?: number;
  autoPlay?: boolean;
  onAction?: () => void;
}

const Container = styled(Box)(({ theme }) => ({
  flexWrap: 'nowrap',
  flexGrow: 1,
  padding: 0,
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

const ComingSoonTag = styled('span')(({ theme }) => ({
  display: 'inline-block',
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.text.primary,
  padding: '2px 8px',
  borderRadius: 32,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: 2,
  lineHeight: '16px',
  textTransform: 'uppercase',
  marginTop: 16,
}));

const Slide: React.FC<ImageCarouselItem & { isDesktop: boolean }> = ({
  image,
  title,
  subTitle,
  description,
  isComingSoon,
  isDesktop,
}) => {
  const { palette } = useTheme();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <img src={image} alt={title} style={{ height: isDesktop ? 306 : 206 }} />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
          mt: { xs: '26px', md: '56px' },
          color: palette.common.white,
          textAlign: 'center',
          height: 200,
        }}
      >
        <Typography variant="h2" lineHeight="normal">
          {title}
        </Typography>
        <Box sx={{ width: { xs: '300px', md: '377px' } }}>
          <Typography variant="h4" lineHeight="24px" mt={0.5} fontWeight={500}>
            {subTitle}
          </Typography>
          <Typography variant="h4" fontWeight={300} lineHeight="24px" mt={2}>
            {description}
          </Typography>
          {isComingSoon && <ComingSoonTag>coming soon</ComingSoonTag>}
        </Box>
      </Box>
    </Box>
  );
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  items = homeBannerRotatorSlides,
  duration = 1000,
  autoPlay = false,
  onAction,
}) => {
  const { palette, breakpoints } = useTheme();
  const isDesktop = useMediaQuery(breakpoints.up('md'));

  return (
    <Container key={`rotator-${isDesktop ? 'desktop' : 'mobile'}`}>
      <Carousel
        duration={duration}
        autoPlay={autoPlay}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflowY: 'visible',
          overflowX: 'clip',
        }}
        indicatorIconButtonProps={{
          style: {
            opacity: 0.5,
          },
        }}
        activeIndicatorIconButtonProps={{
          style: {
            color: palette.common.white,
            opacity: 1,
          },
        }}
        indicatorContainerProps={{
          style: {
            marginTop: 26,
          },
        }}
        navButtonsAlwaysInvisible
      >
        {items.map((item, index) => (
          <Slide key={`slide-${index}`} {...item} isDesktop={isDesktop} />
        ))}
      </Carousel>
      {!isDesktop && window.location.pathname === '/signin' && (
        <Button variant="outlined" color="secondary" sx={{ width: 200, mt: 6 }} onClick={onAction}>
          Sign In
        </Button>
      )}
    </Container>
  );
};

export default ImageCarousel;
