
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation, matchPath } from "react-router-dom";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// 🧰 UI Components
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// 🧭 Layouts
import PublicLayout from "./layouts/PublicLayout";
import StudentLayout from "./layouts/StudentLayout";
import InstructorLayout from "./layouts/InstructorLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

// 🧭 Route Wrappers
import StudentRoutes from "./contexts/StudentContext";
import InstructorRoutes from "./contexts/InstructorContext";
import publicRoutes from "./contexts/public"; // adjust path

// Landing Page
import HomePage from "./pages/LandingPage/pages/HomePage";
import AllCoursesPage from "./pages/LandingPage/pages/AllCoursesPage";
import BlogPage from "./pages/LandingPage/pages/BlogPage";
import ContactPage from "./pages/LandingPage/pages/ContactPage";
import SubscriptionPlans from "./components/LandingPage/components/Home/SubscriptionPlans";

// 📄 Pages
import LoginPage from "./Auth/LoginPage";
import InstructorLogin from "./Auth/InstructorLogin";
import { RegisterPage } from "./Auth/RegisterPage";
import { Dashboard } from "./pages/Student/Dashboard";
import NotFound from "./pages/NotFound";

// 🎓 Student Components
import CoursesCatalog from "./components/student/CoursesCatalog";
import CourseDetail from "./components/student/CourseDetail";
import QuizPage from "./components/student/QuizPage";
import EnrolledCourses from "./components/student/EnrolledCourses";
import Wishlist from "./components/student/Wishlist";
import HelpCenter from "./components/student/Helpcenter";

// 🎓 Instructor Components
import CourseManagementSystem from "./pages/Instructor/Course";
import EnrolledStudents from "./pages/Instructor/EnrolledStudents";
import AdminCoursesReviews from "./pages/Instructor/Reviews";
import Approval from "./pages/Instructor/Approval";
import Createcourse from "./pages/Instructor/Createcourse";
import Quizz from "./pages/Instructor/Quizz";
import Materials from "./pages/Instructor/materials";
import ChangePassword from "./pages/Instructor/ChangePassword";
import Profile from "./pages/Instructor/Profile";
import Security from "./pages/Instructor/Security";
import InstructorHelpCenter from "./pages/Instructor/InstructorHelpcenter";

// ⚙️ Admin Components
import AdminCoupons from "./pages/Admin/AdminCoupons";
import AdminRevenueTracker from "./pages/Admin/AdminRevenueTracker";
import AdminRealTimeAnalytics from "./pages/Admin/AdminRealTimeAnalytics";
import AdminVerify from "./pages/Admin/Verified";
import AdminCourseApprovalList from "./pages/Admin/AdminCourseApprovalList";
import AdminUserManagement from "./pages/Admin/AdminUserManagement";
import AdminQuery from "./pages/Admin/Query";
import AdminBlog from "./pages/Admin/BlogList";
import AdminSubadmin from "./pages/Admin/Subadmin";

// ⚙️ Common Pages
import ProfileSettings from "./components/ProfileSettings";
import { Notifications } from "./components/Notifications";
import AboutPage from "./components/student/AboutPage";
import { StudentDashboard } from "./pages/Student/StudentDashboard";
import Revenue from "./pages/Instructor/Revenue";
import PaymentHistory from "./pages/Student/PaymentHistory";

const queryClient = new QueryClient();


