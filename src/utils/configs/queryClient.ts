import { QueryClientConfig } from '@tanstack/query-core';

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 1000 * 30, //30 seconds
      refetchInterval: false,
      refetchIntervalInBackground: false,
      suspense: false,
      staleTime: 1000 * 30,
    },
    mutations: {
      retry: 0,
    },
  },
};
