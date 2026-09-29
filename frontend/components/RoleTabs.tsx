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
        className={`px-5 py-2.5 rounded-lg font-bold transition-all cursor-pointer ${
          active === "farmer"
            ? "bg-black text-white shadow-md hover:bg-slate-900"
            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
        }`}
        onClick={() => switchTo("farmer")}
      >
        Farmer Dashboard
      </button>
      <button
        className={`px-5 py-2.5 rounded-lg font-bold transition-all cursor-pointer ${
          active === "company"
            ? "bg-black text-white shadow-md hover:bg-slate-900"
            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
        }`}
        onClick={() => switchTo("company")}
      >
        Company Dashboard
      </button>
    </div>
  );
}
