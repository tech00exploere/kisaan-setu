"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  User,
  Settings,
} from "lucide-react";
import { useSidebar } from "@/components/farmer/SidebarContext";

const menuItems = [
  {
    title: "Dashboard",
    href: "/farmer",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/farmer/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/farmer/orders",
    icon: ShoppingCart,
  },
  {
    title: "Messages",
    href: "/farmer/messages",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    href: "/farmer/analytics",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/farmer/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/farmer/settings",
    icon: Settings,
  },
];

export default function FarmerSidebar() {
  const { isOpen, toggle } = useSidebar();
  const [role, setRole] = useState("farmer");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("userRole");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (storedRole) setRole(storedRole);
    }
  }, []);

  return (
    <aside className={`fixed left-0 top-0 h-screen border-r bg-white z-45 transition-all duration-300 ${isOpen ? 'w-[260px]' : 'w-[72px]'}`}>
      <div className="p-6 flex items-center justify-between h-20 border-b border-slate-50">
        <span className={`font-bold text-slate-800 transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
          KISAAN SETU
        </span>
        <button onClick={toggle} className="text-slate-600 hover:text-slate-800 cursor-pointer">
          {/* Hamburger/Toggle icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav className="space-y-2 px-3 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          let href = item.href;
          if (item.title === "Profile") {
            href = role === "company" ? "/company/profile" : "/farmer/profile";
          }
          if (item.title === "Settings") {
            href = role === "company" ? "/company/settings" : "/farmer/settings";
          }

          return (
            <Link
              key={item.title}
              href={href}
              className="
                flex items-center gap-3
                rounded-2xl px-3 py-3
                text-slate-700
                transition-all
                hover:bg-orange-50
                hover:text-orange-600
              "
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && (
                <span className="text-sm font-medium transition-all duration-300 overflow-hidden whitespace-nowrap">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}