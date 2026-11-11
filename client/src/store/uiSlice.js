import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: false, notificationCount: 0 },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    closeSidebar: (state) => { state.sidebarOpen = false; },
    setNotificationCount: (state, action) => { state.notificationCount = action.payload; },
  },
});

export const { toggleSidebar, closeSidebar, setNotificationCount } = uiSlice.actions;
export default uiSlice.reducer;
