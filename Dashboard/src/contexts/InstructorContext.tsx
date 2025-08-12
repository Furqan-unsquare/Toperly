import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const InstructorRoutes = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user || !['instructor', 'admin', 'subadmin'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default InstructorRoutes;