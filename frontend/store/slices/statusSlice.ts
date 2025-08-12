import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Status {
  id: string;
  userId: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  message?: string;
  lastUpdated: string;
}

interface StatusState {
  currentStatus: Status | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatusState = {
  currentStatus: null,
  loading: false,
  error: null,
};

export const fetchCurrentStatus = createAsyncThunk(
  'status/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3001/api/status/current', {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch status');
    }
  }
);

export const updateStatus = createAsyncThunk(
  'status/update',
  async (status: string, { rejectWithValue }) => {
    try {
      const response = await axios.put('http://localhost:3001/api/status/update',{status}, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStatus = action.payload.status;
      })
      .addCase(fetchCurrentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStatus = action.payload.status;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = statusSlice.actions;
export default statusSlice.reducer;
