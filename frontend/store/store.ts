import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import statusReducer from './slices/statusSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    status: statusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
