import { Card, CardHeader, CardTitle, CardContent, CardDescription} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";


const AdminLogin = () => {
  const { loginWithSocial } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <CardDescription>Sign in with your admin credentials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            onClick={() => loginWithSocial("google-oauth2")} // Adjust connection as needed
            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
          >
            Login with Google
          </button>
          {/* Add other social login buttons as needed */}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;