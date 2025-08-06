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
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Courses", path: "/all-courses", icon: FolderOpen },
    { name: "Create Course", path: "/create-course", icon: FilePlus2 },
    { name: "Approvals", path: "/approvals", icon: CheckSquare },
    { name: "Quizzes", path: "/all-quizzes", icon: GraduationCap },
    // { name: "Create Quiz", path: "/create-quiz", icon: FilePlus2 },
    { name: "Materials", path: "/materials", icon: BookOpen },
    { name: "Reviews & Feedback", path: "/reviews-feedback", icon: Users },
    { name: "All Students", path: "/all-students", icon: Users },
    { name: "Help Center", path: "/helpcenter", icon: LifeBuoy },
  ];

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
                  variant={location.pathname === "/dashboard" ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                  onClick={() => navigate("/dashboard")}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {!collapsed && <span className="ml-2 text-sm">Dashboard</span>}
                </Button>
              </li>

              {/* Course Management */}
              <li>
                <div className="w-full my-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (collapsed) setCollapsed(false); // Expand sidebar if collapsed
                      setCoursesOpen(!coursesOpen);
                      setAssessmentOpen(false); // Close other dropdowns
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
                      <li>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => navigate("/all-courses")}
                        >
                          <FolderOpen className="w-4 h-4 mr-2" />
                          My Courses
                        </Button>
                      </li>
                      <li>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => navigate("/approvals")}
                        >
                          <CheckSquare className="w-4 h-4 mr-2" />
                          Approvals
                        </Button>
                      </li>
                    </ul>
                  )}
                </div>
              </li>

              {/* Assessment Studio */}
              <li>
                <div className="w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (collapsed) setCollapsed(false); // Expand sidebar if collapsed
                      setAssessmentOpen(!assessmentOpen);
                      setCoursesOpen(false); // Close other dropdowns
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
                      <li>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => navigate("/all-quizzes")}
                        >
                          <FileQuestion className="w-4 h-4 mr-2" />
                          Quizzes
                        </Button>
                      </li>
                      <li>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => navigate("/materials")}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Materials
                        </Button>
                      </li>
                    </ul>
                  )}
                </div>
              </li>

              {/* Reviews & Feedback */}
              <li>
                <Button
                  variant={location.pathname === "/reviews-feedback" ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full my-2 justify-start ${collapsed ? "justify-center px-0" : ""}`}
                  onClick={() => navigate("/reviews-feedback")}
                >
                  <Users className="w-4 h-4" />
                  {!collapsed && <span className="ml-2 text-sm">Reviews & Feedback</span>}
                </Button>
              </li>

              {/* All Students */}
              <li>
                <Button
                  variant={location.pathname === "/all-students" ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                  onClick={() => navigate("/all-students")}
                >
                  <Users className="w-4 h-4" />
                  {!collapsed && <span className="ml-2 text-sm">All Students</span>}
                </Button>
              </li>

              {/* Settings Dropdown */}
              <li>
                <div className="w-full my-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (collapsed) setCollapsed(false); // Expand sidebar if collapsed
                      setSettingsOpen(!settingsOpen);
                      setCoursesOpen(false); // Close other dropdowns
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
                          onClick={() => navigate("/user-profile")}
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
                          onClick={() => navigate("/security")}
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
              <li>
                <Button
                  variant={location.pathname === "/Instructor-helpcenter" ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                  onClick={() => navigate("/Instructor-helpcenter")}
                >
                  <LifeBuoy className="w-4 h-4" />
                  {!collapsed && <span className="ml-2 text-sm">Help Center</span>}
                </Button>
              </li>
              <li>
                <Button
                  variant={location.pathname === "/admin/coupons" ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                  onClick={() => navigate("/admin/coupons")}
                >
                  <LifeBuoy className="w-4 h-4" />
                  {!collapsed && <span className="ml-2 text-sm">Coupons (Admin)</span>}
                </Button>
              </li>
              <li>
                <Button
                  variant={location.pathname === "/admin/revenue" ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                  onClick={() => navigate("/admin/revenue")}
                >
                  <LifeBuoy className="w-4 h-4" />
                  {!collapsed && <span className="ml-2 text-sm">Revenue (Admin)</span>}
                </Button>
              </li>
              <li>
                <Button
                  variant={location.pathname === "/admin/analytics" ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                  onClick={() => navigate("/admin/analytics")}
                >
                  <LifeBuoy className="w-4 h-4" />
                  {!collapsed && <span className="ml-2 text-sm">Analytics (Admin)</span>}
                </Button>
              </li>
              <li>
                <Button
                  variant={location.pathname === "/admin/approvals" ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                  onClick={() => navigate("/admin/approvals")}
                >
                  <LifeBuoy className="w-4 h-4" />
                  {!collapsed && <span className="ml-2 text-sm">Approvals (Admin)</span>}
                </Button>
              </li>
              <li>
                <Button
                  variant={location.pathname === "/admin/user-management" ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${collapsed ? "justify-center px-0" : ""}`}
                  onClick={() => navigate("/admin/user-management")}
                >
                  <LifeBuoy className="w-4 h-4" />
                  {!collapsed && <span className="ml-2 text-sm">User Management (Admin)</span>}
                </Button>
              </li>
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