import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import AdminSidebar from '@/components/layout/AdminSidebar';
import styles from '../expositor/dashboard/layout.module.css';

import DashboardTopBar from '@/components/layout/DashboardTopBar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/expositor/login');
  }

  return (
    <div className={styles.dashboardLayout} style={{ background: '#f4f6f8' }}>
      <AdminSidebar />
      <div className={styles.dashboardContent}>
        <DashboardTopBar user={user} basePath="/admin" />
        <main className={styles.dashboardInner}>
          {children}
        </main>
      </div>
    </div>
  );
}
