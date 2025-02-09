"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLandingPage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isDashboard = pathname === "/dashboard"; // Employee Dashboard
  const isVendorDashboard = pathname === "/vendor-dashboard"; // Vendor Dashboard
  const isEmp = pathname === "/employee-dashboard"; // Vendor Dashboard


  // Logout Function
  const handleLogout = () => {
    console.log("User logged out");
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto p-4">
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-4">
          {/* Logo Circle */}
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <img
              src="/logo.png" // Your logo image in the public/ folder
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          {/* Brand Name */}
          <h1
            className="text-xl font-bold dark:text-white cursor-pointer"
            onClick={() => router.push("/")}
          >
            Pack The Feed
          </h1>
        </div>

        {/* Show Navigation Links ONLY on Landing Page */}
        {isLandingPage && (
          <nav className="hidden md:flex flex-1 justify-center space-x-8">
            <button
              onClick={() => document.getElementById("panel").scrollIntoView({ behavior: "smooth" })}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Mystical Panels
            </button>
            <button
              onClick={() => document.getElementById("blogs").scrollIntoView({ behavior: "smooth" })}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Chronicles
            </button>
            <button
              onClick={() =>
                document.getElementById("testimonials").scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Tales of Gratitude
            </button>
          </nav>
        )}

        {/* Right Side: Theme Toggle + Logout / Sign In */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {(isDashboard || isVendorDashboard || isEmp) ? (
            <Button
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            !isLoginPage && (
              <Button
                className="bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                variant="outline"
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
            )
          )}
        </div>

        {/* Mobile Menu Toggle Button (Only for Landing Page) */}
        <div className="flex md:hidden">
          {isLandingPage && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu (Only for Landing Page) */}
      {isMenuOpen && isLandingPage && (
        <nav className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
          <div className="flex flex-col items-center space-y-4 p-4">
            <button
              onClick={() => {
                document.getElementById("panel").scrollIntoView({ behavior: "smooth" });
                setIsMenuOpen(false);
              }}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Mystical Panels
            </button>
            <button
              onClick={() => {
                document.getElementById("blogs").scrollIntoView({ behavior: "smooth" });
                setIsMenuOpen(false);
              }}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Chronicles
            </button>
            <button
              onClick={() => {
                document.getElementById("testimonials").scrollIntoView({ behavior: "smooth" });
                setIsMenuOpen(false);
              }}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Tales of Gratitude
            </button>
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
