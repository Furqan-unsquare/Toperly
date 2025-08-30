import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  User,
  Heart,
  BookOpen,
  LogOut,
  CreditCard,
  Search,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import Translate from "@/pages/GoogleTranslate"

interface Course {
  _id: string;
  title: string;
  customId: string;
}

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  // Debounce function to limit API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch courses based on search query
  const fetchCourses = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/courses/?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      const result = await response.json();
      setSearchResults(
        result.map((course: any) => ({
          _id: course._id,
          title: course.title,
          customId: course.customId || "N/A",
        }))
      );
    } catch (error) {
      console.error("Error fetching courses:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedFetchCourses = useRef(debounce(fetchCourses, 300)).current;

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchOpen(true);
    debouncedFetchCourses(query);
  };

  // Handle course selection
  const handleCourseSelect = (courseId: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
    navigate(`/student/courses/${courseId}`);
  };

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-card border-b shadow-sm p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <a href="/student/dashboard">
          <img src="/logo.png" alt="logo" className="w-40" />
        </a>

        {/* Search Bar */}
        <div className="relative flex-1 mx-4" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full max-w-md rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {isSearchOpen && (
            <div className="absolute z-50 w-full max-w-md mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-gray-500">Loading...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((course) => (
                  <div
                    key={course._id}
                    onClick={() => handleCourseSelect(course._id)}
                    className="p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                  >
                    <p className="text-sm font-medium text-gray-900">{course.title}</p>
                    <p className="text-xs text-gray-500">{course.customId}</p>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="p-4 text-gray-500">No courses found</div>
              ) : null}
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-4">
          {/* Enrolled Courses */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/student/enrolled-courses")}
                className="hover:bg-accent"
              >
                <BookOpen className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enrolled Courses</p>
            </TooltipContent>
          </Tooltip>

          {/* Wishlist */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/student/wishlist")}
                className="hover:bg-accent"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Wishlist</p>
            </TooltipContent>
          </Tooltip>

          {/* Help Center */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/student/helpcenter")}
                className="hover:bg-accent"
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help Center</p>
            </TooltipContent>
          </Tooltip>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarFallback className="bg-primary text-white text-sm">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/student/profile")}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/student/payment-history")}>
                <CreditCard className="w-4 h-4 mr-2" />
                Payment History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

             {/* Language Selector */}
                   <Translate />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
