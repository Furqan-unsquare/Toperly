// Modified: src/components/auth/LoginForm.tsx
// Changes: Replace custom form with social login buttons. Use Auth0 for login.

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export const LoginForm = () => {
  const { loginWithSocial } = useAuth();

  return (
    <Card className="w-full max-w-md shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
          Login to Your Account
        </CardTitle>
        <CardDescription>
          Sign in using your social accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={() => loginWithSocial('google-oauth2')} className="w-full">
          Login with Google
        </Button>
        <Button onClick={() => loginWithSocial('github')} className="w-full">
          Login with GitHub
        </Button>
        <Button onClick={() => loginWithSocial('facebook')} className="w-full">
          Login with Facebook
        </Button>
        {/* Add more providers as needed */}
      </CardContent>
    </Card>
  );
};
