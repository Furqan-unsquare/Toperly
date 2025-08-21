import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import publicRoutes from "./public"; // adjust path
import { matchPath } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin"; // Removed subadmin as per previous request
  profileImage?: string;
  phone?: string;
  language?: string;
  bio?: string;
  expertise?: string[];
  auth0Id?: string;
}

interface AuthContextType {
  user: User | null;
  loginWithSocial: (connection: string) => void;
  registerWithSocial: (connection: string) => void;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
  upgradeToInstructor: (additionalData: { bio: string; expertise: string[] }) => Promise<boolean>;
  assignAdminRole: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading: auth0Loading,
    getAccessTokenSilently,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const getRedirectPath = (role: string) => {
    switch (role) {
      case "student":
        return "/student/dashboard";
      case "instructor":
        return "/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  const assignRole = useCallback(
    async (role: "student" | "instructor" | "admin", additionalData: any = {}) => {
      if (!auth0User) return false;
      try {
        let email = additionalData.email || auth0User.email;
        const isFacebook = auth0User.sub?.startsWith("facebook|");
        const isGitHub = auth0User.sub?.startsWith("github|");
        if (!email && (isFacebook || isGitHub)) {
          const managementToken = await getAccessTokenSilently({
            authorizationParams: {
              audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
              scope: "read:users",
            },
          });
          const response = await fetch(
            `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${auth0User.sub}`,
            {
              headers: { Authorization: `Bearer ${managementToken}` },
            }
          );
          const userData = await response.json();
          email = userData.email || "";
          if (!email) {
            throw new Error("Email is required but not provided.");
          }
        }
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE}/assign-role`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auth0Id: auth0User.sub,
            role,
            name: auth0User.name || "Unknown",
            email,
            profileImage: auth0User.picture || "",
            ...additionalData,
          }),
        });
        const data = await response.json();
        if (response.ok || (response.status === 409 && data.message === "User already exists with this email or Auth0 ID")) {
          setUser(data.user);
          setToken(accessToken);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", accessToken);
          toast({
            title: "Role Assigned",
            description: `Welcome as ${role}!`,
          });
          navigate(getRedirectPath(data.user.role), { replace: true });
          return true;
        } else {
          throw new Error(data.message || "Role assignment failed");
        }
      } catch (error) {
        console.error("Role assignment error:", error);
        toast({
          title: "Role Assignment Error",
          description: error instanceof Error ? error.message : "Failed to assign role.",
          variant: "destructive",
        });
        return false;
      }
    },
    [auth0User, getAccessTokenSilently, navigate]
  );

  const syncUserWithBackend = useCallback(async () => {
    if (!isAuthenticated || !auth0User) {
      setIsLoading(false);
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE}/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth0Id: auth0User.sub,
          email: auth0User.email || "",
          name: auth0User.name || "Unknown",
          profileImage: auth0User.picture || "",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.needsRole) {
          const intendedRole = localStorage.getItem("intendedRole");
          const roleToAssign: "student" | "admin" = intendedRole === "admin" ? "admin" : "student";
          const additionalData = roleToAssign === "student" ? { language: "en", phone: "" } : {};
          localStorage.removeItem("intendedRole");
          await assignRole(roleToAssign, additionalData);
        } else {
          console.log("Sync response:", data); // Debug log
          setUser(data.user);
          setToken(accessToken);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", accessToken);
          if (location.pathname === "/" || location.pathname.startsWith("/auth/")) {
            navigate(getRedirectPath(data.user.role), { replace: true });
            toast({
              title: "Login Successful",
              description: `Welcome back, ${data.user.name}!`,
            });
          }
        }
      } else {
        throw new Error(data.message || "Sync failed");
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "Sync Error",
        description: "Failed to sync user data.",
        variant: "destructive",
      });
      setUser(null);
      setToken(null);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, auth0User, getAccessTokenSilently, navigate, location.pathname, assignRole]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (auth0Loading) return;

      const userJson = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (userJson && storedToken) {
        const parsedUser = JSON.parse(userJson);
        console.log("Loaded user from localStorage:", parsedUser); // Debug log
        setUser(parsedUser);
        setToken(storedToken);
        if (location.pathname === "/" || location.pathname.startsWith("/auth/")) {
          navigate(getRedirectPath(parsedUser.role), { replace: true });
        }
        setIsLoading(false);
      } else if (isAuthenticated) {
        await syncUserWithBackend();
      } else {
        setIsLoading(false);
        const isPublic = publicRoutes.some((route) =>
          matchPath({ path: route, end: true }, location.pathname)
        );
        if (!isPublic) {
          navigate("/", { replace: true });
        }
      }
    };

    initializeAuth();
  }, [auth0Loading, isAuthenticated, syncUserWithBackend, navigate, location.pathname]);

  const loginWithSocial = (connection: string) => {
    if (location.pathname === "/auth/admin") {
      localStorage.setItem("intendedRole", "admin");
    }
    loginWithRedirect({ authorizationParams: { connection } });
  };

  const registerWithSocial = (connection: string) => {
    if (location.pathname === "/auth/admin") {
      localStorage.setItem("intendedRole", "admin");
    }
    loginWithRedirect({
      authorizationParams: { connection, screen_hint: "signup" },
    });
  };

  const upgradeToInstructor = async (additionalData: { bio: string; expertise: string[] }) => {
    console.log("upgradeToInstructor called with user:", user); // Debug log
    if (!user ) {
      console.error("Upgrade failed: user =", user, "role =", user?.role);
      throw new Error("Only students can upgrade to instructor");
    }
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE}/upgrade-role`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth0Id: auth0User?.sub,
          newRole: "instructor",
          ...additionalData,
        }),
      });
      const data = await response.json();
      console.log("Upgrade response:", data); // Debug log
      if (response.ok) {
        const updatedUser = { ...user, role: "instructor", bio: additionalData.bio, expertise: additionalData.expertise };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast({
          title: "Upgrade Successful",
          description: "You are now an instructor!",
        });
        navigate(getRedirectPath("instructor"), { replace: true });
        return true;
      } else {
        throw new Error(data.message || "Upgrade failed");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast({
        title: "Upgrade Error",
        description: error instanceof Error ? error.message : "Failed to upgrade role.",
        variant: "destructive",
      });
      return false;
    }
  };

  const assignAdminRole = async () => {
    return await assignRole("admin", {});
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("intendedRole");
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    navigate("/", { replace: true });
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithSocial,
        registerWithSocial,
        logout,
        isLoading: isLoading || auth0Loading,
        token,
        upgradeToInstructor,
        assignAdminRole,
      }}
    >
      {isLoading || auth0Loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-lg">Loading...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const UpgradeToInstructorForm = () => {
  const { upgradeToInstructor, user } = useAuth();
  const [formData, setFormData] = useState({
    bio: "",
    expertise: [] as string[],
  });
  const [expertiseInput, setExpertiseInput] = useState("");
  const { toast } = useToast();

  console.log("UpgradeToInstructorForm user:", user); // Debug log
  if (user?.role !== "student") {
    return <div>You must be a student to upgrade.</div>;
  }

  const addExpertise = () => {
    if (expertiseInput.trim() && !formData.expertise.includes(expertiseInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, expertiseInput.trim()],
      }));
      setExpertiseInput("");
    } else if (formData.expertise.includes(expertiseInput.trim())) {
      toast({
        title: "Duplicate Expertise",
        description: "This skill is already added.",
        variant: "destructive",
      });
    }
  };

  const removeExpertise = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((exp) => exp !== item),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.bio.trim()) {
      toast({
        title: "Missing Bio",
        description: "Please provide a bio.",
        variant: "destructive",
      });
      return;
    }
    console.log("Submitting upgrade with formData:", formData); // Debug log
    await upgradeToInstructor(formData);
  };

  return (
    <div className="space-y-4 p-4 bg-secondary/10 rounded-lg">
      <h3 className="font-medium text-primary">Upgrade to Instructor</h3>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio *</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself and your teaching experience"
          value={formData.bio}
          onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
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
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExpertise())}
            className="transition-smooth"
          />
          <Button type="button" onClick={addExpertise} variant="outline" size="sm">
            Add
          </Button>
        </div>
        {formData.expertise.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.expertise.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {item}
                <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeExpertise(item)} />
              </Badge>
            ))}
          </div>
        )}
      </div>
      <Button onClick={handleSubmit} className="w-full bg-gradient-primary hover:opacity-90 transition-smooth">
        Upgrade to Instructor
      </Button>
    </div>
  );
};

export const AdminRoleForm = () => {
  const { assignAdminRole } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    const success = await assignAdminRole();
    if (success) {
      toast({
        title: "Role Assigned",
        description: "You are now an admin!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Assign Admin Role
          </CardTitle>
          <CardDescription>Confirm to assign admin role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleSubmit} className="w-full bg-gradient-primary hover:opacity-90 transition-smooth">
            Confirm Admin Role
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};