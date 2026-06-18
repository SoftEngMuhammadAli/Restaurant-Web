import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = () => {
  const token = useSelector((state) => state.auth.accessToken);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
