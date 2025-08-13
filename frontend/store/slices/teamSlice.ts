import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  status?: string;
}

interface TeamState {
  members: User[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  members: [],
  loading: false,
  error: null,
};

export const fetchTeamMembers = createAsyncThunk(
  'team/fetchMembers',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/user/team-members`, {
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team members');
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
        state.error = null;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = teamSlice.actions;
export default teamSlice.reducer;
