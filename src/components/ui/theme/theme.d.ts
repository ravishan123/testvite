import { CSSInterpolation } from '@mui/material/styles';
import { FontSize, FontWeight, BorderRadius } from './';

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title: true;
    body3: true;
    body4: true;
    'h5-secondary': true;
    'body1-disabled': true;
    'body1-secondary': true;
    'helper-text': true;
  }
}

declare module '@mui/material/FormHelperText' {
  interface FormHelperTextClasses {
    sizeMedium: CSSInterpolation;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    'contained-secondary': true;
    custom: true;
    'custom-compact': true;
  }

  interface ButtonPropsSizeOverrides {
    'medium-compact': true;
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    fontSize: FontSize;
    fontWeight: FontWeight;
    borderRadius: BorderRadius;
  }
  interface ThemeOptions {
    fontSize: FontSize;
    fontWeight: FontWeight;
    borderRadius: BorderRadius;
  }
  interface PaletteColor {
    100?: string;
    200?: string;
  }
  interface TypeBackground {
    chip: string;
  }
  interface TypeSuccess {
    100: string;
  }
  interface Components {
    MuiLoadingButton?: {
      variants?: {
        props: {
          variant: 'contained' | 'outlined' | 'text' | 'secondary' | 'contained-secondary';
          color?: 'primary' | 'secondary' | 'error';
        };
        style: CSSInterpolation;
      }[];
      styleOverrides?: {
        root?: CSSInterpolation;
      };
      defaultProps?: {
        variant: 'contained' | 'outlined' | 'text' | 'secondary';
        color?: 'primary' | 'secondary';
      };
    };
  }
}
