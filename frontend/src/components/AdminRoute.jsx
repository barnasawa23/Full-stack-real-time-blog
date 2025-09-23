import { useAuth } from '../context/useAuth';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.is_admin ? children : <Navigate to="/" />;
}