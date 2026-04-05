'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard on default /admin route
    router.replace('/admin/dashboard');
  }, [router]);

  return null;
}
