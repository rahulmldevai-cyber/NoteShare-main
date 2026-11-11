import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import noteReducer from './noteSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: noteReducer,
    ui: uiReducer,
  },
  devTools: import.meta.env.DEV,
});
