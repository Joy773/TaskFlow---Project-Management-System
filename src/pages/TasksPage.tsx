import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addTask, updateTask, deleteTask } from '@/store/tasksSlice';
import { addNotification } from '@/store/notificationsSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Pencil, User } from 'lucide-react';
import { Task, TaskStatus, Urgency } from '@/types';

export default function TasksPage() {
  const currentUser = useAppSelector(s => s.auth.currentUser);
  const tasks = useAppSelector(s => s.tasks.tasks);
  const users = useAppSelector(s => s.users.users);
  const dispatch = useAppDispatch();

  const canCreate = currentUser?.role === 'admin' || currentUser?.role === 'team_leader';
  const canDelete = currentUser?.role === 'admin';

  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Create form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');

  // Filter
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');

  const resetForm = () => { setTitle(''); setDescription(''); setUrgency('medium'); setAssigneeId(''); setStatus('todo'); };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newTask: Task = {
      id: 't' + Date.now(), title, description, status, urgency, assigneeId,
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

  const filteredTasks = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterUrgency !== 'all' && t.urgency !== filterUrgency) return false;
    return true;
  });

  const getUrgencyClasses = (u: string) => {
    switch (u) {
      case 'high': return 'bg-urgency-high/15 text-urgency-high border-urgency-high/30';
      case 'medium': return 'bg-urgency-medium/15 text-urgency-medium border-urgency-medium/30';
      case 'low': return 'bg-urgency-low/15 text-urgency-low border-urgency-low/30';
      default: return '';
    }
  };

  const getStatusClasses = (s: string) => {
    switch (s) {
      case 'todo': return 'bg-muted text-muted-foreground';
      case 'in_progress': return 'bg-primary/15 text-primary';
      case 'done': return 'bg-success/15 text-success';
      default: return '';
    }
  };

  const canEditTask = (task: Task) => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'team_leader') return true;
    if (currentUser?.role === 'employee') return true; // employees can update task info
    return false;
  };

  const TaskForm = ({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) => (
    <form onSubmit={onSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" required />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Task description" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Urgency</Label>
          <Select value={urgency} onValueChange={v => setUrgency(v as Urgency)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={v => setStatus(v as TaskStatus)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {(currentUser?.role === 'admin' || currentUser?.role === 'team_leader') && (
        <div className="space-y-2">
          <Label>Assign To</Label>
          <Select value={assigneeId} onValueChange={setAssigneeId}>
            <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
            <SelectContent>
              {users.map(u => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Button type="submit" className="w-full">{submitLabel}</Button>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">{tasks.length} total tasks</p>
        </div>
        {canCreate && (
          <Dialog open={createOpen} onOpenChange={o => { setCreateOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />New Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
              <TaskForm onSubmit={handleCreate} submitLabel="Create Task" />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex gap-3">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterUrgency} onValueChange={setFilterUrgency}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Urgency" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Urgency</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No tasks found</div>
        )}
        {filteredTasks.map(task => {
          const assignee = users.find(u => u.id === task.assigneeId);
          const creator = users.find(u => u.id === task.createdBy);
          return (
            <Card key={task.id} className="group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{task.title}</h3>
                      <Badge variant="outline" className={getUrgencyClasses(task.urgency)}>{task.urgency}</Badge>
                      <Badge variant="outline" className={getStatusClasses(task.status)}>{task.status.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {assignee && (
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{assignee.name}</span>
                      )}
                      <span>Created by {creator?.name}</span>
                      <span>Updated {new Date(task.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canEditTask(task) && (
                      <Dialog open={editTask?.id === task.id} onOpenChange={o => { if (!o) { setEditTask(null); resetForm(); } }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(task)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
                          <TaskForm onSubmit={handleUpdate} submitLabel="Update Task" />
                        </DialogContent>
                      </Dialog>
                    )}
                    {canDelete && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => dispatch(deleteTask(task.id))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
