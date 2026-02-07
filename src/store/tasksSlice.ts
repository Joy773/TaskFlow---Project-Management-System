import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@/types';

const initialTasks: Task[] = [
  {
    id: 't1', title: 'Design homepage wireframe', description: 'Create wireframes for the new homepage redesign',
    status: 'in_progress', urgency: 'high', assigneeId: '3', createdBy: '1',
    createdAt: '2026-02-05T10:00:00Z', updatedAt: '2026-02-06T14:00:00Z',
  },
  {
    id: 't2', title: 'Fix authentication bug', description: 'Users are getting logged out randomly after 5 minutes',
    status: 'todo', urgency: 'high', assigneeId: '4', createdBy: '2',
    createdAt: '2026-02-06T09:00:00Z', updatedAt: '2026-02-06T09:00:00Z',
  },
  {
    id: 't3', title: 'Update API documentation', description: 'Add new endpoints to the API docs',
    status: 'done', urgency: 'low', assigneeId: '3', createdBy: '2',
    createdAt: '2026-02-04T08:00:00Z', updatedAt: '2026-02-06T16:00:00Z',
  },
  {
    id: 't4', title: 'Database migration', description: 'Migrate user table to new schema',
    status: 'todo', urgency: 'medium', assigneeId: '4', createdBy: '1',
    createdAt: '2026-02-07T08:00:00Z', updatedAt: '2026-02-07T08:00:00Z',
  },
];

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = { tasks: initialTasks };

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
    updateTask(state, action: PayloadAction<Task>) {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.tasks[idx] = action.payload;
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
  },
});

export const { addTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
