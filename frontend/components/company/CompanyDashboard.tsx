"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CategoryCard from "@/components/farmer/category-card";
import { 
  Sprout, FlaskConical, Leaf, Tractor, Droplet, Milk, Sun, Shield,
  PlusCircle, FilePlus, ShoppingBag, Warehouse, TrendingUp, Users, 
  IndianRupee, Package, Activity, Clock, CheckCircle, MessageSquare,
  UserCheck, ShieldAlert, ChevronRight
} from "lucide-react";

export default function CompanyDashboard() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("en-US", {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));

    if (typeof window !== "undefined") {
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
      setProducts(storedProducts);
      
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(storedOrders);
    }
  }, []);

  const completedOrders = orders.filter((o) => o.status === "completed" || o.status === "shipped");
  const totalRevenue = completedOrders.reduce((acc, o) => acc + (parseFloat(o.price) * parseFloat(o.quantity) || 0), 0);

  const stats = [
    { name: "Products", value: `${products.length}`, change: "Active listings", icon: <Package className="h-5 w-5 text-emerald-600" /> },
    { name: "Orders", value: `${orders.length}`, change: `${completedOrders.length} Completed`, icon: <ShoppingBag className="h-5 w-5 text-blue-600" /> },
    { name: "Revenue", value: `₹${(totalRevenue / 100000).toFixed(2)}L`, change: `Total: ₹${totalRevenue.toLocaleString("en-IN")}`, icon: <IndianRupee className="h-5 w-5 text-amber-600" /> },
    { name: "Farmers Connected", value: new Set(orders.map(o => o.address?.fullName || "Guest")).size.toString(), change: "Unique buyers", icon: <Users className="h-5 w-5 text-purple-600" /> },
  ];

  const services = [
    { name: "Seeds", slug: "seeds", icon: <Sprout className="h-8 w-8 text-green-600" />, count: products.filter(p => p.type === 'Seeds').length },
    { name: "Fertilizers", slug: "fertilizers", icon: <FlaskConical className="h-8 w-8 text-yellow-600" />, count: products.filter(p => p.type === 'Fertilizers').length },
    { name: "Equipment", slug: "farm-equipment", icon: <Tractor className="h-8 w-8 text-gray-600" />, count: products.filter(p => p.type === 'Equipment').length },
    { name: "Irrigation", slug: "irrigation", icon: <Droplet className="h-8 w-8 text-blue-600" />, count: products.filter(p => p.type === 'Irrigation').length },
    { name: "Feed", slug: "animal-feed", icon: <Milk className="h-8 w-8 text-orange-600" />, count: products.filter(p => p.type === 'Feed').length },
    { name: "Crop Protection", slug: "crop-protection", icon: <Shield className="h-8 w-8 text-red-600" />, count: products.filter(p => p.type === 'Crop Protection').length },
    { name: "AgriTech", slug: "solar-agri", icon: <Sun className="h-8 w-8 text-yellow-500" />, count: products.filter(p => p.type === 'AgriTech').length },
    { name: "Services", slug: "organic-manure", icon: <Leaf className="h-8 w-8 text-amber-800" />, count: products.filter(p => p.type === 'Services').length },
  ];

  const [farmerRequests] = useState([
    { id: 1, farmer: "Ramesh Patel", item: "Hybrid Maize Seeds (50 Bags)", date: "2 hrs ago", status: "Pending" },
    { id: 2, farmer: "Suresh Kumar", item: "Drip Irrigation Setup Quote", date: "4 hrs ago", status: "Responded" },
    { id: 3, farmer: "Mahesh Singh", item: "Organic Fertilizer N-P-K (20 Bags)", date: "Yesterday", status: "Pending" },
  ]);

  // Inventory based on real products
  const inventory = products.slice(0, 3).map(p => {
    const qty = parseFloat(p.quantity);
    let status = "In Stock";
    let percent = 80;
    if (qty <= 5) { status = "Critical"; percent = 10; }
    else if (qty <= 20) { status = "Low Stock"; percent = 30; }
    
    return { item: p.name, stock: `${qty} Units`, status, percent };
  });

  if (inventory.length === 0) {
    inventory.push({ item: "No Products", stock: "0 Units", status: "Critical", percent: 0 });
  }

  // Combine products and orders into a single activity feed
  const rawActivities = [
    ...products.map(p => ({
      title: `Added product ${p.name} (${p.quantity})`,
      time: p.date ? new Date(p.date) : new Date(),
      type: "update"
    })),
    ...orders.map(o => ({
      title: `Order received for ${o.name}`,
      time: o.date ? new Date(o.date) : new Date(),
      type: "order"
    }))
  ];
  rawActivities.sort((a, b) => b.time.getTime() - a.time.getTime());
  
  const activities = rawActivities.slice(0, 3).map(a => {
    const diff = Math.floor((new Date().getTime() - a.time.getTime()) / 60000); // mins
    let timeStr = "Just now";
    if (diff > 60 * 24) timeStr = `${Math.floor(diff / (60 * 24))}d ago`;
    else if (diff > 60) timeStr = `${Math.floor(diff / 60)}h ago`;
    else if (diff > 0) timeStr = `${diff}m ago`;

    return { title: a.title, time: timeStr, type: a.type };
  });

  if (activities.length === 0) {
    activities.push({ title: "No recent activity logged.", time: "-", type: "user" });
  }

  // Dynamic Sales Analytics
  const colors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-purple-500"];
  let salesAnalytics: any[] = [];
  if (totalRevenue > 0) {
    const revenueByCat: Record<string, number> = {};
    completedOrders.forEach(o => {
      const p = products.find(x => x.id === o.productId);
      const cat = p?.type || "Others";
      if (!revenueByCat[cat]) revenueByCat[cat] = 0;
      revenueByCat[cat] += (parseFloat(o.price) * parseFloat(o.quantity));
    });
    
    salesAnalytics = Object.entries(revenueByCat)
      .map(([label, rev], idx) => ({
        label,
        revenue: `₹${(rev / 1000).toFixed(1)}K`,
        percentage: Math.round((rev / totalRevenue) * 100),
        color: colors[idx % colors.length]
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4);
  } else {
    salesAnalytics = [
      { label: "No Sales", revenue: "₹0", percentage: 0, color: "bg-slate-300" }
    ];
  }

  return (
    <div className="space-y-6 max-w-[1180px] mx-auto pb-10">
      {/* 1. Welcome Header */}
      <div className="h-20 flex justify-between items-center w-full border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back 👋</h1>
          <p className="text-sm text-slate-500">Manage products, orders, inventories, and farmer relationships.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-600">{currentDate}</p>
          <span className="text-xs text-slate-400">Company Portal</span>
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
        <h2 className="text-lg font-bold text-slate-800">Company Services & Categories</h2>
        <div className="grid grid-cols-4 gap-5">
          {services.map((svc) => (
            <CategoryCard
              key={svc.slug}
              name={svc.name}
              slug={svc.slug}
              icon={svc.icon}
              count={svc.count}
              className="w-[270px] h-[170px] rounded-[18px]"
            />
          ))}
        </div>
      </div>

      {/* Grid wrapper for Quick Actions + Profile Widget */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Side: Quick Actions (8 cols) */}
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
              <FilePlus className="h-5 w-5 text-amber-500" />
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

        {/* Right Side: Profile Completion Widget (4 cols) */}
        <div className="col-span-4">
          <div className="w-[300px] h-[280px] rounded-[16px] bg-white border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-800">Profile Completion</h3>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">85%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Business GSTIN verified</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Warehouse addresses added</span>
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
        {/* Left: Sales Chart (8 cols) */}
        <div className="col-span-8 bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm w-[760px] h-[350px] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800">Sales Analytics</h3>
              <p className="text-xs text-slate-400">Category-wise monthly sales performance</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              +24% vs Last Q
            </span>
          </div>

          {/* Premium CSS/SVG-based Sales Bar Chart */}
          <div className="h-48 flex items-end justify-between px-4">
            {salesAnalytics.map((sale, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-1/4">
                <div className="w-8 bg-slate-50 h-36 rounded-full relative overflow-hidden flex items-end">
                  <div 
                    className={`w-full rounded-full transition-all duration-500 hover:opacity-80 ${sale.color}`}
                    style={{ 
                      height: `${sale.percentage}%`,
                    }}
                  />
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-700 truncate max-w-[120px]">{sale.label}</p>
                  <p className="text-[10px] text-slate-400">{sale.revenue} ({sale.percentage}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Activity / Activity Feed (4 cols) */}
        <div className="col-span-4 bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm w-[380px] h-[350px] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activities.map((act, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="p-2 bg-slate-50 rounded-lg mt-0.5">
                    {act.type === "order" ? <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> :
                     act.type === "update" ? <Activity className="h-3.5 w-3.5 text-blue-600" /> :
                     <Clock className="h-3.5 w-3.5 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{act.title}</p>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
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

      {/* 8. Company Specific Section (Below Analytics) */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Farmer Requests */}
        <div className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm h-[300px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Farmer Requests</h3>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Live feed</span>
            </div>
            <div className="divide-y divide-slate-100">
              {farmerRequests.map((req) => (
                <div key={req.id} className="py-2.5 flex justify-between items-center first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-850">{req.farmer}</p>
                    <p className="text-[11px] text-slate-500">{req.item}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    req.status === "Pending" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Inventory Status */}
        <div className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-sm h-[300px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Inventory Status</h3>
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Stock levels</span>
            </div>
            <div className="space-y-3.5">
              {inventory.map((inv, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{inv.item}</span>
                    <span className={`font-bold ${
                      inv.status === "Critical" ? "text-red-500" : inv.status === "Low Stock" ? "text-amber-500" : "text-emerald-500"
                    }`}>{inv.stock}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        inv.status === "Critical" ? "bg-red-500" : inv.status === "Low Stock" ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${inv.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
