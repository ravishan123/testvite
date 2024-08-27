import { configureStore } from '@reduxjs/toolkit';

import userSliceReducer from './slices/user/user.slice';
import { homeStatsApi, profileApi } from './slices/profile/profile.slice';
import { organizationApiSlice } from './slices/organization/organization.slice';
import { settingsApiSlice } from './slices/settings/settings.slice';
import { volunteerApiSlice } from './slices/volunteer/volunteer.slice';
import { preferenceApiSlice } from './slices/preference/preference.slice';
import { supporterApiSlice } from './slices/supporters/supporters.slice';

export const store = configureStore({
  reducer: {
    currentUser: userSliceReducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [homeStatsApi.reducerPath]: homeStatsApi.reducer,
    [organizationApiSlice.reducerPath]: organizationApiSlice.reducer,
    [settingsApiSlice.reducerPath]: settingsApiSlice.reducer,
    [volunteerApiSlice.reducerPath]: volunteerApiSlice.reducer,
    [preferenceApiSlice.reducerPath]: preferenceApiSlice.reducer,
    [supporterApiSlice.reducerPath]: supporterApiSlice.reducer,
  },

  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      homeStatsApi.middleware,
      profileApi.middleware,
      organizationApiSlice.middleware,
      settingsApiSlice.middleware,
      volunteerApiSlice.middleware,
      preferenceApiSlice.middleware,
      supporterApiSlice.middleware
    ),
});

// setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
// What happens here is that we are inferring the type of the state
// from the store itself. This is useful because it allows us to use the
// type of the state in our components without having to manually define it.
// More info: https://redux-toolkit.js.org/tutorials/typescript#project-setup
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
