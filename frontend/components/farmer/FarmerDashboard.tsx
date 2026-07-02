"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryCard from "./category-card";
import { 
  Wheat, Apple, Carrot, Milk, Leaf,
  PlusCircle, MessageSquare, ShoppingBag, IndianRupee, Package,
  TrendingUp, Activity, Clock, ChevronRight, UserCheck, ShieldAlert
} from "lucide-react";

interface Category {
  name: string;
  slug: string;
  icon: React.ReactNode;
  count: number;
}

export default function FarmerDashboard() {
  const router = useRouter();
  const [farmerName, setFarmerName] = useState("Priyanshu");
  const [currentDate, setCurrentDate] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("farmerName");
      if (stored) {
        setFarmerName(stored);
      }
      
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
      setProducts(storedProducts);
      
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(storedOrders);
    }
    setCurrentDate(new Date().toLocaleDateString("en-US", {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));
  }, []);

  const categories: Category[] = [
    { name: "Dairy", slug: "dairy", icon: <Milk className="h-8 w-8 text-blue-500" />, count: products.filter(p => p.type === 'Dairy').length },
    { name: "Grains", slug: "grains", icon: <Wheat className="h-8 w-8 text-orange-500" />, count: products.filter(p => p.type === 'Grains').length },
    { name: "Fruits", slug: "fruits", icon: <Apple className="h-8 w-8 text-red-500" />, count: products.filter(p => p.type === 'Fruits').length },
    { name: "Vegetables", slug: "vegetables", icon: <Carrot className="h-8 w-8 text-green-500" />, count: products.filter(p => p.type === 'Vegetables').length },
    { name: "Cereals", slug: "cereals", icon: <Leaf className="h-8 w-8 text-yellow-500" />, count: products.filter(p => p.type === 'Cereals').length },
  ];

  const completedOrders = orders.filter((o) => o.status === "completed" || o.status === "shipped");
  const totalRevenue = completedOrders.reduce((acc, o) => acc + (parseFloat(o.price) * parseFloat(o.quantity) || 0), 0);

  const stats = [
    { name: "Products", value: `${products.length} Active`, change: "Real-time sync", icon: <Package className="h-5 w-5 text-emerald-600" /> },
    { name: "Orders", value: `${orders.length}`, change: `${completedOrders.length} Completed`, icon: <ShoppingBag className="h-5 w-5 text-blue-600" /> },
    { name: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, change: "Total Earnings", icon: <IndianRupee className="h-5 w-5 text-amber-600" /> },
    { name: "Messages", value: "0 Unread", change: "Up to date", icon: <MessageSquare className="h-5 w-5 text-purple-600" /> },
  ];

  // Dynamic Sales Analytics (Group by Crop)
  let salesAnalytics: any[] = [];
  if (totalRevenue > 0) {
    const revenueByCrop: Record<string, number> = {};
    completedOrders.forEach(o => {
      if (!revenueByCrop[o.name]) revenueByCrop[o.name] = 0;
      revenueByCrop[o.name] += (parseFloat(o.price) * parseFloat(o.quantity));
    });
    salesAnalytics = Object.entries(revenueByCrop)
      .map(([crop, rev]) => ({
        crop,
        revenue: `₹${rev.toLocaleString("en-IN")}`,
        percentage: Math.round((rev / totalRevenue) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4); // Top 4
  } else {
    // Fallback if no revenue
    salesAnalytics = [
      { crop: "No Sales Yet", revenue: "₹0", percentage: 0 }
    ];
  }

  // Combine products and orders into a single activity feed
  const rawActivities = [
    ...products.map(p => ({
      text: `Listed ${p.name} (${p.quantity})`,
      time: p.date ? new Date(p.date) : new Date(),
      category: "Listing"
    })),
    ...orders.map(o => ({
      text: `Order received for ${o.name}`,
      time: o.date ? new Date(o.date) : new Date(),
      category: "Order"
    }))
  ];
  
  // Sort descending by time
  rawActivities.sort((a, b) => b.time.getTime() - a.time.getTime());
  
  // Format for UI
  const activities = rawActivities.slice(0, 4).map(a => {
    const diff = Math.floor((new Date().getTime() - a.time.getTime()) / 60000); // mins
    let timeStr = "Just now";
    if (diff > 60 * 24) timeStr = `${Math.floor(diff / (60 * 24))}d ago`;
    else if (diff > 60) timeStr = `${Math.floor(diff / 60)}h ago`;
    else if (diff > 0) timeStr = `${diff}m ago`;

    return { text: a.text, time: timeStr, category: a.category };
  });

  if (activities.length === 0) {
    activities.push({ text: "No recent activity logged.", time: "-", category: "System" });
  }

  return (
    <div className="space-y-6 max-w-[1180px] mx-auto pb-10">
      {/* 1. Welcome Header */}
      <div className="h-20 flex justify-between items-center w-full border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome, {farmerName} 👋</h1>
          <p className="text-sm text-slate-500">Here is what is happening on your farm today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-600">{currentDate}</p>
          <span className="text-xs text-slate-400">Priyanshu (Farmer)</span>
        </div>
      </div>

      {/* 2. Stats Cards Row */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="w-[278px] h-[120px] rounded-[16px] bg-white p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{stat.name}</span>
              <h3 className="text-xl font-bold text-slate-800">{stat.value}</h3>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="h-2.5 w-2.5" /> {stat.change}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Dashboard Tabs Spacer */}
      <div className="h-[2px]" />

      {/* 4. Category Cards Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Product Categories</h2>
        <div className="grid grid-cols-5 gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              name={cat.name}
              slug={cat.slug}
              icon={cat.icon}
              count={cat.count}
              className="w-[210px] h-[160px] rounded-[18px]"
            />
          ))}
        </div>
      </div>

      {/* Grid wrapper for Quick Actions + Profile Widget */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Side: Quick Actions */}
        <div className="col-span-8 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-4">
            <button 
              onClick={() => router.push("/farmer/products")}
              className="h-20 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 transition-all flex flex-col justify-center items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
            >
              <PlusCircle className="h-5 w-5 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">Add Product</span>
            </button>
            <button 
              onClick={() => router.push("/farmer/products")}
              className="h-20 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 transition-all flex flex-col justify-center items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
            >
              <ShoppingBag className="h-5 w-5 text-amber-500" />
              <span className="text-xs font-semibold text-slate-700">Create Offer</span>
            </button>
            <button 
              onClick={() => router.push("/farmer/products")}
              className="h-20 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 transition-all flex flex-col justify-center items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
            >
              <ShoppingBag className="h-5 w-5 text-blue-500" />
              <span className="text-xs font-semibold text-slate-700">Orders</span>
            </button>
            <button 
              onClick={() => router.push("/messages")}
              className="h-20 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 transition-all flex flex-col justify-center items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
            >
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <span className="text-xs font-semibold text-slate-700">Messages</span>
            </button>
          </div>
        </div>

        {/* Right Side: Profile Completion Widget */}
        <div className="col-span-4">
          <div className="w-[300px] h-[280px] rounded-[16px] bg-white border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-800">Profile Completion</h3>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">70%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "70%" }} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Aadhaar verified successfully</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                  <span>Add farm location details</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => router.push("/farmer/profile")}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              Complete Profile
            </button>
          </div>
        </div>
      </div>

      {/* 7. Analytics Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Sales Chart Wrapper */}
        <div className="col-span-8 bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm w-[760px] h-[350px] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800">Sales Analytics</h3>
              <p className="text-xs text-slate-400">Crop-wise revenue breakdown</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              +15% Growth
            </span>
          </div>

          {/* Premium CSS/SVG-based Sales Bar Chart */}
          <div className="h-48 flex items-end justify-between px-4">
            {salesAnalytics.map((sale, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-1/4">
                <div className="w-8 bg-slate-50 h-36 rounded-full relative overflow-hidden flex items-end">
                  <div 
                    className="w-full rounded-full transition-all duration-500 hover:opacity-80"
                    style={{ 
                      height: `${sale.percentage}%`,
                      background: "linear-gradient(180deg, #10b981 0%, #059669 100%)"
                    }}
                  />
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-700 truncate max-w-[120px]">{sale.crop}</p>
                  <p className="text-[10px] text-slate-400">{sale.revenue} ({sale.percentage}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Activity / Activity Feed */}
        <div className="col-span-4 bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm w-[380px] h-[350px] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activities.map((act, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="p-2 bg-slate-50 rounded-lg mt-0.5">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{act.text}</p>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {act.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => router.push("/farmer/products")}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            View All Activity <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
