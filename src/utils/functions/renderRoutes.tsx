import { Route } from 'react-router-dom';
import { LayoutOutlet, PageRoute, RouteData } from '@utils/types/router.type';

const renderRoute = (route: (PageRoute | LayoutOutlet) & { key: string }) => {
  if ('Layout' in route) {
    return renderLayoutOutlet(route);
  }

  if ('Component' in route) {
    const Component = route.Component;
    const { index, parent } = route;
    let parentPath = parent;

    if (index && parent) {
      const tempParent = parent.split('.');
      parentPath = tempParent.slice(0, tempParent.length - 1).join('.');
    }

    if (Component) {
      return (
        <Route
          key={`page-${route?.path || ''}-${route?.label || ''}`}
          {...(route?.index ? { index: route?.index } : { path: route.path })}
          index={route?.index || false}
          Component={() => <Component routeInfo={{ ...route, parent: parentPath, key: route.key }} />}
        />
      );
    }
  }
};

const renderLayoutOutlet = ({ path, parent, label, Layout, children, key }: LayoutOutlet & { key: string }) => {
  let parentPath = parent;

  if (!parent) {
    parentPath = key;
  } else {
    parentPath = `${parent}.${key}`;
  }

  return (
    <Route
      key={`layout-${path || ''}-${label || ''}`}
      path={path}
      Component={() => <Layout childRouteInfo={children} />}
    >
      {children &&
        Object.entries(children).map(([_key, childRoute]) =>
          renderRoute({ ...(childRoute as PageRoute), parent: parentPath, key: _key })
        )}
    </Route>
  );
};

const renderMainRoutes = (routes: { [key: string]: RouteData }) =>
  Object.entries(routes).map(([key, route]) => renderRoute({ ...(route as PageRoute | LayoutOutlet), key }));

export { renderRoute, renderLayoutOutlet, renderMainRoutes };
