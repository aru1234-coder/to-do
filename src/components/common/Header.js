"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const id = localStorage.getItem("id");
    setUserId(id);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("id");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ToDoApp
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {/* Show Sign Up on Login Page */}
          {pathname === "/login" && (
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
            >
              Sign Up
            </Link>
          )}

          {/* Show Login on Sign Up Page */}
          {pathname === "/signup" && (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
            >
              Login
            </Link>
          )}

          {/* Show Logout if user is logged in and NOT on login/signup page */}
          {userId && pathname !== "/login" && pathname !== "/signup" && (
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
