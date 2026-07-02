"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RoleTabsProps {
  role?: string;
  setRole?: (role: string) => void;
}

export default function RoleTabs({ role, setRole }: RoleTabsProps) {
  const router = useRouter();
  const [active, setActive] = useState<string>("farmer");

  useEffect(() => {
    if (role) {
      setActive(role);
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userRole");
      if (stored) {
        setActive(stored);
      }
    }
  }, [role]);

  const switchTo = (newRole: string) => {
    setActive(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", newRole);
    }
    if (setRole) {
      setRole(newRole);
    }
    if (newRole === "farmer") {
      router.push("/dashboard");
    } else if (newRole === "company") {
      router.push("/company/dashboard");
    }
  };

  return (
    <div className="flex gap-4 mb-6 justify-center">
      <button
        className={`px-4 py-2 rounded-md font-medium transition-all ${
          active === "farmer"
            ? "bg-emerald-600 text-white shadow-sm"
            : "bg-slate-200 text-slate-800 hover:bg-slate-300"
        }`}
        onClick={() => switchTo("farmer")}
      >
        Farmer Dashboard
      </button>
      <button
        className={`px-4 py-2 rounded-md font-medium transition-all ${
          active === "company"
            ? "bg-emerald-600 text-white shadow-sm"
            : "bg-slate-200 text-slate-800 hover:bg-slate-300"
        }`}
        onClick={() => switchTo("company")}
      >
        Company Dashboard
      </button>
    </div>
  );
}
