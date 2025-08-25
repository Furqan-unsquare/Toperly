
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RegisterForm } from '@/components/auth/SubAdmin';
import { LoginForm } from '@/components/auth/LoginForm';
import { RoleSelectionForm } from '@/components/auth/RoleSelectionForm'; // New import
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, needsRoleSelection } = useAuth(); // Assume added to context
  const navigate = useNavigate();

  if (user) {
    navigate(user.role === 'student' ? '/hub' : '/dashboard');
    return null;
  }

  if (needsRoleSelection) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <RoleSelectionForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero content remains the same */}
        <div className="text-center lg:text-left space-y-6">
          {/* ... */}
        </div>

        {/* Right side - Auth forms */}
        <div className="flex flex-col items-center space-y-6">
          <div className="flex bg-muted p-1 rounded-lg">
            <Button
              variant={isLogin ? "default" : "ghost"}
              onClick={() => setIsLogin(true)}
              className="transition-smooth"
            >
              Sign In
            </Button>
            <Button
              variant={!isLogin ? "default" : "ghost"}
              onClick={() => setIsLogin(false)}
              className="transition-smooth"
            >
              Register
            </Button>
          </div>

          <div className="w-full flex justify-center">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium transition-smooth"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};