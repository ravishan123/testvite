import { CustomCognitoUser, getAuthenticatedUser } from '@api/Auth/auth';
import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import { Storage } from 'aws-amplify';

import { RootState } from '@store/store';

export interface UserState {
  userData: {
    data: CustomCognitoUser | null;
    isLoading: boolean;
    status: ActionStatus;
    error?: string;
  };
  userProfileImage: {
    url: string | null;
    isLoading: boolean;
    status: ActionStatus;
    error?: string;
  };
}

enum ActionStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

export const getLoggedInUser = createAsyncThunk<CustomCognitoUser | null, void>(
  'user/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAuthenticatedUser();
      return { attributes: response?.attributes };
    } catch (error) {
      return rejectWithValue((error as Error)?.message);
    }
  }
);

export const getUserProfileImage = createAsyncThunk<string, void>(
  'userProfileImage/get',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = state.currentUser?.userData?.data?.attributes.sub;

      if (userId) {
        const response = await Storage.get(`${userId}`);
        return response;
      }

      return rejectWithValue('User ID not found');
    } catch (error) {
      return rejectWithValue((error as Error)?.message);
    }
  }
);

const initialState: UserState = {
  userData: {
    data: null,
    isLoading: false,
    status: ActionStatus.IDLE,
  },
  userProfileImage: {
    url: null,
    isLoading: false,
    status: ActionStatus.IDLE,
  },
};

const userSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getLoggedInUser.pending, (state) => {
      // state.userData.data = null;
      state.userData.isLoading = true;
      state.userData.status = ActionStatus.PENDING;
      state.userData.error = undefined;
    });
    builder.addCase(getLoggedInUser.fulfilled, (state, { payload }) => {
      if (payload?.attributes) {
        state.userData.data = { attributes: payload?.attributes };
      }

      state.userData.isLoading = false;
      state.userData.status = ActionStatus.FULFILLED;
    });
    builder.addCase(getLoggedInUser.rejected, (state, { payload }) => {
      state.userData.data = null;
      state.userData.isLoading = false;
      state.userData.status = ActionStatus.REJECTED;
      state.userData.error = payload as string;
    });
    builder.addCase(getUserProfileImage.pending, (state) => {
      state.userProfileImage.url = null;
      state.userProfileImage.isLoading = true;
      state.userProfileImage.status = ActionStatus.PENDING;
      state.userProfileImage.error = undefined;
    });
    builder.addCase(getUserProfileImage.fulfilled, (state, { payload }) => {
      if (payload) {
        state.userProfileImage.url = payload;
      }

      state.userProfileImage.isLoading = false;
      state.userProfileImage.status = ActionStatus.FULFILLED;
    });
    builder.addCase(getUserProfileImage.rejected, (state, { payload }) => {
      state.userProfileImage.url = null;
      state.userProfileImage.isLoading = false;
      state.userProfileImage.status = ActionStatus.REJECTED;
      state.userProfileImage.error = payload as string;
    });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;

export const selectUser = createSelector(
  (state: RootState) => state.currentUser.userData,
  (userData) => userData
);

export const selectUserProfileImage = createSelector(
  (state: RootState) => state.currentUser.userProfileImage,
  (userProfileImage) => userProfileImage
);
