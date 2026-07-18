import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RouteProtegee({ children }) {
  const { estConnecte } = useAuth();

  if (!estConnecte) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RouteProtegee;