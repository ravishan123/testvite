import { Color, SimplePaletteColorOptions } from '@mui/material';
import {
  createTheme,
  ThemeProvider,
  styled,
  ThemeOptions,
  useTheme,
  alpha,
  darken,
  PaletteOptions,
} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export type ResponsiveBreakPointKeys = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type FontWeightKeys = 'thin' | 'light' | 'normal' | 'bold' | 'semiBold' | 'black';

export type FontSize = {
  [key in ResponsiveBreakPointKeys]: number;
};

export type BorderRadius = {
  [key in ResponsiveBreakPointKeys]: number;
};

export type FontWeight = {
  [key in FontWeightKeys]: number;
};

const fontSize: FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

const fontWeight: FontWeight = {
  thin: 200,
  light: 300,
  normal: 400,
  semiBold: 500,
  bold: 600,
  black: 700,
};

const borderRadius: BorderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
};

interface DefaultPaletteOptions extends PaletteOptions {
  primary: SimplePaletteColorOptions & Partial<Color>;
  error: SimplePaletteColorOptions & Partial<Color>;
  success: SimplePaletteColorOptions & Partial<Color>;
}

const colors: DefaultPaletteOptions = {
  mode: 'light',

  primary: {
    main: '#374ea9',
    dark: '#2e3e8c',
    light: '#F4F7F9',
    200: '#F4F7FF',
    300: '#F9FAFF',
  },
  secondary: {
    main: '#F9FAFB',
    100: '#696FFF',
    200: '#F3F7F9',
  },
  error: {
    main: '#EF5D2F',
    100: '#fff7f5',
    200: '#FFEFEA',
    300: '#ffd2c7',
  },
  warning: {
    main: '#F5B31F',
    100: '#FFF5E6',
  },
  success: {
    main: '#39A937',
    100: '#00AC19',
    200: '#F0FFF0',
  },

  grey: {
    100: '#ECEEF3',
    200: '#B5B9C5',
    300: '#797D88',
    400: '#F4F7FF',
    500: '#F4F7F9',
  },
  background: {
    default: '#FFFFFF',
    chip: '#F2F7F9',
  },
  common: {
    white: '#ffffff',
    black: '#000000',
  },
  text: {
    primary: '#33363F',
    secondary: '#797D88',
    disabled: '#B5B9C5',
  },
};

const shapeOptions: ThemeOptions['shape'] = {
  borderRadius: 8,
};

const typographyOptions: ThemeOptions['typography'] = {
  fontFamily: 'Inter',
  h6: {
    fontSize: '19px',
    fontWeight: 600,
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
  },
};

