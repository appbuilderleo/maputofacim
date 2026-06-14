import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import ExpositorSidebar from '@/components/layout/ExpositorSidebar';
import styles from './layout.module.css';

import DashboardTopBar from '@/components/layout/DashboardTopBar';

export default async function ExpositorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user || user.role !== 'EXPOSITOR') {
    redirect('/expositor/login');
  }

  return (
    <div className={styles.dashboardLayout}>
      <ExpositorSidebar />
      <div className={styles.dashboardContent}>
        <DashboardTopBar user={user} basePath="/expositor/dashboard" />
        <main className={styles.dashboardInner}>
          {children}
        </main>
      </div>
    </div>
  );
}
