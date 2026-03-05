'use client';

import { useAppSelector } from '@/store';
import { redirect } from 'next/navigation';

export default function HomePage() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  if (isAuthenticated) redirect('/dashboard');
  redirect('/login');
}
