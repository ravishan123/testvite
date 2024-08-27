import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { ComponentType } from 'react';

type RouteData = {
  label?: string;
  roles?: unknown[]; // TODO: roles are not yet implemented. Assign an appropriate type when it available
  index?: boolean;
  path?: string;
  skipLeftNav?: boolean;
  parent?: string;
  key?: string;
  defaultPath?: string;
  getRoute?(route: string): string;
};

type LayoutOutletProps = { childRouteInfo: Record<string, PageRoute | LayoutOutlet> };
type PageRouteProps = { routeInfo: PageRoute };

type LayoutOutlet = RouteData & {
  Layout: ComponentType<LayoutOutletProps>;
  children: Record<string, PageRoute | LayoutOutlet>;
};

type PageRoute = RouteData & {
  Component?: ComponentType<PageRouteProps>;
  children?: Record<string, LayoutOutlet>;
  Icon?: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>> & {
    muiName: string;
  };
  description?: string;
  isShowBackButton?: boolean;
};

export type { RouteData, LayoutOutlet, PageRoute, LayoutOutletProps, PageRouteProps };
