// Modified: src/components/auth/RegisterForm.tsx
// Changes: Replace custom form with social register buttons. Use Auth0 for signup.

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export const RegisterForm = () => {
  const { registerWithSocial } = useAuth();

  return (
    <Card className="w-full max-w-md shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
          Register for an Account
        </CardTitle>
        <CardDescription>
          Sign up using your social accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={() => registerWithSocial('google-oauth2')} className="w-full">
          Register with Google
        </Button>
        <Button onClick={() => registerWithSocial('github')} className="w-full">
          Register with GitHub
        </Button>
        {/* Add more providers as needed */}
      </CardContent>
    </Card>
  );
};