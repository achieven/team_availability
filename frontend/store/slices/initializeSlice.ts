import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { getProfile } from './authSlice';

export enum Statuses {
  working = 'Working',
  workingRemotely = 'Working Remotely',
  onVacation = 'On Vacation',
  businessTrip = 'Business Trip',
}

interface User {
  id: string;
  email: string;
  name: string;
  status: Statuses;
}

interface InitializeState {
  isInitialized: boolean;
  users: any | null;
  teams: any | null;
  loading: boolean;
  error: string | null;
  user: User | null;
}

const initialState: InitializeState = {
  isInitialized: false,
  users: null,
  teams: null,
  loading: false,
  error: null,
  user: null,
};

export const initializeApp = createAsyncThunk(
  'initialize/app',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('http://localhost:3001/api/initialize', {
        withCredentials: true,
      });
      
      dispatch(getProfile());
      return response.data;
    } catch (error: any) {
      // If error, backend might be down
      return rejectWithValue('Backend service unavailable');
    }
  }
);

const initializeSlice = createSlice({
  name: 'initialize',
  initialState,
  reducers: {
    resetInitialization: (state) => {
      state.isInitialized = false;
      state.users = null;
      state.teams = null;
      state.loading = false;
      state.error = null;
    },
    clearProfile: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.users = action.payload.users;
        state.teams = action.payload.teams;
        state.error = null;
      })
      .addCase(initializeApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
      })
  },
});

export const { resetInitialization, clearProfile } = initializeSlice.actions;

// Selectors
export const selectUser = (state: { isInitialized: InitializeState }) => state.isInitialized.user;
export const selectIsInitialized = (state: { isInitialized: InitializeState }) => state.isInitialized.isInitialized;

export default initializeSlice.reducer;
