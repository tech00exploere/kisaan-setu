"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "@/components/farmer/SidebarContext";
import NavBar from "@/components/farmer/NavBar";
import FarmerSidebar from "@/components/farmer/sidebar";
import { 
  MapPin, Calendar, Percent, ShieldCheck, LandPlot, Sprout, Wheat,
  Award, Star, Package, ShoppingBag, IndianRupee, MessageSquare, Edit2, X, CheckCircle
} from "lucide-react";

export default function FarmerProfilePage() {
  const { isOpen } = useSidebar();
  const [currentDate, setCurrentDate] = useState("");
  const [farmerName, setFarmerName] = useState("Priyanshu Kumar");
  const [location, setLocation] = useState("Bihar");
  const [landArea, setLandArea] = useState("12");
  const [primaryCrops, setPrimaryCrops] = useState("Wheat, Rice, Maize");
  const [farmingType, setFarmingType] = useState("Organic");

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempLoc, setTempLoc] = useState("");
  const [tempLand, setTempLand] = useState("");
  const [tempCrops, setTempCrops] = useState("");
  const [tempType, setTempType] = useState("");
  const [farmerImage, setFarmerImage] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);

  // Aadhaar verification state
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarStep, setAadhaarStep] = useState<'input' | 'otp' | 'done'>('input');
  const [otpValue, setOtpValue] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");
  const [otpSending, setOtpSending] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("farmerName");
      if (storedName) setFarmerName(storedName);

      const storedLoc = localStorage.getItem("farmerLocation");
      if (storedLoc) setLocation(storedLoc);

      const storedLand = localStorage.getItem("farmerLandArea");
      if (storedLand) setLandArea(storedLand);

      const storedCrops = localStorage.getItem("farmerPrimaryCrops");
      if (storedCrops) setPrimaryCrops(storedCrops);

      const storedType = localStorage.getItem("farmerFarmingType");
      if (storedType) setFarmingType(storedType);

      const storedImage = localStorage.getItem("farmerImage");
      if (storedImage) setFarmerImage(storedImage);

      const storedAadhaar = localStorage.getItem("farmerAadhaarNumber");
      if (storedAadhaar) setAadhaarNumber(storedAadhaar);
      const storedAadhaarVerified = localStorage.getItem("farmerAadhaarVerified");
      if (storedAadhaarVerified === "true") {
        setAadhaarVerified(true);
        setAadhaarStep('done');
      }

      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
      setProducts(storedProducts);

      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(storedOrders);

      // Reviews logic
      let storedReviews = JSON.parse(localStorage.getItem("reviews") || "null");
      if (!storedReviews) {
        // Fallback demo data if no reviews exist
        storedReviews = [
          { id: 1, user: "BigBasket Procurement", rating: 5, date: "2 weeks ago", comment: "Excellent grain quality and professional packaging. Delivery was prompt." },
          { id: 2, user: "Reliance Fresh Manager", rating: 4, date: "1 month ago", comment: "Tomatoes were fresh and high quality. Will order again next harvest cycle." },
        ];
        localStorage.setItem("reviews", JSON.stringify(storedReviews));
      }
      setReviews(storedReviews);
    }
    setCurrentDate(new Date().toLocaleDateString("en-US", {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));
  }, []);

  const handleStartEdit = () => {
    setTempName(farmerName);
    setTempLoc(location);
    setTempLand(landArea);
    setTempCrops(primaryCrops);
    setTempType(farmingType);
    setTempImage(farmerImage);
    setAadhaarError("");
    setIsEditing(true);
  };

  const handleSendOtp = () => {
    const digits = aadhaarNumber.replace(/\s/g, '');
    if (!/^\d{12}$/.test(digits)) {
      setAadhaarError("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    setAadhaarError("");
    setOtpSending(true);
    // Simulate OTP sending delay
    setTimeout(() => {
      setOtpSending(false);
      setAadhaarStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = () => {
    // Simulate OTP check (any 6-digit code accepted for demo)
    if (!/^\d{6}$/.test(otpValue)) {
      setAadhaarError("Please enter a valid 6-digit OTP.");
      return;
    }
    setAadhaarError("");
    setAadhaarVerified(true);
    setAadhaarStep('done');
    if (typeof window !== "undefined") {
      localStorage.setItem("farmerAadhaarNumber", aadhaarNumber);
      localStorage.setItem("farmerAadhaarVerified", "true");
    }
  };

  const handleSave = () => {
    setFarmerName(tempName);
    setLocation(tempLoc);
    setLandArea(tempLand);
    setPrimaryCrops(tempCrops);
    setFarmingType(tempType);
    if (tempImage) setFarmerImage(tempImage);

    if (typeof window !== "undefined") {
      localStorage.setItem("farmerName", tempName);
      localStorage.setItem("farmerLocation", tempLoc);
      localStorage.setItem("farmerLandArea", tempLand);
      localStorage.setItem("farmerPrimaryCrops", tempCrops);
      localStorage.setItem("farmerFarmingType", tempType);
      if (tempImage) localStorage.setItem("farmerImage", tempImage);
    }
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Compute dynamic stats
  const completedOrders = orders.filter((o) => o.status === "completed" || o.status === "shipped");
  const totalRevenueVal = completedOrders.reduce((acc, o) => acc + (parseFloat(o.price) * parseFloat(o.quantity) || 0), 0);
  const userProducts = products; // or products.filter(p => p.farmerName === farmerName) if multi-user on same browser
  
  // Calculate dynamic farmer rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "New";

  // Profile completion
  const completionFields = [
    { label: "Full Name", done: !!farmerName },
    { label: "Location", done: !!location },
    { label: "Land Area", done: !!landArea },
    { label: "Primary Crops", done: !!primaryCrops },
    { label: "Farming Type", done: !!farmingType },
    { label: "Profile Photo", done: !!farmerImage },
    { label: "Aadhaar Verified", done: aadhaarVerified },
  ];
  const completionPct = Math.round(
    (completionFields.filter((f) => f.done).length / completionFields.length) * 100
  );

  const stats = [
    { name: "Products Listed", value: `${userProducts.length}`, icon: <Package className="h-5 w-5 text-emerald-600" /> },
    { name: "Orders Completed", value: `${completedOrders.length}`, icon: <ShoppingBag className="h-5 w-5 text-blue-600" /> },
    { name: "Revenue Earned", value: `₹${totalRevenueVal.toLocaleString("en-IN")}`, icon: <IndianRupee className="h-5 w-5 text-amber-600" /> },
    { name: "Farmer Rating", value: `${avgRating} ${avgRating !== "New" ? "★" : ""}`, icon: <Star className="h-5 w-5 text-purple-600" /> },
  ];

  const activeListings = userProducts.map((p) => {
    const qty = parseFloat(p.quantity);
    let statusStr = "In Stock";
    if (qty < 20) statusStr = "Low Stock";
    if (qty === 0) statusStr = "Out of Stock";

    return {
      crop: p.name,
      price: p.price,
      quantity: p.quantity,
      category: p.type || "Other",
      status: statusStr
    };
  });

  // Helper to extract name initials (e.g. Priyanshu Kumar -> PK)
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`min-h-screen bg-slate-50 transition-all duration-300 ${isOpen ? 'pl-[260px]' : 'pl-[72px]'}`}>
      <NavBar />
      <div className="flex">
        <FarmerSidebar />
        <main className="flex-1 p-6 max-w-[1180px] mx-auto space-y-6">
          
          {/* Profile Cover & Header Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Profile Cover (Styled Gradient) */}
            <div className="h-44 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Profile Header Details */}
            <div className="px-8 pb-6 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-4 -mt-10">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                {/* Photo / Avatar */}
                <div 
                  className="h-24 w-24 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-md relative z-10 flex items-center justify-center font-bold text-slate-500 text-2xl"
                  style={farmerImage ? { backgroundImage: `url(${farmerImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                >
                  {!farmerImage && getInitials(farmerName)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-800">{farmerName}</h1>
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified Farmer
                    </span>
                    {aadhaarVerified && (
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="h-3.5 w-3.5" /> Aadhaar Verified
                      </span>
                    )}
                  </div>
                  
                  {/* Meta items */}
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" /> Member since 2026
                    </span>
                    <span className="flex items-center gap-1">
                      <Percent className="h-3.5 w-3.5 text-slate-400" /> Response Rate: 95%
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleStartEdit}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm hover:shadow transition-all font-medium text-xs cursor-pointer z-10"
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
                <p className="text-xs text-slate-500 mt-0.5">Complete your profile to increase trust with buyers.</p>
              </div>
              <span className={`text-2xl font-bold ${completionPct === 100 ? 'text-emerald-600' : 'text-orange-500'}`}>
                {completionPct}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${completionPct === 100 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {completionFields.map((f, i) => (
                <span key={i} className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  f.done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  <CheckCircle className="h-3 w-3" />
                  {f.label}
                </span>
              ))}
            </div>
          </div>

          {/* Grid Layout: Farm Info & Active Listings | Statistics */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Column (8 cols): Farm Info, Active Listings, Reviews */}
            <div className="col-span-8 space-y-6">
              
              {/* Farm Information */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Farm Information</h2>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Land Area</span>
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <LandPlot className="h-4 w-4 text-slate-500" />
                      <span>{landArea} Acres</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Primary Crops</span>
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Wheat className="h-4 w-4 text-slate-500" />
                      <span>{primaryCrops}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Farming Type</span>
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Sprout className="h-4 w-4 text-slate-500" />
                      <span>{farmingType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Listings */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Active Listings</h2>
                <div className="divide-y divide-slate-100">
                  {activeListings.map((list, i) => (
                    <div key={i} className="py-3.5 flex justify-between items-center first:pt-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-800 text-sm">{list.crop}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{list.category}</span>
                          <span>•</span>
                          <span>Quantity: {list.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-bold text-slate-800">₹{list.price}</p>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          list.status === "Low Stock" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {list.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews & Ratings */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Reviews & Ratings</h2>
                <div className="space-y-5">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="space-y-2 pb-4 border-b border-slate-50 last:pb-0 last:border-b-0">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700">{rev.user}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-amber-500">{"★".repeat(rev.rating)}</span>
                          <span className="text-slate-400">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (4 cols): Statistics Card */}
            <div className="col-span-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Statistics</h2>
                <div className="space-y-4">
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
            </div>

          </div>

        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Edit Profile Details</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div 
                    className="h-16 w-16 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center text-slate-400 font-bold"
                    style={tempImage ? { backgroundImage: `url(${tempImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                  >
                    {!tempImage && "img"}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Location / State</label>
                <input 
                  type="text" 
                  value={tempLoc} 
                  onChange={(e) => setTempLoc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Land Area (Acres)</label>
                <input 
                  type="number" 
                  value={tempLand} 
                  onChange={(e) => setTempLand(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Primary Crops</label>
                <input 
                  type="text" 
                  value={tempCrops} 
                  onChange={(e) => setTempCrops(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Farming Type</label>
                <select 
                  value={tempType} 
                  onChange={(e) => setTempType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="Organic">Organic</option>
                  <option value="Conventional">Conventional</option>
                  <option value="Hydroponic">Hydroponic</option>
                </select>
              </div>

              {/* Aadhaar Verification Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Aadhaar Verification</label>
                  {aadhaarVerified && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      <CheckCircle className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>

                {aadhaarStep === 'done' ? (
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-blue-700">Aadhaar Successfully Verified</p>
                      <p className="text-[11px] text-blue-500">XXXX XXXX {aadhaarNumber.replace(/\s/g, '').slice(-4)}</p>
                    </div>
                  </div>
                ) : aadhaarStep === 'otp' ? (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-500">A 6-digit OTP has been sent to the mobile number linked with your Aadhaar.</p>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm tracking-widest font-mono"
                    />
                    {aadhaarError && <p className="text-xs text-red-500">{aadhaarError}</p>}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setAadhaarStep('input'); setOtpValue(''); setAadhaarError(''); }}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        Change Number
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Verify OTP
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={14}
                        value={aadhaarNumber}
                        onChange={(e) => {
                          // Format as XXXX XXXX XXXX
                          const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                          const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                          setAadhaarNumber(formatted);
                        }}
                        placeholder="XXXX XXXX XXXX"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpSending}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer"
                      >
                        {otpSending ? 'Sending…' : 'Send OTP'}
                      </button>
                    </div>
                    {aadhaarError && <p className="text-xs text-red-500">{aadhaarError}</p>}
                    <p className="text-[11px] text-slate-400">Your Aadhaar number is encrypted and stored securely. We only verify identity — we never share this data.</p>
                  </div>
                )}
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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl cursor-pointer"
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