const componentsOptions: ThemeOptions['components'] = {
  MuiLoadingButton: {
    defaultProps: {
      variant: 'contained',
    },
    variants: [
      {
        props: { variant: 'text' },
        style: {
          '&.Mui-disabled': {
            color: colors.common?.white,
            borderColor: 'inherit',
            backgroundColor: 'inherit',
          },
          '&.MuiLoadingButton-loading.Mui-disabled': {
            borderColor: colors.primary.main,
            color: colors.common?.white,

            '& > .MuiSvgIcon-root': {
              display: 'none',
            },
          },
          '& .MuiLoadingButton-loadingIndicator': {
            color: colors.primary.main,
          },
        },
      },
      {
        props: { variant: 'contained' },
        style: {
          '&.Mui-disabled': {
            color: colors.common?.white,
            borderColor: colors.grey?.[100],
            backgroundColor: colors.grey?.[100],
          },
          '&.MuiLoadingButton-loading.Mui-disabled': {
            color: colors.primary.main,
            borderColor: colors.primary.main,
            backgroundColor: colors.primary.main,
          },
          '& .MuiLoadingButton-loadingIndicator': {
            color: colors.common?.white,
          },
        },
      },
      {
        props: { variant: 'contained-secondary', color: 'error' },
        style: {
          '&.Mui-disabled': {
            color: colors.common?.white,
            borderColor: colors.grey?.[100],
            backgroundColor: colors.grey?.[100],
          },
          '&.MuiLoadingButton-loading.Mui-disabled': {
            color: colors.error.main,
            borderColor: colors.error.main,
            backgroundColor: colors.error.main,
          },
          '& .MuiLoadingButton-loadingIndicator': {
            color: colors.common?.white,
          },
        },
      },
      {
        props: { variant: 'contained-secondary', color: 'primary' },
        style: {
          '&.Mui-disabled': {
            color: colors.common?.white,
            borderColor: colors.grey?.[100],
            backgroundColor: colors.grey?.[100],
          },
          '&.MuiLoadingButton-loading.Mui-disabled': {
            color: colors.primary[200],
            borderColor: colors.primary[200],
            backgroundColor: colors.primary[200],
          },
          '& .MuiLoadingButton-loadingIndicator': {
            color: colors.primary.main,
          },
        },
      },
    ],
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        boxShadow: '0px 2px 3px 0px rgba(0, 0, 0, 0.10)',
      },
      standardError: {
        border: `1px solid ${colors.error.main}`,
        color: colors.error.main,
      },
      standardSuccess: {
        border: `1px solid ${colors.success.main}`,
        color: colors.success.main,
        background: colors.success[200],
      },
      standardWarning: {
        fontSize: '12px',
        boxShadow: 'none',
        fontWeight: 400,
      },
    },
  },

  MuiTypography: {
    variants: [
      {
        props: { variant: 'title' },
        style: {
          fontSize: '40px',
          fontWeight: 700,
          lineHeight: 'normal',
          margin: '0 0 8px 0',
        },
      },
      {
        props: { variant: 'h1' },
        style: {
          fontSize: '32px',
          fontWeight: 700,
          lineHeight: 'normal',
        },
      },
      {
        props: { variant: 'h2' },
        style: {
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 'normal',
        },
      },
      {
        props: { variant: 'h3' },
        style: {
          fontSize: '19px',
          fontWeight: 600,
          lineHeight: 'normal',
        },
      },
      {
        props: { variant: 'h4' },
        style: {
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: 'normal',
          '& > span': {
            marginRight: 8,
            display: 'inline-block',

            '&.no-weight': {
              fontWeight: 'normal',
            },
          },
        },
      },
      {
        props: { variant: 'h5' },
        style: {
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: 'normal',
        },
      },
      {
        props: { variant: 'h5-secondary' },
        style: {
          color: colors.text?.secondary,
        },
      },
      {
        props: { variant: 'h6' },
        style: {
          fontSize: '12px',
          fontWeight: 600,
          lineHeight: 'normal',
        },
      },
      {
        props: { variant: 'body1' },
        style: {
          fontWeight: 400,
          fontSize: '12px',
          color: colors.text?.primary,
          lineHeight: 'normal',
        },
      },
      {
        props: { variant: 'body2' },
        style: {
          fontWeight: 400,
          fontSize: '19px',
          color: colors.text?.primary,
          lineHeight: 'normal',
        },
      },
      {
        props: { variant: 'body3' },
        style: {
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '24px',
          display: 'inline-block',
        },
      },
      {
        props: { variant: 'body4' },
        style: {
          fontSize: '14px',
          fontWeight: 400,
        },
      },
      {
        props: { variant: 'body1-disabled' },
        style: {
          fontWeight: 400,
          fontSize: '12px',
          color: colors.text?.disabled,
          lineHeight: 'normal',
        },
      },
      {
        props: { variant: 'body1-secondary' },
        style: {
          fontWeight: 400,
          fontSize: '12px',
          color: colors.text?.secondary,
          lineHeight: 'normal',
          display: 'block',
        },
      },
      {
        props: { variant: 'helper-text' },
        style: {
          fontWeight: fontWeight.normal,
          fontSize: fontSize.sm,
          color: colors.text?.secondary,
        },
      },
    ],
  },
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          height: '45px',
        },
        '& .css-1xivo00-MuiInputBase-input-MuiOutlinedInput-input': {
          height: '5px',
        },
        '& .MuiAutocomplete-input': {
          height: '5px',
        },
        '& .Mui-disabled': {
          backgroundColor: colors.grey?.[500],
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: `${colors.grey?.[500] || ''}!important`,
          },
        },
      },
    },
  },
  MuiPagination: {
    styleOverrides: {
      root: {
        fontSize: '12px',
        fontWeight: 200,
        backgroundColor: '#ffff !important',

        '& .Mui-selected': {
          fontSize: '12px',
          fontWeight: 700,
          color: '#374ea9',

          backgroundColor: '#ffff !important',
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: '5px',
        '&:hover': {
          border: `${colors.primary.main} !important`,
        },
        '&:active': {
          border: 'none !important',
        },
        '&:focus': {
          border: 'none !important',
        },
        '& .Mui-disabled': {
          backgroundColor: colors.grey?.[500],
          color: colors.grey?.[300],
          '-webkit-text-fill-color': colors.grey?.[300],
          '& ~ .MuiOutlinedInput-notchedOutline': {
            borderColor: `${colors.grey?.[500] || ''}!important`,
          },
        },
        marginTop: '8px',
      },
      input: {
        '&::placeholder': {
          fontSize: 'small',
        },
        '&:hover ~ .MuiOutlinedInput-notchedOutline': {
          borderColor: `${colors.primary.main}!important`,
        },
        padding: '11px 11px!important',
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      sizeMedium: {
        marginLeft: 0,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      notchedOutline: {
        transition: '.3s border-color',
        borderColor: colors.grey?.[200],
        '&:hover': {
          borderColor: `${colors.primary.main}!important`,
        },
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        color: colors.text?.disabled,
        '&:hover': {
          borderColor: `${colors.primary.main} !important`,
        },
      },
    },
  },
  MuiCssBaseline: {
    styleOverrides: `
      html {
        height: 100%;
      }

      body {
        height: 100%;
      }

      #root {
        height: 100%;
      }
    `,
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        '&.Mui-checked': {
          color: colors.success.main,
        },
        '&:hover': {
          borderColor: `${colors.primary.main} !important`,
        },
      },
    },
  },
  MuiButton: {
    defaultProps: {
      variant: 'contained',
    },
    styleOverrides: {
      sizeMedium: {
        minHeight: '44px',
        ':disabled': {
          color: colors.common?.white,
          borderColor: colors.grey?.[100],
          backgroundColor: colors.grey?.[100],
        },
      },
    },
    variants: [
      {
        props: { variant: 'contained', color: 'primary' },
        style: {
          color: colors.common?.white,
          backgroundColor: colors.primary.main,
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
        },
      },
      {
        props: { variant: 'outlined', color: 'secondary' },
        style: {
          color: colors.primary.main,
          backgroundColor: colors.primary[200],
          borderRadius: '8px',
          border: '1px solid transparent',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: colors.common?.white,
            border: `1px solid ${colors.primary?.main || ''}`,
          },
        },
      },
      {
        props: { variant: 'outlined', color: 'primary' },
        style: {
          color: colors.primary.main,
          backgroundColor: colors.primary[200],
          borderRadius: '8px',
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: colors.primary[200],
          },
        },
      },
      {
        props: { variant: 'text' },
        style: {
          color: colors.text?.primary,
          borderRadius: '8px',
          border: `1px solid var(--gray-3, ${colors.grey?.[200] || ''})`,
          '& .MuiTouchRipple-root .MuiTouchRipple-child': {
            backgroundColor: colors.primary.main,
          },
        },
      },
      {
        props: { variant: 'contained', size: 'medium-compact' },
        style: {
          minHeight: 36,
        },
      },
      {
        props: { variant: 'outlined', size: 'medium-compact' },
        style: {
          minHeight: 36,
        },
      },
      {
        props: { variant: 'contained-secondary' },
        style: {
          minHeight: 52,
          fontSize: fontSize.sm,
          backgroundColor: colors.grey?.[100],
          '& .MuiSvgIcon-root': {
            width: 20,
            height: 20,
            margin: '0!important',
          },
          '& .MuiTouchRipple-root .MuiTouchRipple-child': {
            backgroundColor: colors.grey?.[200],
          },
        },
      },
      {
        props: { variant: 'contained-secondary', size: 'medium-compact' },
        style: {
          minHeight: 33,
          fontSize: 12,
          backgroundColor: colors.grey?.[100],
          '& .MuiSvgIcon-root': {
            width: 20,
            height: 20,
            margin: '0!important',
          },
          '& .MuiTouchRipple-root .MuiTouchRipple-child': {
            backgroundColor: colors.grey?.[200],
          },
        },
      },
      {
        props: { variant: 'contained-secondary', color: 'error' },
        style: {
          minHeight: 52,
          fontSize: fontSize.sm,
          backgroundColor: colors.error[200],
          color: colors.error.main,
          '&:hover': {
            backgroundColor: colors.error[100],
          },
          '& .MuiSvgIcon-root': {
            width: 20,
            height: 20,
            margin: '0!important',
          },
          '& .MuiTouchRipple-root .MuiTouchRipple-child': {
            backgroundColor: colors.error?.[300],
          },
        },
      },
      {
        props: { variant: 'contained-secondary', color: 'secondary' },
        style: {
          minHeight: 52,
          fontSize: fontSize.sm,
          backgroundColor: colors.primary[200],
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: colors.primary[300],
          },
          '& .MuiSvgIcon-root': {
            width: 20,
            height: 20,
            margin: '0!important',
          },
          '& .MuiTouchRipple-root .MuiTouchRipple-child': {
            backgroundColor: colors.grey?.[300],
          },
        },
      },
      {
        props: { variant: 'custom' },
        style: {
          minHeight: 33,
          fontWeight: fontWeight.normal,
          color: colors.primary.main,
          justifyContent: 'space-between',
          '& .MuiTouchRipple-root .MuiTouchRipple-child': {
            backgroundColor: colors.grey?.[200],
          },
        },
      },
      {
        props: { variant: 'custom-compact' },
        style: {
          minHeight: 33,
          padding: 0,
          '&:hover': {
            backgroundColor: 'transparent',
          },
          '& .MuiTouchRipple-root .MuiTouchRipple-child': {
            backgroundColor: 'transparent',
          },
        },
      },
      {
        props: { variant: 'custom-compact', color: 'primary' },
        style: {
          minHeight: 33,
          color: colors.primary.main,
          fontWeight: fontWeight.normal,
        },
      },
      {
        props: { variant: 'custom', color: 'secondary' },
        style: {
          color: colors.primary.main,
          backgroundColor: colors.common?.white,
          borderRadius: '8px',
          fontWeight: fontWeight.bold,
          border: '1px solid transparent',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: colors.common?.white,
            border: `1px solid ${colors.primary?.main || ''}`,
          },
        },
      },
    ],
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        color: colors.text?.primary,
      },
    },
    variants: [
      {
        props: { color: 'primary' },
        style: {
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: colors.primary.light,
          },
        },
      },
    ],
  },
  MuiFormControlLabel: {
    styleOverrides: {
      label: {
        paddingLeft: 8,
        '.Mui-error &': {
          color: colors.error.main,
        },
      },
    },
  },
  MuiSkeleton: {
    defaultProps: {
      animation: 'wave',
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        color: 'inherit',
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        color: colors.text?.primary,
        fontWeight: fontWeight.bold,
        fontSize: fontSize.sm,
      },
    },
  },
  MuiChip: {
    variants: [
      {
        props: { variant: 'outlined', color: 'primary' },
        style: {
          color: colors.primary.main,
          backgroundColor: colors.primary[200],
          borderColor: colors.primary.main,
          padding: '12px 16px',
          height: 40,
          borderRadius: 20,
          fontSize: fontSize.sm,
          textTransform: 'capitalize',
          '& .MuiChip-label': {
            paddingLeft: 0,
            paddingRight: 16,
          },
          '& .MuiSvgIcon-root': {
            fontSize: 22,
            margin: 0,
            color: colors.grey?.[300],
          },
        },
      },
    ],
  },
  MuiTextField: {
    variants: [
      {
        props: { variant: 'outlined', multiline: true },
        style: {
          '& .MuiInputBase-root': {
            padding: 14,
          },
          '& textarea': {
            padding: '0!important',
          },
        },
      },
    ],
  },
};

export const themeOptions: ThemeOptions = {
  palette: colors,
  shape: shapeOptions,
  typography: typographyOptions,
  components: componentsOptions,
  fontSize,
  fontWeight,
  borderRadius,
};

const theme = createTheme(themeOptions);

export { createTheme, ThemeProvider, styled, theme, useTheme, alpha, useMediaQuery, darken };
