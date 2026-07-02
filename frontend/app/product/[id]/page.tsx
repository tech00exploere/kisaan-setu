"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Star, ShoppingCart, MessageSquare, MapPin, Package,
  ShieldCheck, Share2, Send
} from "lucide-react";
import NavBar from "@/components/farmer/NavBar";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
      const found = storedProducts.find((p: any) => p.id === id);
      setProduct(found || null);

      // Load reviews for this specific product (Real Data Only)
      const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`) || "[]");
      setReviews(storedReviews);
      
      setLoading(false);
    }
  }, [id]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const review = {
      id: Date.now(),
      user: localStorage.getItem("farmerName") || "Verified Buyer",
      rating: newRating,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      comment: newComment
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    
    setNewComment("");
    setNewRating(5);
  };

  const [isBuying, setIsBuying] = useState(false);

  const handleBuy = () => {
    setIsBuying(true);
    // Add brief artificial delay for UX feel, then redirect to checkout
    setTimeout(() => {
      router.push(`/checkout/${id}`);
    }, 400);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Package className="h-16 w-16 text-slate-300" />
          <h2 className="text-2xl font-bold text-slate-700">Product Not Found</h2>
          <button onClick={() => router.back()} className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const bgStyle = product.image 
    ? { backgroundImage: `url(${product.image})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundColor: "#2E7D32" };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "New";

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-8">
        
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-medium transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Product Header / Hero */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row">
              <div className="md:w-2/5 min-h-[300px] relative" style={bgStyle}>
                {!product.image && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-100 opacity-50">
                    <Package className="h-20 w-20 mb-2" />
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
              <div className="md:w-3/5 p-8 flex flex-col justify-between">
                <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {product.type || "General Category"}
                  </span>
                  <button 
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        navigator.clipboard.writeText(window.location.href);
                        const btn = document.getElementById("share-btn-text");
                        if (btn) {
                          const originalText = btn.innerText;
                          btn.innerText = "Copied!";
                          btn.classList.add("text-emerald-600");
                          setTimeout(() => {
                            btn.innerText = originalText;
                            btn.classList.remove("text-emerald-600");
                          }, 2000);
                        }
                      }
                    }}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-600 transition-colors text-sm font-medium"
                  >
                    <Share2 className="h-4 w-4" />
                    <span id="share-btn-text">Share</span>
                  </button>
                </div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{product.name}</h1>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 border-b border-slate-100 pb-6">
                    <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                      <Star className="h-4 w-4 fill-amber-500" /> {avgRating}
                      <span className="text-slate-400 font-normal">({reviews.length} reviews)</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {product.location || "Unknown"}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-6">
                    {product.details || "No additional description provided by the seller. This is a premium quality agricultural product ready for distribution."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">KisaanSetu Buyer Protection</span>
                </div>
              </div>
            </div>

            {/* Comments / Reviews Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-600" /> Product Reviews
                </h2>
                <span className="text-slate-500 text-sm font-medium">{reviews.length} Comments</span>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddReview} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="font-semibold text-slate-700">Write a Review</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setNewRating(star)}
                        className={`transition-colors ${newRating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                      >
                        <Star className={`h-6 w-6 ${newRating >= star ? 'fill-amber-500' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none h-20"
                    required
                  />
                  <button type="submit" className="h-12 px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors">
                    <Send className="h-4 w-4" /> Post
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500">
                      {rev.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800">{rev.user}</span>
                        <span className="text-xs text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500 mb-2">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-500' : 'text-slate-300'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl rounded-tl-none border border-slate-100">
                        {rev.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Right Column: Checkout/Action Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-6 space-y-6">
              <div>
                <span className="text-slate-500 text-sm font-medium">Price</span>
                <div className="text-4xl font-bold text-slate-900 mt-1 flex items-end gap-1">
                  ₹{product.price} <span className="text-base text-slate-500 font-normal pb-1">/ unit</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Available Quantity</span>
                  <span className="font-bold text-slate-800">{product.quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Seller</span>
                  <span className="font-bold text-emerald-600">{product.farmerName || "Verified Seller"}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  onClick={handleBuy}
                  disabled={isBuying || parseFloat(product.quantity) <= 0}
                  className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] ${
                    parseFloat(product.quantity) <= 0
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                  }`}
                >
                  {isBuying ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" /> Proceed to Checkout
                    </>
                  )}
                </button>
                <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="h-5 w-5" /> Message Seller
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <ul className="space-y-2 text-xs text-slate-500">
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure payment processing</li>
                  <li className="flex items-center gap-2"><Package className="h-4 w-4 text-emerald-500" /> Direct dispatch from farm</li>
                </ul>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
