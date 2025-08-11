import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await login(formData.email, formData.password, role);
      if (success) {
        toast({
          title: "Login Successful!",
          description: `Welcome back! You are logged in as a ${role}.`,
        });
        setFormData({ email: "", password: "" });
        setRole("student");
        navigate("/student/dashboard"); // Redirect to dashboard on successful login
        onSuccess?.();
      } else {
        toast({
          title: "Login Failed",
          description:
            "Invalid credentials or an error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "An unexpected error occurred.");

      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
          Login to Your Account
        </CardTitle>
        <CardDescription>
          Sign in as a student or instructor to access the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="transition-smooth"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="transition-smooth"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={role}
              onValueChange={(value) =>
                setRole(value as "student" | "instructor")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/auth/register")}
                className="text-primary hover:underline font-medium transition-smooth"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
