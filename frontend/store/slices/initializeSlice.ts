import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  status: 'available' | 'busy' | 'away' | 'offline';
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3001/api/initialize', {
        withCredentials: true,
      });
      
      return response.data;
    } catch (error: any) {
      // If error, backend might be down
      return rejectWithValue('Backend service unavailable');
    }
  }
);

export const getProfile = createAsyncThunk(
  'initialize/profile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3001/api/auth/me', {
        withCredentials: true,
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch profile');
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
    setUsersAndTeams: (state, action: PayloadAction<any>) => {
      state.users = action.payload.users;
      state.teams = action.payload.teams;
    },
    setProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
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

export const { resetInitialization, setUsersAndTeams, setProfile } = initializeSlice.actions;
export default initializeSlice.reducer;
