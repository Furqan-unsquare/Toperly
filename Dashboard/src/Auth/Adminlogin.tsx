import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";

const AdminLogin = () => {
  const { loginWithSocial } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"google" | "credentials" | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLoginMethod("google");
    try {
      await loginWithSocial("google-oauth2");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginMethod("credentials");
    // Handle email/password login logic here
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Left Image Section */}
      <div className="relative w-full lg:w-1/2 h-64 lg:h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 lg:bg-gradient-to-r lg:from-black/70 lg:to-black/20 z-10" />
        <img
          src="https://i.pinimg.com/1200x/f6/5c/ad/f65cad700afa5bc234496174b6e774a8.jpg"
          alt="Admin Access"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center lg:items-start lg:justify-center lg:px-16 lg:text-left">
          <div className="flex items-center mb-4 lg:mb-6">
            <div className="p-2 bg-blue-600/10 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="ml-3 text-2xl font-bold text-white">Admin Portal</h1>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
            Secure Admin Access
          </h2>
          <p className="text-lg text-blue-100 max-w-md">
            Manage your platform with powerful administrative tools and insights.
          </p>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h1>
            <p className="text-gray-500">Access your administrative dashboard</p>
          </div>
          
          <Card className="w-full shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto bg-blue-100 p-3 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Administrator Access
              </CardTitle>
              <CardDescription className="text-gray-500 text-base">
                Sign in to access the admin dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-white border border-gray-300 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-400 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isLoading && loginMethod === "google" ? (
                  <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <img src="https://static.vecteezy.com/system/resources/previews/046/861/647/non_2x/google-logo-transparent-background-free-png.png" alt="Google" className="h-8 w-8" />
                )}
                <span>{isLoading && loginMethod === "google" ? "Signing in..." : "Continue with Google"}</span>
              </button>

            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Having trouble?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;