import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthCtx } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthCtx);
  return user ? children : <Navigate to="/login" replace />;
}
