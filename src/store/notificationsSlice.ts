import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@/types';

const initialNotifications: Notification[] = [
  {
    id: 'n1', message: 'You have been assigned "Design homepage wireframe"',
    taskId: 't1', userId: '3', read: false, createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'n2', message: 'You have been assigned "Fix authentication bug"',
    taskId: 't2', userId: '4', read: false, createdAt: '2026-02-06T09:00:00Z',
  },
  {
    id: 'n3', message: 'You have been assigned "Database migration"',
    taskId: 't4', userId: '4', read: true, createdAt: '2026-02-07T08:00:00Z',
  },
];

interface NotificationsState {
  notifications: Notification[];
}

const initialState: NotificationsState = { notifications: initialNotifications };

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
    },
    markAsRead(state, action: PayloadAction<string>) {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n) n.read = true;
    },
    markAllAsRead(state, action: PayloadAction<string>) {
      state.notifications.filter(n => n.userId === action.payload).forEach(n => n.read = true);
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
