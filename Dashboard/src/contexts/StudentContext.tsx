import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const StudentRoutes = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user || user.role !== 'student') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default StudentRoutes;