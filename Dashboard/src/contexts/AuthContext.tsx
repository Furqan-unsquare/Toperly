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
  role: "student" | "instructor" | "admin" | "subadmin";
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
  selectRole: (
    role: "student" | "instructor" | "admin" | "subadmin",
    additionalData?: any
  ) => Promise<boolean>;
  needsRoleSelection: boolean;
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
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
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
      case "subadmin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

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
      console.log("Sync response:", data);
      if (response.ok) {
        if (data.needsRole) {
          setNeedsRoleSelection(true);
          setUser(null);
          setToken(null);
        } else {
          setUser(data.user);
          setToken(accessToken);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", accessToken);
          setNeedsRoleSelection(false);
          // Only redirect to dashboard if on root or login page
          if (location.pathname === "/" || location.pathname === "/auth/login") {
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
        description: "Failed to sync user data with backend.",
        variant: "destructive",
      });
      setUser(null);
      setToken(null);
      setNeedsRoleSelection(false);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, auth0User, getAccessTokenSilently, navigate, location.pathname]);

useEffect(() => {
  const initializeAuth = async () => {
    if (auth0Loading) return;

    const userJson = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (userJson && storedToken) {
      const parsedUser = JSON.parse(userJson);
      setUser(parsedUser);
      setToken(storedToken);
      setNeedsRoleSelection(false);

      if (location.pathname === "/" || location.pathname === "/auth/login") {
        navigate(getRedirectPath(parsedUser.role), { replace: true });
      }
      setIsLoading(false);
    } else if (isAuthenticated) {
      await syncUserWithBackend();
    } else {
      setIsLoading(false);
      setNeedsRoleSelection(false);

      // ✅ FIX: matchPath instead of includes
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
    loginWithRedirect({ authorizationParams: { connection } });
  };

  const registerWithSocial = (connection: string) => {
    loginWithRedirect({
      authorizationParams: { connection, screen_hint: "signup" },
    });
  };

  const selectRole = async (
    role: "student" | "instructor" | "admin" | "subadmin",
    additionalData?: any
  ): Promise<boolean> => {
    if (!auth0User) return false;
    try {
      let email = additionalData?.email || auth0User.email;
      const isFacebook = auth0User.sub?.startsWith("facebook|");
      const isGitHub = auth0User.sub?.startsWith("github|");
      if (!email && !isFacebook && !isGitHub) {
        if (!isAuthenticated) {
          await loginWithRedirect();
          return false;
        }
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
          throw new Error(
            "Email is required but not provided by the OAuth provider."
          );
        }
      } else if (!email && (isFacebook || isGitHub)) {
        throw new Error("Please provide an email address.");
      }
      if (!isAuthenticated) {
        await loginWithRedirect();
        return false;
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
      if (response.ok) {
        setUser(data.user);
        setToken(accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", accessToken);
        setNeedsRoleSelection(false);
        toast({
          title: "Role Selected",
          description: "Your role has been assigned successfully.",
        });
        navigate(getRedirectPath(data.user.role), { replace: true });
        return true;
      } else if (
        response.status === 409 &&
        data.message === "User already exists with this email or Auth0 ID"
      ) {
        setUser(data.user);
        setToken(accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", accessToken);
        setNeedsRoleSelection(false);
        toast({
          title: "User Already Exists",
          description: "Redirecting to your dashboard.",
        });
        navigate(getRedirectPath(data.user.role), { replace: true });
        return true;
      } else {
        throw new Error(data.message || "Role assignment failed");
      }
    } catch (error) {
      console.error("Role selection error:", error);
      toast({
        title: "Role Selection Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to assign role. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    navigate("/", { replace: true });
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const RoleSelectionForm = () => {
    const [role, setRole] = useState<
      "student" | "instructor" | "admin" | "subadmin"
    >("student");
    const [formData, setFormData] = useState({
      email: "",
      phone: "",
      language: "en",
      bio: "",
      expertise: [] as string[],
    });
    const [expertiseInput, setExpertiseInput] = useState("");
    const isFacebook = auth0User?.sub?.startsWith("facebook|");
    const isGitHub = auth0User?.sub?.startsWith("github|");

    const addExpertise = () => {
      if (
        expertiseInput.trim() &&
        !formData.expertise.includes(expertiseInput.trim())
      ) {
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
      if ((isFacebook || isGitHub) && !formData.email) {
        toast({
          title: "Missing Email",
          description: "Please provide an email address.",
          variant: "destructive",
        });
        return;
      }
      if ((isFacebook || isGitHub) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please provide a valid email address.",
          variant: "destructive",
        });
        return;
      }
      const additionalData =
        role === "student"
          ? {
              phone: formData.phone,
              language: formData.language,
            }
          : role === "instructor"
          ? {
              bio: formData.bio,
              expertise: formData.expertise,
            }
          : {};
      if (isFacebook || isGitHub) {
        additionalData.email = formData.email;
      }
      await selectRole(role, additionalData);
    };

    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Complete Your Profile
            </CardTitle>
            <CardDescription>
              Select your role and provide additional details to complete setup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(isFacebook || isGitHub) && (
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="transition-smooth"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as any)}
              >
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
            </div>

            {role === "student" && (
              <div className="space-y-4 p-4 bg-accent/50 rounded-lg">
                <h3 className="font-medium text-primary">
                  Student Information
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, language: value }))
                    }
                  >
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

            {role === "instructor" && (
              <div className="space-y-4 p-4 bg-secondary/10 rounded-lg">
                <h3 className="font-medium text-primary">
                  Instructor Information
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your teaching experience"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
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
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addExpertise())
                      }
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
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
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
              onClick={handleSubmit}
              className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Confirm Role"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
        selectRole,
        needsRoleSelection,
      }}
    >
      {isLoading || auth0Loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-lg">Loading...</div>
        </div>
      ) : needsRoleSelection ? (
        <RoleSelectionForm />
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