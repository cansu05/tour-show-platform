import type {ReactNode} from 'react';
import {SidebarNav} from '@/features/dashboard/components/SidebarNav';
import {PageHeader} from '@/features/dashboard/components/admin-ui';

export function DashboardShell({
  eyebrow = 'Admin Panel',
  title,
  description,
  actions,
  meta,
  children
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="admin-shell min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 lg:flex-row lg:items-start">
        <SidebarNav />
        <main className="flex min-w-0 flex-1 flex-col gap-6 pb-8">
          <PageHeader eyebrow={eyebrow} title={title} description={description} actions={actions} meta={meta} />
          {children}
        </main>
      </div>
    </div>
  );
}
