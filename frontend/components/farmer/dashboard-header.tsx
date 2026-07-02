"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{greeting} 👋</h1>
        <p className="mt-2 text-slate-600">Manage your agricultural business from one place.</p>
      </div>
      <Link href="/farmer/products/new">
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
          + Add Product
        </Button>
      </Link>
    </div>
  );
}