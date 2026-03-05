'use client';

import { useAppSelector } from '@/store';
import { redirect } from 'next/navigation';

export default function ClientHomeRedirect(): React.ReactNode {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  if (isAuthenticated) redirect('/dashboard');
  redirect('/login');
  return null;
}
