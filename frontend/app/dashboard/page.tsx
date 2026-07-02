"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/farmer/SidebarContext";
import FarmerDashboard from "@/components/farmer/FarmerDashboard";
import NavBar from "@/components/farmer/NavBar";
import FarmerSidebar from "@/components/farmer/sidebar";
import RoleTabs from "@/components/RoleTabs";
import CompanyDashboard from "@/components/company/CompanyDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("farmer");
  const { isOpen } = useSidebar();

  // Redirect to login if no role stored, or to company dashboard if role is company
  useEffect(() => {
    const storedRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
    if (!storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
      if (storedRole === "company") {
        router.push("/company/dashboard");
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
            <FarmerDashboard />
          ) : (
            <CompanyDashboard />
          )}
        </main>
      </div>
    </div>
  );
}
