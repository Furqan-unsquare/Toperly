import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [role, setRole] = useState<'student' | 'instructor' | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    language: 'en',
    bio: '',
    expertise: [] as string[],
  });
  const [expertiseInput, setExpertiseInput] = useState('');
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast({
        title: "Role Required",
        description: "Please select whether you're a student or instructor.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      ...(role === 'student' && {
        phone: formData.phone,
        language: formData.language,
      }),
      ...(role === 'instructor' && {
        bio: formData.bio,
        expertise: formData.expertise,
      }),
    };

    try {
      const success = await register(registerData);
      if (success) {
        toast({
          title: "Registration Successful!",
          description: `Welcome, ${formData.name}! Your ${role} account has been created.`,
        });
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          language: 'en',
          bio: '',
          expertise: [],
        });
        setRole('');
        navigate('/auth/login'); // Redirect to login page on success
        onSuccess?.();
      } else {
        toast({
          title: "Registration Failed",
          description: "An error occurred during registration. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const addExpertise = () => {
    if (expertiseInput.trim() && !formData.expertise.includes(expertiseInput.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, expertiseInput.trim()],
      }));
      setExpertiseInput('');
    } else if (formData.expertise.includes(expertiseInput.trim())) {
      toast({
        title: "Duplicate Expertise",
        description: "This skill is already added.",
        variant: "destructive",
      });
    }
  };

  const removeExpertise = (item: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== item),
    }));
  };

  return (
    <Card className="w-full max-w-lg shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
          Join Our Platform
        </CardTitle>
        <CardDescription>
          Create your account to start learning or teaching
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">I am a:</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  role === 'student'
                    ? 'border-primary bg-accent shadow-elegant'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <User className={`w-6 h-6 ${role === 'student' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${role === 'student' ? 'text-primary' : 'text-foreground'}`}>
                    Student
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  role === 'instructor'
                    ? 'border-primary bg-accent shadow-elegant'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <GraduationCap className={`w-6 h-6 ${role === 'instructor' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${role === 'instructor' ? 'text-primary' : 'text-foreground'}`}>
                    Instructor
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="transition-smooth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="transition-smooth"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="transition-smooth"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="transition-smooth"
                />
              </div>
            </div>
          </div>

          {role === 'student' && (
            <div className="space-y-4 p-4 bg-accent/50 rounded-lg">
              <h3 className="font-medium text-primary">Student Information</h3>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="transition-smooth"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {role === 'instructor' && (
            <div className="space-y-4 p-4 bg-secondary/10 rounded-lg">
              <h3 className="font-medium text-primary">Instructor Information</h3>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself and your teaching experience"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="min-h-[100px] transition-smooth"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expertise">Areas of Expertise</Label>
                <div className="flex gap-2">
                  <Input
                    id="expertise"
                    type="text"
                    placeholder="Add your skills (e.g., JavaScript, Python)"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                    className="transition-smooth"
                  />
                  <Button
                    type="button"
                    onClick={addExpertise}
                    variant="outline"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                {formData.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.expertise.map((item, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {item}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeExpertise(item)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
            disabled={isLoading || !role}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{' '}
              <button
                onClick={() => navigate('/auth/login')}
                className="text-primary hover:underline font-medium transition-smooth"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};