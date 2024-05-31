import { createSlice, isAnyOf } from '@reduxjs/toolkit';
//
import { getUsers, updateUser } from './operations';

const initialState = {
  users: [],
  page: 1,
  isLoading: false,
  error: null,
  filter: 'Show all',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    increasePage: state => {
      state.page += 1;
    },
    changeFilter: (state, { payload }) => {
      state.filter = payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUsers.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.users.push(...payload);
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.users = state.users.map(user => {
          if (user.id === payload.id) return payload;
          return user;
        });
      })
      .addMatcher(isAnyOf(getUsers.pending), state => {
        state.isLoading = true;
      })
      .addMatcher(isAnyOf(getUsers.rejected), (state, { payload }) => {
        state.error = payload;
        state.isLoading = false;
      });
  },
});

export const { increasePage, changeFilter } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
