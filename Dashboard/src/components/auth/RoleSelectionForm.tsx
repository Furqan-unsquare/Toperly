// New: src/components/auth/RoleSelectionForm.tsx
// Added: Form to select role after first social login if needed.

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const RoleSelectionForm = () => {
  const { selectRole } = useAuth();
  const { toast } = useToast();
  const [role, setRole] = useState<'student' | 'instructor' | 'admin' | 'subadmin'>('student');

  const handleSubmit = async () => {
    const success = await selectRole(role);
    if (success) {
      toast({ title: "Role Selected", description: "Your role has been assigned successfully." });
    } else {
      toast({ title: "Error", description: "Failed to assign role.", variant: "destructive" });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-card">
      <CardHeader className="text-center">
        <CardTitle>Select Your Role</CardTitle>
        <CardDescription>Please choose your role to complete setup.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={role} onValueChange={(value) => setRole(value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="instructor">Instructor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="subadmin">Subadmin</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit} className="w-full">Confirm Role</Button>
      </CardContent>
    </Card>
  );
};