'use client';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addUser, deleteUser } from '@/store/usersSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Mail, Shield } from 'lucide-react';
import { Role } from '@/types';

export default function UsersPage() {
  const currentUser = useAppSelector(s => s.auth.currentUser);
  const users = useAppSelector(s => s.users.users);
  const dispatch = useAppDispatch();
  const isAdmin = currentUser?.role === 'admin';

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('employee');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addUser({ id: Date.now().toString(), name, email, role }));
    setName(''); setEmail(''); setRole('employee'); setOpen(false);
  };

  const getRoleBadgeClasses = (role: Role) => {
    switch (role) {
      case 'admin': return 'bg-primary/15 text-primary border-primary/30';
      case 'team_leader': return 'bg-urgency-medium/15 text-urgency-medium border-urgency-medium/30';
      case 'employee': return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">{users.length} team members</p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@company.com" required />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={role} onValueChange={v => setRole(v as Role)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="team_leader">Team Leader</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Create User</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map(user => (
          <Card key={user.id} className="group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                </div>
                {isAdmin && user.id !== currentUser?.id && (
                  <Button
                    variant="ghost" size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => dispatch(deleteUser(user.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <Badge variant="outline" className={getRoleBadgeClasses(user.role)}>
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
