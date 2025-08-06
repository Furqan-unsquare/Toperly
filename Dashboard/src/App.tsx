import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// 🧰 UI Components
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

// 🧭 Route Wrappers
import StudentRoutes from "./contexts/StudentContext";
import InstructorRoutes from "./contexts/InstructorContext";

// 📄 Pages
import Index from "./pages/Index";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { Dashboard } from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// 🎓 Student Components
import CoursesCatalog from './components/CoursesCatalog';
import CourseDetail from './components/CourseDetail';
import QuizPage from "./components/student/QuizPage";
import EnrolledCourses from "./components/student/EnrolledCourses";
import Wishlist from "./components/student/Wishlist";
import HelpCenter from "./components/Helpcenter";

// 🎓 Instructor Components
import CourseManagementSystem from "./pages/Instructor/Course";
import EnrolledStudents from "./pages/Instructor/EnrolledStudents";
import AdminCoursesReviews from "./pages/Instructor/Reviews";
import Approval from "./pages/Instructor/Approval"
import Createcourse from "./pages/Instructor/Createcourse";
import Quizz from "./pages/Instructor/Quizz";
import Materials from "./pages/Instructor/materials";
import ChangePassword from "./pages/Instructor/ChangePassword";
import Profile from "./pages/Instructor/Profile";
import Security from "./pages/Instructor/Security";
import InstructorHelpCenter from "./pages/Instructor/InstructorHelpcenter";

// ⚙️ Common Pages
import { ProfileSettings } from "./components/ProfileSettings";
import { Notifications } from "./components/Notifications";
import AboutPage from "./components/AboutPage";
import { StudentDashboard } from "./pages/StudentDashboard";
import AdminCoupons from "./pages/Admin/AdminCoupons";
import AdminRevenueTracker from "./pages/Admin/AdminRevenueTracker";
import AdminRealTimeAnalytics from "./pages/Admin/AdminRealTimeAnalytics";
import AdminCourseApprovalList from "./pages/Admin/AdminCourseApprovalList";
import AdminUserManagement from "./pages/Admin/AdminUserManagement";


const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if unauthenticated
  if (!user) {
    navigate("/auth/login");
    return null;
  }

  // Check if the user is a student
  const isStudent = user.role === "student";

  return (
    <div className={`min-h-screen bg-gradient-subtle flex flex-col`}>
        {/* Show Navbar only for students */}
      {isStudent && <Navbar />}
      <div className="flex flex-1">
        {/* Sidebar only for non-students */}
        {!isStudent && <Sidebar user={user} logout={logout} />}
        <div className="flex-1">
          <div className=" mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};


// 🧠 Main App Component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
            <Route path="/notifications" element={<ProtectedLayout><Notifications /></ProtectedLayout>} />
            <Route path="/helpcenter" element={<ProtectedLayout><HelpCenter /></ProtectedLayout>} />

            {/* Student Routes */}
            <Route path="/courses" element={<ProtectedLayout><StudentRoutes><CoursesCatalog /></StudentRoutes></ProtectedLayout>} />
            <Route path="/courses/:courseId" element={<ProtectedLayout><StudentRoutes><CourseDetail /></StudentRoutes></ProtectedLayout>} />
            <Route path="/courses/:courseId/quiz/:quizId" element={<ProtectedLayout><StudentRoutes><QuizPage /></StudentRoutes></ProtectedLayout>} />
            <Route path="/enrolled-courses" element={<ProtectedLayout><StudentRoutes><EnrolledCourses /></StudentRoutes></ProtectedLayout>} />
            <Route path="/wishlist" element={<ProtectedLayout><StudentRoutes><Wishlist /></StudentRoutes></ProtectedLayout>} />
       
            <Route path="/about" element={<ProtectedLayout><AboutPage/></ProtectedLayout>}/>
            <Route path="/profile" element={<ProtectedLayout><StudentDashboard/></ProtectedLayout>}/>

            {/* Instructor Routes */}            
            <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
            <Route path="/all-courses" element={<ProtectedLayout><InstructorRoutes><CourseManagementSystem /></InstructorRoutes></ProtectedLayout>} />
            <Route path="/create-course" element={<ProtectedLayout><InstructorRoutes><Createcourse /></InstructorRoutes></ProtectedLayout>} />
            <Route path="/approvals" element={<ProtectedLayout><InstructorRoutes><Approval /></InstructorRoutes></ProtectedLayout>} />
            
            <Route path="/all-quizzes" element={<ProtectedLayout><InstructorRoutes><Quizz /></InstructorRoutes></ProtectedLayout>} />
            <Route path="/materials" element={<ProtectedLayout><InstructorRoutes><Materials /></InstructorRoutes></ProtectedLayout>} />

            <Route path="/reviews-feedback" element={<ProtectedLayout><InstructorRoutes><AdminCoursesReviews /></InstructorRoutes></ProtectedLayout>} />
            <Route path="/all-students" element={<ProtectedLayout><InstructorRoutes><EnrolledStudents /></InstructorRoutes></ProtectedLayout>} />

            <Route path="/change-password" element={<ProtectedLayout><InstructorRoutes><ChangePassword /></InstructorRoutes></ProtectedLayout>} />
            <Route path="/user-profile" element={<ProtectedLayout><ProfileSettings /></ProtectedLayout>} />
            <Route path="/security" element={<ProtectedLayout><InstructorRoutes><Security /></InstructorRoutes></ProtectedLayout>} />
            
            <Route path="/Instructor-helpcenter" element={<ProtectedLayout><InstructorHelpCenter /></ProtectedLayout>} />
            <Route path="/admin/coupons" element={<ProtectedLayout><AdminCoupons /></ProtectedLayout>} />
            <Route path="/admin/revenue" element={<ProtectedLayout><AdminRevenueTracker /></ProtectedLayout>} />
            <Route path="/admin/analytics" element={<ProtectedLayout><AdminRealTimeAnalytics /></ProtectedLayout>} />
            <Route path="/admin/approvals" element={<ProtectedLayout><AdminCourseApprovalList /></ProtectedLayout>} />
            <Route path="/admin/user-management" element={<ProtectedLayout><AdminUserManagement /></ProtectedLayout>} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;