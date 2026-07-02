"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "@/components/farmer/SidebarContext";
import NavBar from "@/components/farmer/NavBar";
import FarmerSidebar from "@/components/farmer/sidebar";
import { 
  TrendingUp, TrendingDown, Calendar, Download, Search, 
  ArrowUpRight, ArrowDownRight, Compass, Send, Sparkles, 
  AlertTriangle, CheckCircle2, Clock
} from "lucide-react";

export default function AnalyticsPage() {
  const { isOpen } = useSidebar();
  const [timeFilter, setTimeFilter] = useState("30 Days");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
      setProducts(storedProducts);
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(storedOrders);
    }
  }, []);

  // Compute stats dynamically from database arrays (or 0 if unperformed actions)
  const completedOrders = orders.filter(o => o.status === "completed" || o.status === "shipped");
  const totalRevenueVal = completedOrders.reduce((acc, o) => acc + (parseFloat(o.price) * parseFloat(o.quantity) || 0), 0);
  const activeListingsCount = products.length;
  const uniqueFarmersCount = new Set(products.map(p => p.farmerName).filter(Boolean)).size;

  const kpiData = [
    { 
      name: "Total Revenue", 
      value: `₹${totalRevenueVal.toLocaleString("en-IN")}`, 
      trend: "0%", 
      isPositive: true, 
      prevMonth: "no transaction records yet", 
      sparkline: [0, 0, 0, 0, 0, 0, 0] 
    },
    { 
      name: "Orders Completed", 
      value: `${completedOrders.length}`, 
      trend: "0%", 
      isPositive: true, 
      prevMonth: "no completed orders yet", 
      sparkline: [0, 0, 0, 0, 0, 0, 0] 
    },
    { 
      name: "Active Listings", 
      value: `${activeListingsCount}`, 
      trend: activeListingsCount > 0 ? "+100%" : "0%", 
      isPositive: activeListingsCount > 0, 
      prevMonth: activeListingsCount > 0 ? "active listings catalog" : "no listings created yet", 
      sparkline: activeListingsCount > 0 ? [0, 2, 5, activeListingsCount, activeListingsCount, activeListingsCount] : [0, 0, 0, 0, 0, 0, 0] 
    },
    { 
      name: "Farmers Reached", 
      value: `${uniqueFarmersCount}`, 
      trend: uniqueFarmersCount > 0 ? "+100%" : "0%", 
      isPositive: uniqueFarmersCount > 0, 
      prevMonth: uniqueFarmersCount > 0 ? "active connections" : "no farmers reached yet", 
      sparkline: uniqueFarmersCount > 0 ? [0, 1, 2, uniqueFarmersCount, uniqueFarmersCount, uniqueFarmersCount] : [0, 0, 0, 0, 0, 0, 0] 
    }
  ];

  // Dynamic Revenue Chart coordinates mockup (zero state baseline or active curve)
  const flatLine = "M 0 180 L 1200 180";
  const revenuePoints: Record<string, string> = {
    "7 Days": totalRevenueVal > 0 ? "M 0 180 Q 150 150 300 160 T 600 120 T 900 100 T 1200 80" : flatLine,
    "30 Days": totalRevenueVal > 0 ? "M 0 180 Q 150 140 300 150 T 600 110 T 900 90 T 1200 60" : flatLine,
    "3 Months": totalRevenueVal > 0 ? "M 0 180 Q 150 130 300 120 T 600 95 T 900 70 T 1200 40" : flatLine,
    "1 Year": totalRevenueVal > 0 ? "M 0 180 Q 150 120 300 100 T 600 80 T 900 50 T 1200 20" : flatLine
  };

  // Dynamic Categories distribution
  const totalItems = products.length;
  const categoriesList = ["seeds", "fertilizers", "organic-manure", "farm-equipment", "irrigation", "animal-feed", "solar-agri", "crop-protection"];
  const categoriesColors = [
    "bg-emerald-600", "bg-emerald-500", "bg-teal-500", "bg-blue-600", 
    "bg-cyan-500", "bg-amber-500", "bg-indigo-500", "bg-red-500"
  ];
  
  const categoryFreq = products.reduce((acc: Record<string, number>, p: any) => {
    const type = p.type?.toLowerCase() || "";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const dynamicCategories = categoriesList.map((cat, i) => {
    const count = categoryFreq[cat] || 0;
    const pct = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
    const label = cat.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return { name: label, pct, color: categoriesColors[i] };
  });

  // Dynamic Geographic distribution
  const locationFreq = products.reduce((acc: Record<string, number>, p: any) => {
    const loc = p.location?.toLowerCase() || "";
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  const locationsList = ["punjab", "haryana", "uttar pradesh", "bihar", "maharashtra"];
  const locationsColors = ["bg-emerald-800", "bg-emerald-700", "bg-emerald-500", "bg-emerald-400", "bg-emerald-200"];
  const dynamicLocations = locationsList.map((loc, i) => {
    const count = locationFreq[loc] || 0;
    const pct = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
    const label = loc.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return { name: label, pct, color: locationsColors[i] };
  });

  // Top Selling Products based on actual inputs
  const topProducts = products.slice(0, 4).map((p, i) => {
    const pcts = [90, 70, 55, 35];
    return {
      name: p.name,
      conversion: "0.0%",
      sales: "0 units",
      pct: pcts[i] || 30
    };
  });

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;
    
    const query = aiMessage.toLowerCase();
    if (query.includes("price") || query.includes("wheat")) {
      setAiResponse("Kisaan AI: Wheat prices in Bihar are projected to rise by 7% due to low regional stock levels. Recommended action: Hold stock for another 10 days to maximize returns.");
    } else if (query.includes("weather") || query.includes("rain")) {
      setAiResponse("Kisaan AI: Monsoonal rainfall is expected to be normal (98% of LPA) over north India. Prepare drip systems to regulate supply in case of localized dry spells.");
    } else {
      setAiResponse("Kisaan AI: Demand for hybrid seeds and nitrogenous fertilizers is peaking in Punjab. Let me know if you would like me to compile a suppliers index.");
    }
    setAiMessage("");
  };

  return (
    <div className={`min-h-screen bg-slate-50 transition-all duration-300 ${isOpen ? 'pl-[260px]' : 'pl-[72px]'}`}>
      <NavBar />
      <div className="flex">
        <FarmerSidebar />
        <main className="flex-1 p-6 max-w-[1180px] mx-auto space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Analytics</h1>
              <p className="text-sm text-slate-500 mt-1">Real-time marketplace intelligence & operational performance.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search insights..." 
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span>June 2026</span>
              </div>

              {/* Export */}
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer">
                <Download className="h-4 w-4" /> Export Report
              </button>
            </div>
          </div>

          {/* Section 1 - KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[18px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-36">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.name}</span>
                  <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                    kpi.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  }`}>
                    {kpi.isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                    {kpi.trend}
                  </span>
                </div>
                
                <div className="flex justify-between items-end mt-2">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">{kpi.value}</h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{kpi.prevMonth}</p>
                  </div>
                  {/* Sparkline Visual */}
                  <svg className="w-20 h-10 overflow-visible" viewBox="0 0 100 40">
                    <path 
                      d={`M ${kpi.sparkline.map((val, i) => `${(i * 100) / (kpi.sparkline.length - 1)} ${40 - (val * 40) / 100}`).join(" L ")}`} 
                      fill="none" 
                      stroke={kpi.isPositive ? "#10b981" : "#ef4444"} 
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Section 2 - Revenue Analytics */}
          <div className="bg-white p-6 rounded-[18px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Revenue Trends</h3>
                <p className="text-xs text-slate-400">Total marketplace revenue flow over time.</p>
              </div>
              {/* Time filters */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-150 gap-1 text-xs">
                {["7 Days", "30 Days", "3 Months", "1 Year"].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      timeFilter === t ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Area Chart */}
            <div className="relative h-64 w-full bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area path */}
                <path 
                  d={`${revenuePoints[timeFilter]} L 1200 200 L 0 200 Z`} 
                  fill="url(#areaGrad)" 
                />
                {/* Line path */}
                <path 
                  d={revenuePoints[timeFilter]} 
                  fill="none" 
                  stroke="#059669" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
              </svg>
              {/* Tooltip overlay */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Revenue: ₹{totalRevenueVal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Section 3 & 4 - Product Performance & Order Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Card: Product Performance */}
            <div className="bg-white p-6 rounded-[18px] border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Top Selling Products</h3>
                <p className="text-xs text-slate-400">Products driving highest marketplace volume.</p>
              </div>

              <div className="space-y-4 pt-2">
                {topProducts.length > 0 ? (
                  topProducts.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{item.name}</span>
                        <span>CR: {item.conversion} • {item.sales}</span>
                      </div>
                      <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-8">No products listed in system yet.</p>
                )}
              </div>
            </div>

            {/* Right Card: Order Analytics (Donut chart representation) */}
            <div className="bg-white p-6 rounded-[18px] border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Order Analytics</h3>
                <p className="text-xs text-slate-400">Order fulfillment lifecycle distribution.</p>
              </div>

              <div className="flex items-center justify-around py-4">
                {/* SVG Donut */}
                <div className="relative h-32 w-32">
                  <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                    {completedOrders.length > 0 ? (
                      <>
                        {/* Completed orders slice */}
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="100 100" strokeDashoffset="0" />
                      </>
                    ) : null}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base font-black text-slate-800">{orders.length}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Total</span>
                  </div>
                </div>

                <div className="space-y-2 text-[11px] font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> 
                    Completed: {orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 0}%
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> 
                    Processing: {orders.length > 0 ? Math.round((orders.filter(o => o.status === "processing").length / orders.length) * 100) : 0}%
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> 
                    Pending: {orders.length > 0 ? Math.round((orders.filter(o => o.status === "pending").length / orders.length) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Section 5 & 6 - Category & Geographic Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Category Analytics */}
            <div className="bg-white p-6 rounded-[18px] border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Category Analytics</h3>
                <p className="text-xs text-slate-400">Distribution of products listed across major agricultural departments.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600 pt-2">
                {dynamicCategories.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-slate-400">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Analytics */}
            <div className="bg-white p-6 rounded-[18px] border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Geographic Analytics</h3>
                <p className="text-xs text-slate-400">Sales volume intensity maps across states.</p>
              </div>

              <div className="flex items-center gap-4 justify-around py-2">
                <svg className="w-32 h-32 text-emerald-700 overflow-visible" viewBox="0 0 100 100">
                  <rect x="25" y="20" width="15" height="10" rx="3" fill="#047857" opacity={totalItems > 0 ? 0.9 : 0.1} />
                  <rect x="42" y="22" width="12" height="8" rx="2" fill="#059669" opacity={totalItems > 0 ? 0.8 : 0.1} />
                  <rect x="35" y="32" width="22" height="15" rx="4" fill="#10b981" opacity={totalItems > 0 ? 0.7 : 0.1} />
                  <rect x="60" y="35" width="15" height="10" rx="3" fill="#34d399" opacity={totalItems > 0 ? 0.6 : 0.1} />
                  <rect x="30" y="50" width="20" height="15" rx="4" fill="#a7f3d0" opacity={totalItems > 0 ? 0.5 : 0.1} />
                  
                  <text x="27" y="16" fontSize="5" fontWeight="bold" fill="#065f46">Punjab</text>
                  <text x="62" y="31" fontSize="5" fontWeight="bold" fill="#065f46">Bihar</text>
                  <text x="18" y="58" fontSize="5" fontWeight="bold" fill="#065f46">Maharashtra</text>
                </svg>

                <div className="space-y-2 text-[10px] font-bold text-slate-600">
                  {dynamicLocations.map((loc, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${loc.color}`} />
                      <span>{loc.name} ({loc.pct}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
          {/* Section 8 - Smart Insights */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Smart Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { text: "Wheat demand increasing in Bihar regional zones", type: "demand" },
                { text: "Tomato prices expected to rise by 12% next week", type: "price" },
                { text: "Rainfall warning may reduce maize harvest yields", type: "weather" },
                { text: "Fertilizer purchase inquiries surging in Punjab", type: "inquiry" }
              ].map((insight, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-3 items-start hover:-translate-y-0.5 transition-transform">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    {insight.type === "demand" ? <TrendingUp className="h-4 w-4 text-emerald-600" /> :
                     insight.type === "price" ? <ArrowUpRight className="h-4 w-4 text-amber-500" /> :
                     insight.type === "weather" ? <AlertTriangle className="h-4 w-4 text-blue-500" /> :
                     <Sparkles className="h-4 w-4 text-purple-500" />}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed mt-0.5">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 9 & 10 - Inventory Health & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Inventory Health */}
            <div className="bg-white p-6 rounded-[18px] border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Inventory Health</h3>
                <p className="text-xs text-slate-400">Track and monitor your stock thresholds.</p>
              </div>

              <div className="space-y-4 pt-2">
                {[
                  { label: "Healthy Inventory", val: activeListingsCount > 0 ? "100%" : "0%", percent: activeListingsCount > 0 ? 100 : 0, color: "bg-emerald-500" },
                  { label: "Low Stock Alert", val: "0%", percent: 0, color: "bg-amber-500" },
                  { label: "Critical Stock", val: "0%", percent: 0, color: "bg-red-500" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>{item.label}</span>
                      <span>{item.val}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white p-6 rounded-[18px] border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Recent Activity</h3>
                <p className="text-xs text-slate-400">Timeline logs from connected partners.</p>
              </div>

              <div className="space-y-4 pt-2">
                {products.length > 0 ? (
                  products.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-xs">
                      <div className="mt-0.5"><CheckCircle2 className="text-emerald-500 h-4 w-4" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800">Product listed successfully</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Added {item.name} ({item.quantity}) • Just now</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-8">No recent activity logged.</p>
                )}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
