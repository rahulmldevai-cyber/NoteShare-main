import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNotesAPI } from '../api/noteApi';

export const fetchNotes = createAsyncThunk('notes/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await getNotesAPI(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch notes');
  }
});

const noteSlice = createSlice({
  name: 'notes',
  initialState: { notes: [], pagination: null, loading: false, error: null, filters: { search: '', subject: '', course: '', semester: '', sort: 'latest' } },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters: (state) => { state.filters = { search: '', subject: '', course: '', semester: '', sort: 'latest' }; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchNotes.fulfilled, (state, action) => { state.loading = false; state.notes = action.payload.notes; state.pagination = action.payload.pagination; })
      .addCase(fetchNotes.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { setFilters, clearFilters } = noteSlice.actions;
export default noteSlice.reducer;
