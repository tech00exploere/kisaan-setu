// app/farmer/products/[category]/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const { category } = useParams();
  const categoryStr = typeof category === "string" ? category : Array.isArray(category) ? category[0] : "";

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: "",
    status: "available",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { ...form, category: categoryStr };
      
      // Save to localStorage for demo/analytics purposes
      const stored = JSON.parse(localStorage.getItem("products") || "[]");
      const storedFarmer = typeof window !== "undefined" ? localStorage.getItem("farmerName") || "Demo Farmer" : "Demo Farmer";
      stored.push({
        id: crypto.randomUUID(),
        type: categoryStr,
        name: form.name,
        quantity: form.quantity,
        price: form.price,
        location: "Punjab", // default location to show on map
        farmerName: storedFarmer,
        details: ""
      });
      localStorage.setItem("products", JSON.stringify(stored));
      
      try {
        await axiosInstance.post("/farmer/me/products", payload);
      } catch (backendErr) {
        console.warn("Backend failed, but saved to local storage");
      }
      
      setSuccess("Product added successfully!");
      setTimeout(() => router.push(`/farmer/products/${categoryStr}`), 1500);
    } catch (err: any) {
      console.error("Add product error", err);
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-50 overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-orange-100/60 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-12">
        <Card className="rounded-3xl border-0 bg-white shadow-sm">
          <CardContent className="p-8">
            <h1 className="mb-6 text-2xl font-bold text-slate-900">
              Add New {categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1)} Product
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Name</label>
                <Input
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Quantity</label>
                <Input
                  name="quantity"
                  type="number"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Price</label>
                <Input
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Save Product"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
