import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import publicRoutes from "./public"; // adjust path
import { matchPath } from "react-router-dom";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
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
  requestInstructorUpgrade: (additionalData: { bio: string; expertise: string[] }) => Promise<boolean>;
  assignAdminRole: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = `${import.meta.env.VITE_API_URL}/api/auth`;


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
    [auth0User, getAccessTokenSilently, navigate, toast]
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
  }, [isAuthenticated, auth0User, getAccessTokenSilently, navigate, location.pathname, assignRole, toast]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (auth0Loading) return;

      const userJson = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (userJson && storedToken) {
        const parsedUser = JSON.parse(userJson);
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

  const requestInstructorUpgrade = async (additionalData: { bio: string; expertise: string[] }) => {
    if (!user || user.role !== "student") {
      throw new Error("Only students can request an instructor upgrade");
    }
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE}/request-instructor-upgrade`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth0Id: auth0User?.sub,
          userId: user.id,
          ...additionalData,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Request Submitted",
          description: "Your instructor upgrade request has been sent to the admin for approval.",
        });
        return true;
      } else {
        throw new Error(data.message || "Failed to submit upgrade request");
      }
    } catch (error) {
      console.error("Upgrade request error:", error);
      toast({
        title: "Request Error",
        description: error instanceof Error ? error.message : "Failed to submit instructor upgrade request.",
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
        requestInstructorUpgrade,
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