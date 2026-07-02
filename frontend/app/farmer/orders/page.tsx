"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "@/components/farmer/SidebarContext";
import NavBar from "@/components/farmer/NavBar";
import FarmerSidebar from "@/components/farmer/sidebar";
import { 
  ShoppingBag, PackageSearch, Filter, ChevronDown, CheckCircle2, 
  Clock, XCircle, Search, FileText
} from "lucide-react";

export default function OrdersPage() {
  const { isOpen } = useSidebar();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      // Sort orders by date descending (newest first)
      storedOrders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(storedOrders);
      setLoading(false);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'shipped':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'pending':
      case 'processing':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'shipped':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <PackageSearch className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status.toLowerCase() === filter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.address?.fullName || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((acc, curr) => acc + parseFloat(curr.totalAmount || curr.price), 0);

  return (
    <div className={`min-h-screen bg-slate-50 transition-all duration-300 ${isOpen ? 'pl-[260px]' : 'pl-[72px]'}`}>
      <NavBar />
      <div className="flex">
        <FarmerSidebar />
        
        <main className="flex-1 p-6 max-w-[1200px] mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-emerald-600" /> Order Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">Monitor and track your customer purchases.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <FileText className="h-4 w-4 text-emerald-600" /> Export Report
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <span className="text-sm font-semibold text-slate-500">Total Orders</span>
              <span className="text-2xl font-bold text-slate-800 mt-2">{orders.length}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between border-b-4 border-b-amber-400">
              <span className="text-sm font-semibold text-slate-500">Pending</span>
              <span className="text-2xl font-bold text-slate-800 mt-2">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between border-b-4 border-b-emerald-400">
              <span className="text-sm font-semibold text-slate-500">Completed</span>
              <span className="text-2xl font-bold text-slate-800 mt-2">
                {orders.filter(o => o.status === 'completed').length}
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between border-b-4 border-b-orange-400">
              <span className="text-sm font-semibold text-slate-500">Total Revenue</span>
              <span className="text-2xl font-bold text-slate-800 mt-2">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Orders Table Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            
            {/* Toolbar */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                {['all', 'pending', 'completed', 'cancelled'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap capitalize ${
                      filter === tab 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 flex justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
                </div>
              ) : filteredOrders.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 font-bold">
                      <th className="p-5 font-semibold">Order Details</th>
                      <th className="p-5 font-semibold">Customer</th>
                      <th className="p-5 font-semibold">Date</th>
                      <th className="p-5 font-semibold">Payment</th>
                      <th className="p-5 font-semibold">Total Amount</th>
                      <th className="p-5 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-5">
                          <p className="font-bold text-slate-800 line-clamp-1">{order.name}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">#{order.id.substring(0, 8).toUpperCase()}</p>
                        </td>
                        <td className="p-5">
                          <p className="font-semibold text-slate-700">{order.address?.fullName || "Guest User"}</p>
                          <p className="text-xs text-slate-500">{order.address?.city || "Unknown"}, {order.address?.state || "Unknown"}</p>
                        </td>
                        <td className="p-5 text-sm text-slate-600 font-medium">
                          {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="p-5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            {order.paymentMode === 'cod' ? 'COD' : 'Online'}
                          </span>
                        </td>
                        <td className="p-5">
                          <p className="font-bold text-slate-800">
                            ₹{parseFloat(order.totalAmount || order.price || 0).toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-slate-500">{order.quantity} units</p>
                        </td>
                        <td className="p-5 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-16 text-center flex flex-col items-center justify-center">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <PackageSearch className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">No orders found</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                    {searchQuery 
                      ? `We couldn't find any orders matching "${searchQuery}".` 
                      : filter !== 'all' 
                        ? `You don't have any ${filter} orders at the moment.`
                        : "You haven't received any orders yet. When customers buy your products, they will appear here."}
                  </p>
                </div>
              )}
            </div>
            
            {/* Footer Pagination (mock) */}
            {filteredOrders.length > 0 && (
              <div className="p-5 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-white">
                <span>Showing {filteredOrders.length} of {orders.length} orders</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                  <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
