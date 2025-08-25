import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart2,
  LogOut,
  Settings,
  ChevronDown,
  GraduationCap,
  LifeBuoy,
  FilePlus2,
  CheckSquare,
  FolderOpen,
  UserCircle2,
  LockKeyhole,
  FileQuestion,
  IndianRupeeIcon,
  Star,
  Percent,
  UserCheck,
  MailQuestion,
  DockIcon,
  User2Icon,
  BellIcon,
  X,
  Menu,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
    language?: string;
    bio?: string;
    expertise?: string[];
  };
  logout: () => void;
}

export const Sidebar = ({ user, logout }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const API_BASE = `${import.meta.env.VITE_API_URL}/api/auth`;

  // Fetch pending upgrade requests count for admin/subadmin
  useEffect(() => {
    const fetchPendingCount = async () => {
      if (!token || (user.role !== "admin" && user.role !== "subadmin")) {
        setPendingCount(0);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/pending-upgrade-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setPendingCount(data.length);
        } else {
          throw new Error(data.message || "Failed to fetch pending requests");
        }
      } catch (error) {
        console.error("Fetch pending count error:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load pending requests count.",
          variant: "destructive",
        });
        setPendingCount(0);
      }
    };

    fetchPendingCount();
  }, [token, user.role, toast]);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "?"; 
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleProfileNavigation = () => {
    if (user.role === "admin" || user.role === "subadmin") {
      navigate("/admin/profile");
    } else {
      navigate("/instructor/user-profile");
    }
  };

  const navItems = [
    // Instructor-specific items
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["instructor"] },
    { name: "My Courses", path: "/instructor/all-courses", icon: FolderOpen, roles: ["instructor"] },
    { name: "Create Course", path: "/instructor/create-course", icon: FilePlus2, roles: ["instructor"] },
    { name: "Approvals", path: "/instructor/approvals", icon: CheckSquare, roles: ["instructor"] },
    { name: "Quizzes", path: "/instructor/all-quizzes", icon: FileQuestion, roles: ["instructor"] },
    { name: "Materials", path: "/instructor/materials", icon: BookOpen, roles: ["instructor"] },
    { name: "Revenue dashboard", path: "/instructor/revenue-dashboard", icon: IndianRupeeIcon, roles: ["instructor"] },
    { name: "Reviews & Feedback", path: "/instructor/reviews-feedback", icon: Star, roles: ["instructor"] },
    { name: "All Students", path: "/instructor/all-students", icon: Users, roles: ["instructor"] },
    { name: "Help Center", path: "/instructor/helpcenter", icon: LifeBuoy, roles: ["instructor"] },
    // Admin-specific items
    { name: "Coupons", path: "/admin/coupons", icon: Percent, roles: ["admin", "subadmin"] },
    { name: "Sub-admin", path: "/admin/sub-admin", icon: User2Icon, roles: ["admin"] },
    { name: "Revenue", path: "/admin/revenue", icon: IndianRupeeIcon, roles: ["admin"] },
    { name: "Course Management", path: "/admin/course-management", icon: CheckSquare, roles: ["admin", "subadmin"] },
    { name: "Blog Management", path: "/admin/blogs", icon: DockIcon, roles: ["admin", "subadmin"] },
    { name: "Query", path: "/admin/query", icon: MailQuestion, roles: ["admin", "subadmin"] },
    { name: "User Management", path: "/admin/user-management", icon: UserCheck, roles: ["admin", "subadmin"] },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(user.role));

  // Mobile menu toggle
  const MobileMenuButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
      onClick={() => setIsMobileOpen(!isMobileOpen)}
    >
      <Menu className="w-5 h-5" />
    </Button>
  );

  return (
    <>
      <MobileMenuButton />
      
      <aside
        className={cn(
          "fixed inset-y-0 left-0 bg-white shadow-sm border-r border-gray-200 flex flex-col transition-all duration-300 z-40",
          collapsed ? "w-16" : "w-70",
          "md:translate-x-0", // Always visible on desktop
          isMobileOpen ? "translate-x-0" : "-translate-x-full" // Slide in/out on mobile
        )}
        onMouseEnter={() => !isPinned && setCollapsed(false)}
        onMouseLeave={() => !isPinned && setCollapsed(true)}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {!collapsed && (
              <div className="font-semibold text-lg text-primary">
                <img src="/logo.png" alt="logo" className="w-36" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setIsPinned(false);
                setCollapsed(true);
                setIsMobileOpen(false);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-grow py-2 px-4 overflow-y-auto">
            <nav className="mt-2">
              <ul className="space-y-1">
                {/* Dashboard */}
                <li>
                  <Button
                    variant={location.pathname === (user.role === "admin" || user.role === "subadmin" ? "/admin/dashboard" : "/dashboard") ? "secondary" : "ghost"}
                    size="sm"
                    className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                    onClick={() => {
                      navigate(user.role === "admin" || user.role === "subadmin" ? "/admin/dashboard" : "/dashboard");
                      setIsMobileOpen(false);
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {!collapsed && <span className="ml-2 text-sm">Dashboard</span>}
                  </Button>
                </li>

                {/* Admin Navigation */}
                {(user.role === "admin" || user.role === "subadmin") && (
                  <>
                    {filteredNavItems
                      .filter((item) => item.path.startsWith("/admin/"))
                      .map((item) => (
                        <li key={item.path}>
                          <Button
                            variant={location.pathname === item.path ? "secondary" : "ghost"}
                            size="sm"
                            className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                            onClick={() => {
                              navigate(item.path);
                              setIsMobileOpen(false);
                            }}
                          >
                            <item.icon className="w-4 h-4" />
                            {!collapsed && <span className="ml-2 text-sm">{item.name}</span>}
                          </Button>
                        </li>
                      ))}
                  </>
                )}

                {/* Instructor Navigation */}
                {user.role === "instructor" && (
                  <>
                    {/* Course Management */}
                    {filteredNavItems.some((item) => ["My Courses", "Approvals"].includes(item.name)) && (
                      <li>
                        <div className="w-full my-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (collapsed) setCollapsed(false);
                              setCoursesOpen(!coursesOpen);
                              setAssessmentOpen(false);
                              setSettingsOpen(false);
                            }}
                            className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                          >
                            <BookOpen className="w-4 h-4" />
                            {!collapsed && (
                              <>
                                <span className="ml-2 text-sm">Course Management</span>
                                <ChevronDown
                                  className={`ml-auto w-4 h-4 transform transition-transform ${
                                    coursesOpen ? "rotate-180" : "rotate-0"
                                  }`}
                                />
                              </>
                            )}
                          </Button>

                          {!collapsed && coursesOpen && (
                            <ul className="ml-6 mt-1 space-y-1 text-gray-600">
                              {filteredNavItems.find((item) => item.name === "My Courses") && (
                                <li>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => {
                                      navigate("/instructor/all-courses");
                                      setIsMobileOpen(false);
                                    }}
                                  >
                                    <FolderOpen className="w-4 h-4 mr-2" />
                                    My Courses
                                  </Button>
                                </li>
                              )}
                              {filteredNavItems.find((item) => item.name === "Approvals") && (
                                <li>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => {
                                      navigate("/instructor/approvals");
                                      setIsMobileOpen(false);
                                    }}
                                  >
                                    <CheckSquare className="w-4 h-4 mr-2" />
                                    Approvals
                                  </Button>
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      </li>
                    )}

                    {/* Assessment Studio */}
                    {filteredNavItems.some((item) => ["Quizzes", "Materials"].includes(item.name)) && (
                      <li>
                        <div className="w-full">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (collapsed) setCollapsed(false);
                              setAssessmentOpen(!assessmentOpen);
                              setCoursesOpen(false);
                              setSettingsOpen(false);
                            }}
                            className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                          >
                            <GraduationCap className="w-4 h-4" />
                            {!collapsed && (
                              <>
                                <span className="ml-2 text-sm">Assessment</span>
                                <ChevronDown
                                  className={`ml-auto w-4 h-4 transform transition-transform ${
                                    assessmentOpen ? "rotate-180" : "rotate-0"
                                  }`}
                                />
                              </>
                            )}
                          </Button>

                          {!collapsed && assessmentOpen && (
                            <ul className="ml-6 mt-1 space-y-1 text-gray-600">
                              {filteredNavItems.find((item) => item.name === "Quizzes") && (
                                <li>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => {
                                      navigate("/instructor/all-quizzes");
                                      setIsMobileOpen(false);
                                    }}
                                  >
                                    <FileQuestion className="w-4 h-4 mr-2" />
                                    Quizzes
                                  </Button>
                                </li>
                              )}
                              {filteredNavItems.find((item) => item.name === "Materials") && (
                                <li>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => {
                                      navigate("/instructor/materials");
                                      setIsMobileOpen(false);
                                    }}
                                  >
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Materials
                                  </Button>
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      </li>
                    )}

                    {/* Revenue dashboard */}
                    {filteredNavItems.find((item) => item.name === "Revenue dashboard") && (
                      <li>
                        <Button
                          variant={location.pathname === "/instructor/revenue-dashboard" ? "secondary" : "ghost"}
                          size="sm"
                          className={`w-full my-2 justify-start ${collapsed ? "justify-center px-0" : ""}`}
                          onClick={() => {
                            navigate("/instructor/revenue-dashboard");
                            setIsMobileOpen(false);
                          }}
                        >
                          <IndianRupeeIcon className="w-4 h-4" />
                          {!collapsed && <span className="ml-2 text-sm">Revenue dashboard</span>}
                        </Button>
                      </li>
                    )}

                    {/* Reviews & Feedback */}
                    {filteredNavItems.find((item) => item.name === "Reviews & Feedback") && (
                      <li>
                        <Button
                          variant={location.pathname === "/instructor/reviews-feedback" ? "secondary" : "ghost"}
                          size="sm"
                          className={`w-full my-2 justify-start ${collapsed ? "justify-center px-0" : ""}`}
                          onClick={() => {
                            navigate("/instructor/reviews-feedback");
                            setIsMobileOpen(false);
                          }}
                        >
                          <Star className="w-4 h-4" />
                          {!collapsed && <span className="ml-2 text-sm">Reviews & Feedback</span>}
                        </Button>
                      </li>
                    )}

                    {/* All Students */}
                    {filteredNavItems.find((item) => item.name === "All Students") && (
                      <li>
                        <Button
                          variant={location.pathname === "/instructor/all-students" ? "secondary" : "ghost"}
                          size="sm"
                          className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                          onClick={() => {
                            navigate("/instructor/all-students");
                            setIsMobileOpen(false);
                          }}
                        >
                          <Users className="w-4 h-4" />
                          {!collapsed && <span className="ml-2 text-sm">All Students</span>}
                        </Button>
                      </li>
                    )}
                  </>
                )}

                {/* Settings Dropdown */}
                <li>
                  <div className="w-full my-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (collapsed) setCollapsed(false);
                        setSettingsOpen(!settingsOpen);
                        setCoursesOpen(false);
                        setAssessmentOpen(false);
                      }}
                      className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                    >
                      <Settings className="w-4 h-4" />
                      {!collapsed && (
                        <>
                          <span className="ml-2 text-sm">Settings</span>
                          <ChevronDown
                            className={`ml-auto w-4 h-4 transform transition-transform ${
                              settingsOpen ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </>
                      )}
                    </Button>

                    {!collapsed && settingsOpen && (
                      <ul className="ml-6 mt-1 space-y-1 text-gray-600">
                        <li>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              handleProfileNavigation();
                              setIsMobileOpen(false);
                            }}
                          >
                            <UserCircle2 className="w-4 h-4 mr-2" />
                            User Profile
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              navigate("/instructor/security");
                              setIsMobileOpen(false);
                            }}
                          >
                            <LockKeyhole className="w-4 h-4 mr-2" />
                            Security
                          </Button>
                        </li>
                      </ul>
                    )}
                  </div>
                </li>

                {/* Help Center */}
                {filteredNavItems.find((item) => item.name === "Help Center") && (
                  <li>
                    <Button
                      variant={location.pathname === "/instructor/helpcenter" ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                      onClick={() => {
                        navigate("/instructor/helpcenter");
                        setIsMobileOpen(false);
                      }}
                    >
                      <LifeBuoy className="w-4 h-4" />
                      {!collapsed && <span className="ml-2 text-sm">Help Center</span>}
                    </Button>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col items-center space-y-3">
              {/* Notification Icon (Admin/Subadmin only) */}
              {(user.role === "admin" || user.role === "subadmin") && (
                <Button
                  variant={location.pathname === "/admin/notification" ? "secondary" : "ghost"}
                  size={collapsed ? "icon" : "sm"}
                  className={`relative ${collapsed ? "w-8 h-8" : "w-full justify-start"}`}
                  onClick={() => {
                    navigate("/admin/notification");
                    setIsMobileOpen(false);
                  }}
                >
                  <BellIcon className="w-4 h-4" />
                  {pendingCount > 0 && (
                    <Badge
                      variant="destructive"
                      className={`absolute ${collapsed ? "top-0 right-0" : "top-1 right-2"} text-xs h-4 w-[5px] flex items-center justify-center`}
                    >
                      {pendingCount}
                    </Badge> 
                  )}
                  {!collapsed && <span className="ml-2 text-sm">Notifications</span>}
                </Button>
              )}

              {/* User Profile */}
              <div className={`flex items-center ${collapsed ? "justify-center" : "w-full"}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                {!collapsed && (
                  <div className="ml-3 flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs font-semibold text-primary capitalize">
                      {user.role}
                    </p>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size={collapsed ? "icon" : "sm"}
                className={`${collapsed ? "w-8 h-8" : "w-full"}`}
                onClick={() => {
                  handleLogout();
                  setIsMobileOpen(false);
                }}
              >
                <LogOut className="w-4 h-4" />
                {!collapsed && <span className="ml-2">Logout</span>}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};