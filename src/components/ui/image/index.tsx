import { ImgHTMLAttributes, forwardRef, useEffect, useState } from 'react';
import { useTheme } from '../theme';
import { Box, BoxProps } from '../layout';
import { Avatar } from '../avatar';
import { CircularProgress } from '../circularProgress';

/**
 * Props for the Image component.
 * @typedef {Object} ImageProps
 * @property {string | undefined} src - The source URL of the image.
 * @property {string} alt - The alternative text for the image.
 * @property {number | string | undefined} [width] - The width of the image.
 * @property {number | string | undefined} [height] - The height of the image.
 * @property {() => void} [onError] - Callback function to be executed when the image fails to load.
 * @property {() => void} [onLoad] - Callback function to be executed when the image is successfully loaded.
 * @property {boolean} [isAvatar] - Whether the image is an avatar or not.
 * @property {string} [defaultImageSrc] - The source URL of the default image to be displayed if the image fails to load.
 * @property {React.ReactNode | string} [children] - The content to be displayed inside the image container.
 * @property {'circular' | 'rounded' | 'square'} [shape] - The shape of the image.
 * @property {number | string} [borderRadius] - The border radius of the image.
 * @property {string} [backgroundColor] - The background color of the image container.
 * @property {string} [backgroundColorOnError] - The background color of the image container when the image fails to load.
 * @property {ImgHTMLAttributes<HTMLImageElement>} [imageProps] - Additional props to be passed to the image element.
 * @property {boolean} [hasBorder] - Whether the image container has a border or not.
 */
type ImageProps = Partial<BoxProps> & {
  src: string | undefined;
  alt: string;
  width?: number | string;
  height?: number | string;
  onError?: () => void;
  onLoad?: () => void;
  isAvatar?: boolean;
  defaultImageSrc?: string;
  children?: React.ReactNode | string;
  shape?: 'circular' | 'rounded' | 'square';
  borderRadius?: number | string;
  backgroundColor?: string;
  color?: string;
  backgroundColorOnError?: string;
  imageProps?: ImgHTMLAttributes<HTMLImageElement>;
  hasBorder?: boolean;
};

const OrgIcon = '/images/OrgIcon.png';

export default forwardRef(function Image(
  {
    src = '',
    alt = '',
    width = 'auto',
    height = 'auto',
    onError,
    onLoad,
    isAvatar = false,
    shape = 'circular',
    borderRadius,
    defaultImageSrc = '/images/AvatarIcon.png',
    children,
    backgroundColor = 'grey.100',
    color = 'common.white',
    backgroundColorOnError = 'grey.100',
    sx,
    imageProps,
    hasBorder = false,
    ...props
  }: ImageProps,
  ref
) {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(!src || false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');

  useEffect(() => {
    if (isError) {
      setIsLoading(false);
    }
  }, [isError]);

  useEffect(() => {
    if (isLoading) {
      setIsError(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (currentSrc !== src) {
      setIsLoading(true);
      setIsSuccess(false);
      setCurrentSrc(src || '');
    }
  }, [src]);

  const handleOnLoad = () => {
    setIsLoading(false);
    setIsSuccess(true);
    setIsError(false);

    if (onLoad) {
      onLoad();
    }
  };

  const handleOnError = () => {
    setIsError(true);

    if (onError) {
      onError();
    }
  };

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: !isError ? backgroundColor : backgroundColorOnError,
        color,
        borderRadius: shape === 'circular' ? '50%' : shape === 'square' ? '0' : borderRadius || '8px',
        overflow: 'hidden',
        lineHeight: 'initial',
        border: hasBorder ? `1px solid ${theme.palette.grey['100']}` : '0',
        ...(!isSuccess && !Number.isInteger(width) ? { width: 40, height: 40 } : { width, height }),
        flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      {isAvatar ? (
        <Avatar
          src={currentSrc}
          alt={alt}
          variant={shape}
          sx={{ width: '100%', height: '100%', display: !isError && src ? 'block' : 'none' }}
          imgProps={{
            ...imageProps,
            style: {
              textIndent: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              objectFit: 'contain',
              ...imageProps?.style,
            },
            onError: handleOnError,
            onLoad: handleOnLoad,
          }}
        />
      ) : !isError ? (
        <img
          {...imageProps}
          style={{
            textIndent: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            display: !isError && src ? 'block' : 'none',
            objectFit: 'contain',

            ...imageProps?.style,
          }}
          src={currentSrc}
          alt={alt}
          onError={handleOnError}
          onLoad={handleOnLoad}
        />
      ) : (
        ''
      )}

      {isLoading ? (
        <CircularProgress sx={{ position: 'absolute', top: 'auto', left: 'auto' }} size="60%" color="inherit" />
      ) : (
        ''
      )}
      {(isError || !src) && !children ? (
        <img
          src={shape === 'rounded' ? OrgIcon : defaultImageSrc}
          style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}
          alt={alt}
        />
      ) : (
        ''
      )}
      {(isError || !src) && children ? (
        <Box
          display="inline-flex"
          sx={{ color: typeof children === 'string' ? theme.palette.common.white : theme.palette.grey['200'] }}
        >
          {children}
        </Box>
      ) : (
        ''
      )}
    </Box>
  );
});
