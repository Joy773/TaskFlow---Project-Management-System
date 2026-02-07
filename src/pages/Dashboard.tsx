import { useAppSelector } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListTodo, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const currentUser = useAppSelector(s => s.auth.currentUser);
  const tasks = useAppSelector(s => s.tasks.tasks);
  const users = useAppSelector(s => s.users.users);

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const highUrgency = tasks.filter(t => t.urgency === 'high' && t.status !== 'done').length;

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: ListTodo, color: 'text-primary' },
    { label: 'Team Members', value: users.length, icon: Users, color: 'text-primary' },
    { label: 'High Urgency', value: highUrgency, icon: AlertTriangle, color: 'text-urgency-high' },
    { label: 'Completed', value: doneCount, icon: CheckCircle2, color: 'text-success' },
  ];

  const recentTasks = [...tasks].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  const getUrgencyClasses = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-urgency-high/15 text-urgency-high border-urgency-high/30';
      case 'medium': return 'bg-urgency-medium/15 text-urgency-medium border-urgency-medium/30';
      case 'low': return 'bg-urgency-low/15 text-urgency-low border-urgency-low/30';
      default: return '';
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-muted text-muted-foreground';
      case 'in_progress': return 'bg-primary/15 text-primary';
      case 'done': return 'bg-success/15 text-success';
      default: return '';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {currentUser?.name}</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your workspace</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'To Do', count: todoCount, total: tasks.length, color: 'bg-muted-foreground' },
                { label: 'In Progress', count: inProgressCount, total: tasks.length, color: 'bg-primary' },
                { label: 'Done', count: doneCount, total: tasks.length, color: 'bg-success' },
              ].map(item => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all`}
                      style={{ width: `${item.total ? (item.count / item.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks.map(task => {
                const assignee = users.find(u => u.id === task.assigneeId);
                return (
                  <div key={task.id} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{assignee?.name}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={getUrgencyClasses(task.urgency)}>
                        {task.urgency}
                      </Badge>
                      <Badge variant="outline" className={getStatusClasses(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
