import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BookOpen, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Define notification type
interface Notification {
  id: number;
  message: string;
  icon: React.ElementType;
  timestamp: string;
}

// Dummy notifications for students and instructors
const studentNotifications: Notification[] = [
  {
    id: 1,
    message: "New course 'Advanced React' is now available!",
    icon: BookOpen,
    timestamp: "2025-08-01 10:00 AM",
  },
  {
    id: 2,
    message: "Continue your enrolled course 'Python Basics' to complete Module 3.",
    icon: BookOpen,
    timestamp: "2025-07-31 03:00 PM",
  },
  {
    id: 3,
    message: "New course 'Data Science Fundamentals' added to the catalog.",
    icon: BookOpen,
    timestamp: "2025-07-30 09:00 AM",
  },
];

const instructorNotifications: Notification[] = [
  {
    id: 1,
    message: "5 new students enrolled in your course 'Web Development 101'.",
    icon: Users,
    timestamp: "2025-08-01 11:00 AM",
  },
  {
    id: 2,
    message: "Your course 'JavaScript Mastery' has been reviewed by the admin team.",
    icon: BookOpen,
    timestamp: "2025-07-31 04:00 PM",
  },
  {
    id: 3,
    message: "New feedback received for your course 'React for Beginners'.",
    icon: Users,
    timestamp: "2025-07-30 02:00 PM",
  },
];

export const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch user role from localStorage or useAuth
    const userRole = user?.role || localStorage.getItem("userRole") || "student";
    
    // Set notifications based on user role
    setNotifications(userRole === "instructor" ? instructorNotifications : studentNotifications);
  }, [user]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-muted-foreground">No notifications available.</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex items-start space-x-3 p-3 bg-accent/10 rounded-md"
                >
                  <notification.icon className="w-5 h-5 mt-1 text-primary" />
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.timestamp}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};