import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/student/Footer";

export default function StudentLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <div>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
