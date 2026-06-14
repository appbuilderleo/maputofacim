import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import PatrocinadorSidebar from '@/components/layout/PatrocinadorSidebar';
import styles from '../../expositor/dashboard/layout.module.css';

import DashboardTopBar from '@/components/layout/DashboardTopBar';

export default async function PatrocinadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user || user.role !== 'PATROCINADOR') {
    redirect('/patrocinador/login');
  }

  return (
    <div className={styles.dashboardLayout}>
      <PatrocinadorSidebar />
      <div className={styles.dashboardContent}>
        <DashboardTopBar user={user} basePath="/patrocinador/dashboard" />
        <main className={styles.dashboardInner}>
          {children}
        </main>
      </div>
    </div>
  );
}
