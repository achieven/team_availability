import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import statusReducer from './slices/statusSlice';
import teamReducer from './slices/teamSlice';
import initializeReducer from './slices/initializeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    status: statusReducer,
    team: teamReducer,
    initialize: initializeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
