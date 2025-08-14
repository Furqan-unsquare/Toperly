import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/LandingPage/components/Navbar";
import Footer from "../components/LandingPage/components/Footer"; 
import Topsy from "../components/LandingPage/components/TopsyBot"

export default function PublicLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {/* <Topsy /> */}
      <Footer />
    </div>
  );
}
