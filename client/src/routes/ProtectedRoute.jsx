import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ staff = false }) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.accessToken);
  if (!token) return <Navigate to="/login" replace />;
  if (staff && user?.role === 'CUSTOMER') return <Navigate to="/" replace />;
  return <Outlet />;
};
