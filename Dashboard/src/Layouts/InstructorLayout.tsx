import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function InstructorLayout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <Sidebar user={user} logout={logout} />
      <main>
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
