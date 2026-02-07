import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

const initialUsers: User[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@company.com', role: 'admin' },
  { id: '2', name: 'Marcus Johnson', email: 'marcus@company.com', role: 'team_leader' },
  { id: '3', name: 'Emily Davis', email: 'emily@company.com', role: 'employee' },
  { id: '4', name: 'Alex Rivera', email: 'alex@company.com', role: 'employee' },
  { id: '5', name: 'Jordan Lee', email: 'jordan@company.com', role: 'team_leader' },
];

interface UsersState {
  users: User[];
}

const initialState: UsersState = {
  users: initialUsers,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
    updateUser(state, action: PayloadAction<User>) {
      const idx = state.users.findIndex(u => u.id === action.payload.id);
      if (idx !== -1) state.users[idx] = action.payload;
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
  },
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
