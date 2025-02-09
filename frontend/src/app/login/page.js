"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hardcoded users in the "database"
  const users = [
    { email: "hacknc1@yopmail.com", password: "client", role: "student" },
    { email: "vendor1@yopmail.com", password: "vendorpass", role: "vendor" },
    { email: "employee1@yopmail.com", password: "employeepass", role: "employee" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    // Check if the entered credentials match any user in the database
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      console.log("Login successful!");
      if (user.role === "vendor") {
        router.push("/vendor-dashboard"); // Redirect to Vendor Dashboard
      } else if (user.role === "employee") {
        router.push("/employee-dashboard"); // Redirect to Employee Dashboard
      } else {
        router.push("/dashboard"); // Redirect to Student Dashboard
      }
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Sign In</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Sign In
          </Button>
        </form>

        {/* Go Back Button */}
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => router.push("/")}
          >
            ← Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
