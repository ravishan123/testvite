import { ENVIRONMENTS } from '@constants/environments';
import { ApiName } from '@utils/types/endpoints.type';

type ApiConfig = {
  [key in ENVIRONMENTS]?: {
    id: string;
    paths: ResourceConfig;
  };
};

type ApiPath = `/${string}` | string;

type Resource = Partial<{
  [key in ApiName]: ApiPath;
}>;

type ResourceConfig =
  | string
  | {
      mainPath: ApiPath;
      subPaths?: Resource;
    };

export class Api {
  static endpoints: Partial<Record<ApiName, Resource>> = {};

  _env: ENVIRONMENTS = ENVIRONMENTS.DEV;
  _domains = {
    [ENVIRONMENTS.ISOLATED]: '',
    [ENVIRONMENTS.DEV]: '',
    [ENVIRONMENTS.NEXT]: '',
    [ENVIRONMENTS.PROD]: '',
  };
  _useDomain = false;

  constructor() {
    this._env = import.meta.env.VITE_USER_NODE_ENV as ENVIRONMENTS;
    const publicApiURL = import.meta.env.VITE_API_PUBLIC_URL as string;
    const devApiURL = import.meta.env.VITE_API_DEV_URL as string;
    this._useDomain = (import.meta.env.VITE_API_USE_DOMAIN as string) === 'true';

    this._domains[this._env] = this._useDomain ? publicApiURL : devApiURL;
  }

  private createEndpointPaths = (
    apiString: string,
    devPaths: ResourceConfig,
    publicPaths: ResourceConfig
  ): Resource => {
    const apiEndpoints: Resource = {};
    let subPaths: Resource = { root: '' };
    let mainPath = '';

    if (typeof devPaths === 'object' && devPaths.subPaths) {
      subPaths = { ...subPaths, ...devPaths.subPaths };
    } else if (typeof publicPaths === 'object' && publicPaths.subPaths) {
      subPaths = { ...subPaths, ...publicPaths.subPaths };
    }

    if (typeof devPaths === 'object' && devPaths.mainPath) {
      mainPath = devPaths.mainPath;
    } else if (typeof publicPaths === 'object' && publicPaths.mainPath) {
      mainPath = publicPaths.mainPath;
    } else if (typeof publicPaths === 'string' || typeof devPaths === 'string') {
      mainPath = (publicPaths || devPaths) as string;
    }

    Object.entries(subPaths).forEach(([key, value]) => {
      apiEndpoints[key as ApiName] = `${apiString}${mainPath}${value}`;
    });

    return apiEndpoints;
  };

  public addEndPoint(name: ApiName, apiConfig: Partial<ApiConfig> | null, path: ResourceConfig) {
    let api = '';
    const apiEnvConfig = apiConfig ? apiConfig[this._env] : null;
    const isExternal = /^http[s]:\/\//.test(path as string);

    if (!this._useDomain && apiEnvConfig?.id) {
      api = `https://${apiEnvConfig?.id || ''}.${this._domains[this._env]}`;
    } else {
      api = `https://${this._domains[this._env]}`;
    }

    if (name) {
      Api.endpoints[name] = {
        ...this.createEndpointPaths(!isExternal ? api : '', apiEnvConfig?.paths || '', path),
      };
    }
  }

  static getRelativePath(name: ApiName, path: string) {
    return path.replace(Api.endpoints[name]?.root || '', '');
  }
}
