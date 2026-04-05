'use client';

import DashboardLayout from '@/components/adminlayout';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
