'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { login } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListTodo, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const users = useAppSelector(s => s.users.users);
  const router = useRouter();

  const envEmail = process.env.NEXT_PUBLIC_EMAIL;
  const envPassword = process.env.NEXT_PUBLIC_PASSWORD;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.email === email);
    if (!user) {
      setError('User not found. Try: sarah@company.com, marcus@company.com, or emily@company.com');
      return;
    }
    // Env credentials: require exact password for NEXT_PUBLIC_EMAIL
    if (envEmail && email === envEmail) {
      if (password !== envPassword) {
        setError('Invalid password for this account.');
        return;
      }
    }
    // Other demo accounts: any password works
    dispatch(login(user));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <ListTodo className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to TaskFlow</CardTitle>
          <CardDescription>Sign in to manage your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="dibbojitdasjoy@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
          <div className="mt-6 p-3 rounded-lg bg-muted text-sm">
            <p className="font-medium text-foreground mb-2">Demo accounts:</p>
            <div className="space-y-1 text-muted-foreground">
              <p><span className="font-medium">Your account:</span> dibbojitdasjoy@gmail.com (use .env password)</p>
              <p><span className="font-medium">Admin:</span> sarah@company.com (any password)</p>
              <p><span className="font-medium">Team Leader:</span> marcus@company.com (any password)</p>
              <p><span className="font-medium">Employee:</span> emily@company.com (any password)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
