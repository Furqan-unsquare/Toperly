import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorRoutes = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'instructor') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Prevent rendering until role check is done
  if (!user || user.role !== 'instructor') return null;

  return <>{children}</>;
};

export default InstructorRoutes;
