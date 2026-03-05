'use client';

import { useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Layout } from '@/components/Layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <Layout>{children}</Layout>;
}
