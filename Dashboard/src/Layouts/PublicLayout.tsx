import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../LandingPage/components/Navbar";
import Footer from "../LandingPage/components/Footer"; 
import Topsy from "../LandingPage/components/TopsyBot"

export default function PublicLayout() {
  return (
    <div>
      <Navbar />
      <main className="-mt-10 sm:mt-0">
        <Outlet />
      </main>
      <Topsy />
      <Footer />
    </div>
  );
}
