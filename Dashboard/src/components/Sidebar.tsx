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
  TrendingUp,
  UserCheck,
  Verified,
  MailQuestion,
  DockIcon,
  User2Icon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

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
  const [collapsed, setCollapsed] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "?"; // Placeholder for missing name
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
    // { name: " Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, roles: ["admin", "subadmin"] },
    { name: "Coupons", path: "/admin/coupons", icon: Percent, roles: ["admin", "subadmin"] },
    { name: "Verify Instructor", path: "/admin/verify", icon: Verified, roles: ["admin", "subadmin"] },
    { name: "Sub-admin", path: "/admin/sub-admin", icon: User2Icon, roles: ["admin", "subadmin"] },
    { name: "Revenue", path: "/admin/revenue", icon: IndianRupeeIcon, roles: ["admin"] },
    { name: "Approvals", path: "/admin/approvals", icon: CheckSquare, roles: ["admin", "subadmin"] },
    { name: "Blog Management", path: "/admin/blogs", icon: DockIcon, roles: ["admin", "subadmin"] },
    { name: "Query", path: "/admin/query", icon: MailQuestion, roles: ["admin", "subadmin"] },
    { name: "User Management", path: "/admin/user-management", icon: UserCheck, roles: ["admin", "subadmin"] },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <aside
      className={`fixed inset-y-0 left-0 ${
        collapsed ? "w-16" : "w-70"
      } bg-white shadow-sm border-r border-gray-200 flex flex-col transition-all duration-300 z-50`}
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
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                collapsed ? "-rotate-90" : "rotate-90"
              }`}
            />
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
                  onClick={() => navigate(user.role === "admin" || user.role === "subadmin" ? "/admin/dashboard" : "/dashboard")}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {!collapsed && <span className="ml-2 text-sm">Dashboard</span>}
                </Button>
              </li>

              {/* Admin Navigation */}
              {user.role === "admin" || user.role === "subadmin" ? (
                <>
                  {filteredNavItems.filter((item) => item.path.startsWith("/admin/")).map((item) => (
                    <li key={item.path}>
                      <Button
                        variant={location.pathname === item.path ? "secondary" : "ghost"}
                        size="sm"
                        className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="w-4 h-4" />
                        {!collapsed && <span className="ml-2 text-sm">{item.name}</span>}
                      </Button>
                    </li>
                  ))}
                </>
              ) : (
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
                                  onClick={() => navigate("/instructor/all-courses")}
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
                                  onClick={() => navigate("/instructor/approvals")}
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
                                  onClick={() => navigate("/instructor/all-quizzes")}
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
                                  onClick={() => navigate("/instructor/materials")}
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
                        onClick={() => navigate("/instructor/revenue-dashboard")}
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
                        onClick={() => navigate("/instructor/reviews-feedback")}
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
                        onClick={() => navigate("/instructor/all-students")}
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
                          onClick={() => navigate("/instructor/user-profile")}
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
                          onClick={() => navigate("/instructor/security")}
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
                    onClick={() => navigate("/instructor/helpcenter")}
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
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};