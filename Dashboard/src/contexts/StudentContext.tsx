import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentRoutes = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (user?.role === 'student') {
      setAuthorized(true);
    } else {
      navigate('/dashboard');
      setAuthorized(false);
    }
  }, [user, navigate]);

  if (authorized === false) return null;
  if (authorized === null) return <div className="text-center mt-10">Loading...</div>;

  return <>{children}</>;
};

export default StudentRoutes;
