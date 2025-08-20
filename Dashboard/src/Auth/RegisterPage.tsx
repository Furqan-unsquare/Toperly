import { RegisterForm } from '@/components/auth/RegisterForm';

export const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="text-center lg:text-left space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Learn. Teach. Grow.
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto lg:mx-0">
              Join thousands of students and instructors in our modern learning platform
            </p>
          </div> 
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <div className="p-4 rounded-lg bg-card shadow-card">
              <h3 className="font-semibold text-primary mb-2">For Students</h3>
              <p className="text-sm text-muted-foreground">
                Access courses, track progress, and earn certificates
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card shadow-card">
              <h3 className="font-semibold text-secondary mb-2">For Instructors</h3>
              <p className="text-sm text-muted-foreground">
                Create courses, manage students, and earn revenue
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};