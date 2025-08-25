import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path as needed
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SubAdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithSocial } = useAuth(); // Use loginWithSocial from AuthContext
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (connection: string) => {
    setIsLoading(true);
    try {
      // Trigger Auth0 login with the specified connection (e.g., "google-oauth2")
      await loginWithSocial(connection);
      // Note: Navigation is handled in AuthProvider after successful login
    } catch (error) {
      console.error("Sub-admin login error:", error);
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "Failed to log in.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Sub-Admin Login
          </CardTitle>
          <CardDescription>
            Sign in with your sub-admin credentials using Auth0
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleLogin("google-oauth2")} // Example: Google login
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In with Google"}
          </Button>
          {/* Add more buttons for other Auth0 connections as needed */}
          <Button
            onClick={() => handleLogin("github")} // Example: GitHub login
            className="w-full bg-gray-800 hover:bg-gray-900 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In with GitHub"}
          </Button>
          {/* Optional: Add universal login button */}
          <Button
            onClick={() => handleLogin("")} // Empty connection triggers Auth0 universal login
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In with Auth0"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubAdminLogin;