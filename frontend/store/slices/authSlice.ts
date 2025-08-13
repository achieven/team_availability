import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearProfile } from './initializeSlice';

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

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', credentials, {
        withCredentials: true
      });
      const { user } = response.data;
      
      try {
        const profileResponse = await axios.get('http://localhost:3001/api/auth/me', {
          withCredentials: true,
        });
        dispatch(getProfile());
      } catch (profileError) {
        console.warn('Failed to fetch profile after login:', profileError);
      }
      
      return { user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);



export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await axios.post('http://localhost:3001/api/auth/logout', {}, {
        withCredentials: true
      });
      // Clear the profile from initializeSlice
      dispatch(clearProfile());
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      }).addCase(getProfile.pending, (state) => {
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

export const { clearError, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
