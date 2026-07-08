'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useIdleTimer } from '@/hooks/useIdleTimer';
import { IdleWarningModal } from '@/components/ui/IdleWarningModal';
import { ADMIN_IDLE_TIMEOUT_MS, IDLE_WARNING_BEFORE_MS } from '@/lib/constants';

const STAFF_ROLES = ['ADMIN', 'MODERADOR'] as const;

export function IdleSessionMonitor({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleExpire = useCallback(() => {
    logout();
    router.push('/auth/login');
  }, [logout, router]);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/');
  }, [logout, router]);

  const { showWarning, remainingSeconds, resetTimer } = useIdleTimer({
    timeoutMs: ADMIN_IDLE_TIMEOUT_MS,
    warningBeforeMs: IDLE_WARNING_BEFORE_MS,
    onExpire: handleExpire,
  });

  if (!user || !STAFF_ROLES.includes(user.rol as typeof STAFF_ROLES[number])) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <IdleWarningModal
        open={showWarning}
        remainingSeconds={remainingSeconds}
        onContinue={resetTimer}
        onLogout={handleLogout}
      />
    </>
  );
}
