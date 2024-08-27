import React from 'react';
import { ReactElement } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, createStore } from 'jotai';
import { useHydrateAtoms } from 'jotai/react/utils';
import { queryClientAtom } from 'jotai-tanstack-query';
import { Amplify } from 'aws-amplify';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@api/endpoints.ts';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import amplifyConfigs from '@utils/configs/amplify';
import { queryClientConfig } from '@utils/configs/queryClient';
import { listenToAuthEvents } from '@utils/functions/listenAuthEvents.ts';
import { store as reduxStore } from '@store/store.ts';
import { Grid, CssBaseline } from '@ui/layout';
import { ThemeProvider, theme } from '@ui/theme';
import { SnackbarProvider } from '@ui/snackBar';

import App from './App.tsx';
import AuthListener from './components/authListener/index.tsx';

interface IHydrateAtomsProps {
  children: ReactElement;
}

const queryClient = new QueryClient(queryClientConfig);

const HydrateAtoms = ({ children }: IHydrateAtomsProps) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
};

const store = createStore();

Amplify.configure(amplifyConfigs);
listenToAuthEvents();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={reduxStore}>
      <ThemeProvider theme={theme}>
        <Grid container xs={12} m={0} height="100%" item>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <HydrateAtoms>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <SnackbarProvider>
                    <AuthListener />
                    <App />
                  </SnackbarProvider>
                </LocalizationProvider>
              </HydrateAtoms>
            </Provider>
          </QueryClientProvider>
        </Grid>
      </ThemeProvider>
    </ReduxProvider>
  </React.StrictMode>
);

if (import.meta.env.VITE_USER_NODE_ENV === 'isolated' && import.meta.env.VITE_ENABLE_API_MOCKING === 'true') {
  import('./api/mocks/browser')
    .then(({ worker }) => {
      if (worker) {
        worker.start?.({ onUnhandledRequest: 'bypass' });
      }
    })
    .catch((error) => {
      console.error('Failed to load worker:', error);
    });
}
