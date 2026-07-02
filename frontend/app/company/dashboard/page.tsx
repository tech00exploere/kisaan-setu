"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/farmer/SidebarContext";
import NavBar from "@/components/farmer/NavBar";
import FarmerSidebar from "@/components/farmer/sidebar";
import RoleTabs from "@/components/RoleTabs";
import CompanyDashboard from "@/components/company/CompanyDashboard";

export default function CompanyDashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("company");
  const { isOpen } = useSidebar();

  // Redirect to login if no role stored, or to farmer dashboard if role is farmer
  useEffect(() => {
    const storedRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
    if (!storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
      if (storedRole === "farmer") {
        router.push("/dashboard");
      }
    }
  }, [router]);

  return (
    <div className={`min-h-screen bg-slate-50 transition-all duration-300 ${isOpen ? 'pl-[260px]' : 'pl-[72px]'}`}>
      <NavBar />
      <div className="flex">
        <FarmerSidebar />
        <main className="flex-1 p-8">
          <RoleTabs role={role} setRole={setRole} />
          {role === "farmer" ? (
            <div className="p-8 text-center text-slate-500">Redirecting to Farmer Dashboard...</div>
          ) : (
            <CompanyDashboard />
          )}
        </main>
      </div>
    </div>
  );
}
