"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "@/components/farmer/SidebarContext";
import NavBar from "@/components/farmer/NavBar";
import FarmerSidebar from "@/components/farmer/sidebar";
import { 
  Building2, MapPin, Calendar, Briefcase, FileText, CheckCircle,
  Package, Users, ShoppingBag, Award, Phone, Mail, Edit2, X, Star,
  Warehouse, BadgeCheck
} from "lucide-react";

export default function CompanyProfilePage() {
  const { isOpen } = useSidebar();
  const [currentDate, setCurrentDate] = useState("");

  // Company states
  const [companyName, setCompanyName] = useState("ABC Agro Pvt Ltd");
  const [industry, setIndustry] = useState("Seeds & Fertilizers");
  const [established, setEstablished] = useState("2018");
  const [description, setDescription] = useState(
    "ABC Agro Pvt Ltd is a premier supplier of high-yield seeds and organic agricultural fertilizers, serving over 10,000 farmers nationwide."
  );
  const [email, setEmail] = useState("contact@abcagro.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("Industrial Area, Sector 4, Patna, Bihar");
  const [gstin, setGstin] = useState("");
  const [warehouseAddress, setWarehouseAddress] = useState("");

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempIndustry, setTempIndustry] = useState("");
  const [tempEst, setTempEst] = useState("");
  const [tempDesc, setTempDesc] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [tempAddr, setTempAddr] = useState("");
  const [tempGstin, setTempGstin] = useState("");
  const [tempWarehouse, setTempWarehouse] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("companyName");
      if (storedName) setCompanyName(storedName);
      const storedIndustry = localStorage.getItem("companyIndustry");
      if (storedIndustry) setIndustry(storedIndustry);
      const storedEst = localStorage.getItem("companyEstablished");
      if (storedEst) setEstablished(storedEst);
      const storedDesc = localStorage.getItem("companyDescription");
      if (storedDesc) setDescription(storedDesc);
      const storedEmail = localStorage.getItem("companyEmail");
      if (storedEmail) setEmail(storedEmail);
      const storedPhone = localStorage.getItem("companyPhone");
      if (storedPhone) setPhone(storedPhone);
      const storedAddr = localStorage.getItem("companyAddress");
      if (storedAddr) setAddress(storedAddr);
      const storedGstin = localStorage.getItem("companyGstin") || "";
      setGstin(storedGstin);
      const storedWarehouse = localStorage.getItem("companyWarehouse") || "";
      setWarehouseAddress(storedWarehouse);
    }

    setCurrentDate(new Date().toLocaleDateString("en-US", {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));
  }, []);

  // Profile completion score
  const completionFields = [
    { label: "Company Name", done: !!companyName },
    { label: "Industry", done: !!industry },
    { label: "Established Year", done: !!established },
    { label: "Description", done: !!description },
    { label: "Email", done: !!email },
    { label: "Phone", done: !!phone },
    { label: "Office Address", done: !!address },
    { label: "Business GSTIN", done: !!gstin },
    { label: "Warehouse Address", done: !!warehouseAddress },
  ];
  const completionPct = Math.round(
    (completionFields.filter((f) => f.done).length / completionFields.length) * 100
  );

  const handleStartEdit = () => {
    setTempName(companyName);
    setTempIndustry(industry);
    setTempEst(established);
    setTempDesc(description);
    setTempEmail(email);
    setTempPhone(phone);
    setTempAddr(address);
    setTempGstin(gstin);
    setTempWarehouse(warehouseAddress);
    setIsEditing(true);
  };

  const handleSave = () => {
    setCompanyName(tempName);
    setIndustry(tempIndustry);
    setEstablished(tempEst);
    setDescription(tempDesc);
    setEmail(tempEmail);
    setPhone(tempPhone);
    setAddress(tempAddr);
    setGstin(tempGstin);
    setWarehouseAddress(tempWarehouse);

    if (typeof window !== "undefined") {
      localStorage.setItem("companyName", tempName);
      localStorage.setItem("companyIndustry", tempIndustry);
      localStorage.setItem("companyEstablished", tempEst);
      localStorage.setItem("companyDescription", tempDesc);
      localStorage.setItem("companyEmail", tempEmail);
      localStorage.setItem("companyPhone", tempPhone);
      localStorage.setItem("companyAddress", tempAddr);
      localStorage.setItem("companyGstin", tempGstin);
      localStorage.setItem("companyWarehouse", tempWarehouse);
    }
    setIsEditing(false);
  };

  const stats = [
    { name: "Products Offered", value: "32", icon: <Package className="h-5 w-5 text-emerald-600" /> },
    { name: "Farmers Served", value: "12,400+", icon: <Users className="h-5 w-5 text-blue-600" /> },
    { name: "Orders Completed", value: "1,850+", icon: <ShoppingBag className="h-5 w-5 text-amber-600" /> },
    { name: "Years in Business", value: `${new Date().getFullYear() - parseInt(established)} Years`, icon: <Calendar className="h-5 w-5 text-purple-600" /> },
  ];

  const categories = [
    { name: "Seeds", description: "Hybrid & high-yield crop seeds", count: 18 },
    { name: "Fertilizers", description: "Chemical & N-P-K liquid solutions", count: 12 },
    { name: "Manure", description: "Compost & vermicompost organic choices", count: 8 },
    { name: "Equipment", description: "Tractors & drip system instruments", count: 15 },
  ];

  const certifications = [
    { title: "GST Certificate Verified", body: "Government of India Registry" },
    { title: "ISO 9001:2015", body: "Quality Management Standard Certified" },
    { title: "National Fertilizer License", body: "Department of Agriculture Registry" },
  ];

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <div className={`min-h-screen bg-slate-50 transition-all duration-300 ${isOpen ? 'pl-[260px]' : 'pl-[72px]'}`}>
      <NavBar />
      <div className="flex">
        <FarmerSidebar />
        <main className="flex-1 p-6 max-w-[1180px] mx-auto space-y-6">
          
          {/* Company Banner & Header Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Banner */}
            <div className="h-44 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Header Details */}
            <div className="px-8 pb-6 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-4 -mt-10">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                {/* Avatar */}
                <div className="h-24 w-24 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-md relative z-10 flex items-center justify-center font-bold text-slate-700 text-2xl">
                  {getInitials(companyName)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-800">{companyName}</h1>
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="h-3.5 w-3.5" /> Verified Company
                    </span>
                    {gstin && (
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <BadgeCheck className="h-3.5 w-3.5" /> GST Verified
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" /> Industry: {industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" /> Established: {established}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleStartEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow transition-all font-medium text-xs cursor-pointer z-10"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Completion Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Profile Completion</h2>
                <p className="text-xs text-slate-500 mt-0.5">Complete your profile to unlock full platform features.</p>
              </div>
              <span className={`text-2xl font-bold ${completionPct === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
                {completionPct}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${completionPct === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {completionFields.map((f, i) => (
                <span key={i} className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${f.done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                  <CheckCircle className="h-3 w-3" />
                  {f.label}
                </span>
              ))}
            </div>
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column (8 cols) */}
            <div className="col-span-8 space-y-6">

              {/* Company Overview */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Company Overview</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
              </div>

              {/* Business GSTIN */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-emerald-600" /> Business GSTIN
                </h2>
                {gstin ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <BadgeCheck className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">GSTIN Number</p>
                      <p className="text-sm font-bold text-slate-800 font-mono">{gstin}</p>
                    </div>
                    <span className="ml-auto text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Verified</span>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-center space-y-2">
                    <p className="text-xs text-amber-700 font-semibold">GSTIN not added yet.</p>
                    <button onClick={handleStartEdit} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                      + Add GSTIN now
                    </button>
                  </div>
                )}
              </div>

              {/* Warehouse Address */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-blue-600" /> Warehouse Address
                </h2>
                {warehouseAddress ? (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">{warehouseAddress}</p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-center space-y-2">
                    <p className="text-xs text-amber-700 font-semibold">Warehouse address not added yet.</p>
                    <button onClick={handleStartEdit} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                      + Add Warehouse Address now
                    </button>
                  </div>
                )}
              </div>

              {/* Product Categories */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Product Categories</h2>
                <div className="grid grid-cols-2 gap-4">
                  {categories.map((cat, i) => (
                    <div key={i} className="p-4 border border-slate-50 rounded-xl bg-slate-50/50 space-y-1">
                      <h4 className="font-semibold text-slate-850 text-sm">{cat.name}</h4>
                      <p className="text-xs text-slate-400">{cat.description}</p>
                      <span className="inline-block text-[10px] font-bold text-blue-600 pt-1">
                        {cat.count} listings
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Certifications & Licenses</h2>
                <div className="space-y-3">
                  {certifications.map((cert, i) => (
                    <div key={i} className="flex gap-3 items-start p-3 bg-emerald-50/30 rounded-xl border border-emerald-50/50">
                      <Award className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{cert.title}</p>
                        <p className="text-[11px] text-slate-500">{cert.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (4 cols) */}
            <div className="col-span-4 space-y-6">
              
              {/* Statistics */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Statistics</h2>
                <div className="space-y-3">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-slate-100">
                          {stat.icon}
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{stat.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Contact Information</h2>
                <div className="space-y-3.5 text-xs text-slate-600">
                  <div className="flex gap-3 items-center">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-slate-800">{email}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-slate-800">{phone}</span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                    <span className="font-semibold text-slate-800 leading-relaxed">{address}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Edit Company Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Company Name</label>
                <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Industry</label>
                <input type="text" value={tempIndustry} onChange={(e) => setTempIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Established Year</label>
                <input type="number" value={tempEst} onChange={(e) => setTempEst(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Overview Description</label>
                <textarea value={tempDesc} onChange={(e) => setTempDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm h-20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                <input type="email" value={tempEmail} onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                <input type="text" value={tempPhone} onChange={(e) => setTempPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Office Address</label>
                <input type="text" value={tempAddr} onChange={(e) => setTempAddr(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>

              {/* Divider for new fields */}
              <div className="border-t border-dashed border-slate-200 pt-3">
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wide mb-3">Business Verification Fields</p>

                <div className="space-y-1 mb-3">
                  <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" /> Business GSTIN
                  </label>
                  <input 
                    type="text" 
                    value={tempGstin} 
                    onChange={(e) => setTempGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 22AAAAA0000A1Z5"
                    maxLength={15}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400">Enter your 15-character GST Identification Number.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                    <Warehouse className="h-3.5 w-3.5 text-blue-500" /> Warehouse Address
                  </label>
                  <textarea 
                    value={tempWarehouse} 
                    onChange={(e) => setTempWarehouse(e.target.value)}
                    placeholder="e.g. Plot 14, Industrial Zone, Patna, Bihar - 800001"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm h-20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <p className="text-[10px] text-slate-400">Full address of your primary storage/dispatch warehouse.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