const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  const isPublic = publicRoutes.some((route) =>
    matchPath({ path: route, end: true }, location.pathname)
  );

  if (isLoading) return <div>Loading...</div>;

  if (isPublic) return <>{children}</>;

  if (!user) return <Navigate to="/auth/login" replace />;

  if (user.role === "admin" || user.role === "subadmin") {
    return <>{children}</>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

// 🧠 Main App Component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth Routes (No Layout) */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/Instructor" element={<InstructorLogin />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              
            </Route>

            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<AllCoursesPage />} />
              <Route path="/courses/:courseId" element={ <CourseDetail /> }/>
              <Route path="/blogs" element={<BlogPage />} />
              <Route path="/subscription-plans" element={<SubscriptionPlans />} />
              <Route path="/contact-us" element={<ContactPage />} />
            </Route>

            {/* Student Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/student/dashboard"
                element={
                  <StudentRoutes>
                    <Dashboard />
                  </StudentRoutes>
                }
              />
              <Route
                path="/student/courses"
                element={
                  <StudentRoutes>
                    <CoursesCatalog />
                  </StudentRoutes>
                }
              />
              <Route
                path="/student/courses/:courseId"
                element={
                  <StudentRoutes>
                    <CourseDetail />
                  </StudentRoutes>
                }
              />
              <Route
                path="/student/courses/:courseId/quiz/:quizId"
                element={
                  <StudentRoutes>
                    <QuizPage />
                  </StudentRoutes>
                }
              />
              <Route
                path="/student/enrolled-courses"
                element={
                  <StudentRoutes>
                    <EnrolledCourses />
                  </StudentRoutes>
                }
              />
              <Route
                path="/student/wishlist"
                element={
                  <StudentRoutes>
                    <Wishlist />
                  </StudentRoutes>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <StudentRoutes>
                    <StudentDashboard />
                  </StudentRoutes>
                }
              />
              <Route
                path="/student/user-profile"
                element={
                  <StudentRoutes>
                    <ProfileSettings />
                  </StudentRoutes>
                }
              />
              <Route
                path="/student/about"
                element={
                  <StudentRoutes>
                    <AboutPage />
                  </StudentRoutes>
                }
              />
              <Route
                path="/student/notifications"
                element={
                  <StudentRoutes>
                    <Notifications />
                  </StudentRoutes>
                }
              />
              <Route
                path="/student/helpcenter"
                element={
                  <StudentRoutes>
                    <HelpCenter />
                  </StudentRoutes>
                }
              />
              <Route
                path="/student/payment-history"
                element={
                  <StudentRoutes>
                    <PaymentHistory />
                  </StudentRoutes>
                }
              />
            </Route>

            {/* Instructor Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["instructor"]}>
                  <InstructorLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/dashboard"
                element={
                  <InstructorRoutes>
                    <Dashboard />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/all-courses"
                element={
                  <InstructorRoutes>
                    <CourseManagementSystem />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/create-course"
                element={
                  <InstructorRoutes>
                    <Createcourse />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/approvals"
                element={
                  <InstructorRoutes>
                    <Approval />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/all-quizzes"
                element={
                  <InstructorRoutes>
                    <Quizz />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/materials"
                element={
                  <InstructorRoutes>
                    <Materials />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/reviews-feedback"
                element={
                  <InstructorRoutes>
                    <AdminCoursesReviews />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/revenue-dashboard"
                element={
                  <InstructorRoutes>
                    <Revenue />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/all-students"
                element={
                  <InstructorRoutes>
                    <EnrolledStudents />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/change-password"
                element={
                  <InstructorRoutes>
                    <ChangePassword />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/user-profile"
                element={
                  <InstructorRoutes>
                    <ProfileSettings />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/security"
                element={
                  <InstructorRoutes>
                    <Security />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/helpcenter"
                element={
                  <InstructorRoutes>
                    <InstructorHelpCenter />
                  </InstructorRoutes>
                }
              />
              <Route
                path="/instructor/notifications"
                element={
                  <InstructorRoutes>
                    <Notifications />
                  </InstructorRoutes>
                }
              />
            </Route>

            {/* Admin Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminRealTimeAnalytics />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/verify" element={<AdminVerify />} />
              <Route path="/admin/sub-admin" element={<AdminSubadmin />} />
              <Route path="/admin/revenue" element={<AdminRevenueTracker />} />
              <Route path="/admin/blogs" element={<AdminBlog />} />
              <Route path="/admin/query" element={<AdminQuery />} />
              <Route path="/admin/approvals" element={<AdminCourseApprovalList />} />
              <Route path="/admin/user-management" element={<AdminUserManagement />} />
              <Route path="/admin/notifications" element={<Notifications />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;