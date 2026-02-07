import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addTask, updateTask, deleteTask } from '@/store/tasksSlice';
import { addNotification } from '@/store/notificationsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Task, TaskStatus, Urgency } from '@/types';
import TaskForm from '@/components/TaskForm';

const columns: { key: TaskStatus; label: string; dotColor: string; btnColor: string }[] = [
  { key: 'todo', label: 'To Do', dotColor: 'bg-primary', btnColor: 'bg-primary hover:bg-primary/90 text-primary-foreground' },
  { key: 'in_progress', label: 'In Progress', dotColor: 'bg-urgency-medium', btnColor: 'bg-urgency-medium hover:bg-urgency-medium/90 text-primary-foreground' },
  { key: 'done', label: 'Completed', dotColor: 'bg-urgency-low', btnColor: 'bg-urgency-low hover:bg-urgency-low/90 text-primary-foreground' },
];

export default function TasksPage() {
  const currentUser = useAppSelector(s => s.auth.currentUser);
  const tasks = useAppSelector(s => s.tasks.tasks);
  const users = useAppSelector(s => s.users.users);
  const dispatch = useAppDispatch();

  const canCreate = currentUser?.role === 'admin' || currentUser?.role === 'team_leader';
  const canDelete = currentUser?.role === 'admin';

  const [createOpen, setCreateOpen] = useState(false);
  const [createStatus, setCreateStatus] = useState<TaskStatus>('todo');
  const [editTask, setEditTask] = useState<Task | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');

  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const resetForm = () => { setTitle(''); setDescription(''); setUrgency('medium'); setAssigneeId(''); setStatus('todo'); };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newTask: Task = {
      id: 't' + Date.now(), title, description, status: createStatus, urgency, assigneeId,
      createdBy: currentUser!.id, createdAt: now, updatedAt: now,
    };
    dispatch(addTask(newTask));
    if (assigneeId) {
      dispatch(addNotification({
        id: 'n' + Date.now(), message: `You have been assigned "${title}"`,
        taskId: newTask.id, userId: assigneeId, read: false, createdAt: now,
      }));
    }
    resetForm(); setCreateOpen(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTask) return;
    const oldAssignee = editTask.assigneeId;
    const updated = { ...editTask, title, description, status, urgency, assigneeId, updatedAt: new Date().toISOString() };
    dispatch(updateTask(updated));
    if (assigneeId !== oldAssignee && assigneeId) {
      dispatch(addNotification({
        id: 'n' + Date.now(), message: `You have been assigned "${title}"`,
        taskId: editTask.id, userId: assigneeId, read: false, createdAt: new Date().toISOString(),
      }));
    }
    setEditTask(null); resetForm();
  };

  const openEdit = (task: Task) => {
    setEditTask(task); setTitle(task.title); setDescription(task.description);
    setUrgency(task.urgency); setAssigneeId(task.assigneeId); setStatus(task.status);
  };

  const openCreateForColumn = (colStatus: TaskStatus) => {
    resetForm(); setCreateStatus(colStatus); setCreateOpen(true);
  };

  const handleDrop = (targetStatus: TaskStatus) => {
    if (!draggedTask || draggedTask.status === targetStatus) { setDraggedTask(null); return; }
    if (currentUser?.role === 'employee' || currentUser?.role === 'admin' || currentUser?.role === 'team_leader') {
      dispatch(updateTask({ ...draggedTask, status: targetStatus, updatedAt: new Date().toISOString() }));
    }
    setDraggedTask(null);
  };

  const getUrgencyLabel = (u: Urgency) => {
    switch (u) { case 'high': return 'High Priority'; case 'medium': return 'Important'; case 'low': return 'OK'; }
  };

  const getUrgencyClasses = (u: Urgency) => {
    switch (u) {
      case 'high': return 'bg-urgency-high/15 text-urgency-high border-urgency-high/30';
      case 'medium': return 'bg-urgency-medium/15 text-urgency-medium border-urgency-medium/30';
      case 'low': return 'bg-urgency-low/15 text-urgency-low border-urgency-low/30';
    }
  };

  const canAssign = currentUser?.role === 'admin' || currentUser?.role === 'team_leader';
  const formProps = {
    title, setTitle, description, setDescription, urgency, setUrgency,
    assigneeId, setAssigneeId, canAssign: !!canAssign, users,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground mt-1">Drag tasks between columns to update status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key);
          return (
            <div
              key={col.key}
              className="rounded-xl border border-border bg-card p-4 min-h-[400px] transition-colors"
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(col.key)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                  <h2 className="font-bold text-lg">{col.label}</h2>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md font-medium">
                  {colTasks.length} Total
                </span>
              </div>

              {/* Add New Task Button */}
              {canCreate && (
                <Button
                  className={`w-full mb-4 rounded-full font-medium ${col.btnColor}`}
                  onClick={() => openCreateForColumn(col.key)}
                >
                  <Plus className="h-4 w-4 mr-2" />Add New Task
                </Button>
              )}

              {/* Task Cards */}
              <div className="space-y-3">
                {colTasks.map(task => {
                  const assignee = users.find(u => u.id === task.assigneeId);
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => setDraggedTask(task)}
                      className="group bg-background rounded-xl border border-border p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="outline" className={`text-xs ${getUrgencyClasses(task.urgency)}`}>
                          {getUrgencyLabel(task.urgency)}
                        </Badge>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Dialog open={editTask?.id === task.id} onOpenChange={o => { if (!o) { setEditTask(null); resetForm(); } }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(task)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
                              <TaskForm onSubmit={handleUpdate} submitLabel="Update Task" status={status} setStatus={setStatus} {...formProps} />
                            </DialogContent>
                          </Dialog>
                          {canDelete && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => dispatch(deleteTask(task.id))}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <h3 className="font-medium mt-2 text-sm leading-snug">{task.title}</h3>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                              {assignee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-xs text-muted-foreground">{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Unassigned</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={o => { setCreateOpen(o); if (!o) resetForm(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
          <TaskForm onSubmit={handleCreate} submitLabel="Create Task" status={createStatus} setStatus={s => setCreateStatus(s)} {...formProps} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
