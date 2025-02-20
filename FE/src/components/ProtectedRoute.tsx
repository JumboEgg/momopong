import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useSubAccountStore from '@/stores/subAccountStore';
import useAuthStore from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps): JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { selectedAccount, updateChildStatus } = useSubAccountStore();
  const location = useLocation();

  // 자식 계정 상태 업데이트
  useEffect(() => {
    if (!selectedAccount || !requireAuth || !isAuthenticated) {
      return undefined;
    }

    // 초기 상태 업데이트
    updateChildStatus();

    // 주기적으로 상태 업데이트
    const intervalId = setInterval(() => {
      updateChildStatus();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [selectedAccount, updateChildStatus, requireAuth, isAuthenticated]);

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/parents/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/parents/:parentId/children" replace />;
  }

  return (
    <div>
      {children}
    </div>
  );
}

export default ProtectedRoute;
