"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, ShieldCheck, MapPin, CreditCard, Banknote,
  CheckCircle2, Loader2, Minus, Plus
} from "lucide-react";
import NavBar from "@/components/farmer/NavBar";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: ""
  });
  const [paymentMode, setPaymentMode] = useState("cod");
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"card" | "otp" | "processing">("card");

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
      const found = storedProducts.find((p: any) => p.id === id);
      setProduct(found || null);
      setLoading(false);
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const completeOrder = () => {
    // 1. Deduct quantity from products
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const productIndex = storedProducts.findIndex((p: any) => p.id === id);
    
    if (productIndex !== -1) {
      const currentQty = parseFloat(storedProducts[productIndex].quantity);
      if (currentQty >= buyQuantity) {
        storedProducts[productIndex].quantity = (currentQty - buyQuantity).toString();
        localStorage.setItem("products", JSON.stringify(storedProducts));

        // 2. Create Order
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const newOrder = {
          id: crypto.randomUUID(),
          productId: id,
          name: product.name,
          price: product.price,
          quantity: buyQuantity.toString(),
          totalAmount: (parseFloat(product.price) * buyQuantity).toString(),
          paymentMode,
          address,
          status: "completed", // Auto-complete for demo purposes to reflect in stats
          date: new Date().toISOString()
        };
        storedOrders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(storedOrders));

        setIsProcessing(false);
        setShowPaymentGateway(false);
        setOrderPlaced(true);
      } else {
        alert("Requested quantity is not available.");
        setIsProcessing(false);
        setShowPaymentGateway(false);
      }
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    if (paymentMode === "online") {
      setShowPaymentGateway(true);
      setPaymentStep("card");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      completeOrder();
    }, 1500);
  };

  const handleDummyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentStep === "card") {
      setPaymentStep("otp");
    } else if (paymentStep === "otp") {
      setPaymentStep("processing");
      setTimeout(() => {
        completeOrder();
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-700">Product Not Found</h2>
        <button onClick={() => router.push('/')} className="px-6 py-2 bg-emerald-600 text-white rounded-full">
          Return Home
        </button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center space-y-6">
            <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Order Confirmed!</h1>
            <p className="text-slate-600">
              Your order for <strong>{buyQuantity}x {product.name}</strong> has been successfully placed.
            </p>
            <div className="pt-6">
              <button 
                onClick={() => router.push('/farmer/orders')} // Or buyer dashboard if implemented
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
              >
                View My Orders
              </button>
              <button 
                onClick={() => router.push('/farmer/products')}
                className="w-full py-4 mt-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const unitPrice = parseFloat(product.price);
  const subtotal = unitPrice * buyQuantity;
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <NavBar />
      
      {/* Dummy Payment Gateway Overlay */}
      {showPaymentGateway && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="font-bold tracking-wide">SecurePay™</span>
              </div>
              <span className="text-sm font-semibold">₹{total.toLocaleString("en-IN")}</span>
            </div>
            
            <form onSubmit={handleDummyPayment} className="p-6 space-y-6">
              {paymentStep === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Card Number</label>
                    <input required type="text" placeholder="4111 1111 1111 1111" maxLength={19} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">Expiry (MM/YY)</label>
                      <input required type="text" placeholder="12/25" maxLength={5} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">CVV</label>
                      <input required type="password" placeholder="***" maxLength={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Name on Card</label>
                    <input required type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="pt-2 flex gap-3">
                    <button type="button" onClick={() => setShowPaymentGateway(false)} className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20">
                      Proceed
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === "otp" && (
                <div className="space-y-4 text-center">
                  <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Banknote className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Bank Verification</h3>
                  <p className="text-sm text-slate-500">Enter the OTP sent to your registered mobile number.</p>
                  
                  <div className="pt-4">
                    <input required type="text" placeholder="Enter OTP (e.g. 123456)" maxLength={6} className="w-full px-4 py-3 text-center tracking-[0.5em] text-lg bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono" />
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setShowPaymentGateway(false)} className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/20">
                      Verify & Pay
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === "processing" && (
                <div className="py-8 text-center space-y-4 flex flex-col items-center">
                  <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
                  <h3 className="text-xl font-bold text-slate-800">Processing Payment...</h3>
                  <p className="text-sm text-slate-500">Please do not refresh the page or click back.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-8">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-medium transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Product
        </button>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-800">Secure Checkout</h1>
          <div className="flex items-center gap-2 text-emerald-600 font-semibold bg-emerald-50 px-4 py-2 rounded-lg">
            <ShieldCheck className="h-5 w-5" /> 100% Secure
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Details */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Delivery Address */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                <MapPin className="h-5 w-5 text-emerald-600" /> Delivery Address
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Full Name</label>
                  <input required name="fullName" value={address.fullName} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Phone Number</label>
                  <input required name="phone" value={address.phone} onChange={handleInputChange} type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-600">Street Address</label>
                  <input required name="street" value={address.street} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="House/Flat No., Street Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">City</label>
                  <input required name="city" value={address.city} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="City" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">State</label>
                    <input required name="state" value={address.state} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="State" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">ZIP Code</label>
                    <input required name="zip" value={address.zip} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="000000" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                <CreditCard className="h-5 w-5 text-emerald-600" /> Payment Method
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMode === 'cod' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMode === 'cod'} onChange={(e) => setPaymentMode(e.target.value)} className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500" />
                  <div>
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-emerald-600" /> Cash on Delivery
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Pay with cash upon delivery.</p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMode === 'online' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <input type="radio" name="payment" value="online" checked={paymentMode === 'online'} onChange={(e) => setPaymentMode(e.target.value)} className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500" />
                  <div>
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" /> Online Payment
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Pay via UPI, Credit/Debit Card.</p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Order Summary</h2>
              
              <div className="flex gap-4 items-center">
                <div 
                  className="h-16 w-16 rounded-xl bg-slate-200 flex-shrink-0"
                  style={product.image ? { backgroundImage: `url(${product.image})`, backgroundSize: "cover", backgroundPosition: "center" } : { backgroundColor: "#2E7D32" }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-slate-500">₹{product.price} / unit</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between py-4 border-y border-slate-100">
                <span className="font-semibold text-slate-700">Quantity</span>
                <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <button type="button" onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))} className="p-1 hover:bg-white rounded shadow-sm text-slate-600">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-slate-800 w-4 text-center">{buyQuantity}</span>
                  <button type="button" onClick={() => setBuyQuantity(Math.min(parseFloat(product.quantity), buyQuantity + 1))} className="p-1 hover:bg-white rounded shadow-sm text-slate-600">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Delivery Fee</span>
                  <span className="font-semibold text-slate-800">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-lg pt-4 border-t border-slate-100">
                  <span className="font-bold text-slate-800">Total</span>
                  <span className="font-bold text-orange-500">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 mt-6 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Place Order"
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                By placing your order, you agree to KisaanSetu's Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
          
        </form>
      </main>
    </div>
  );
}
