// ProtectedRoute
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps): JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

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
