// components/farmer/MobileDrawer.tsx
"use client";

import { X, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const menuItems = [
  { title: "Dashboard", href: "/farmer", icon: "LayoutDashboard" },
  { title: "Products", href: "/farmer/products", icon: "Package" },
  { title: "Orders", href: "/farmer/orders", icon: "ShoppingCart" },
  { title: "Messages", href: "/farmer/messages", icon: "MessageSquare" },
  { title: "Analytics", href: "/farmer/analytics", icon: "BarChart3" },
  { title: "Profile", href: "/farmer/profile", icon: "User" },
  { title: "Settings", href: "/farmer/settings", icon: "Settings" },
];

// Helper to map string icon name to actual component from lucide-react
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  User,
  Settings,
} from "lucide-react";

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  User,
  Settings,
};

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = open ? "hidden" : "auto";
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Close drawer"
      />
      {/* Drawer panel */}
      <aside className="relative w-64 max-w-full bg-white shadow-xl transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={onClose} aria-label="Close drawer">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="space-y-2 px-4 py-4">
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
