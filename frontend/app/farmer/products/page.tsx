'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSidebar } from "@/components/farmer/SidebarContext";
import NavBar from "@/components/farmer/NavBar";
import FarmerSidebar from "@/components/farmer/sidebar";
import ProductForm from "@/components/farmer/ProductForm";
import ProductCard from "@/components/farmer/ProductCard";

interface Product {
  id: string;
  type: string;
  name: string;
  quantity: string;
  location: string;
  farmerName: string;
  details: string;
  price: string;
  image?: string; // base64 image data URL
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const { isOpen } = useSidebar();

  const [products, setProducts] = useState<Product[]>([]);
  const [role, setRole] = useState<string>("farmer");

  // Load role and products from localStorage on mount
  useEffect(() => {
    const storedRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
    if (storedRole) setRole(storedRole);
    const stored = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(stored);

    // Ensure farmer name exists for delete functionality
    if (typeof window !== "undefined") {
      let farmer = localStorage.getItem("farmerName") || "";
      if (!farmer) {
        farmer = window.prompt('Enter your farmer name (used for product ownership):') || "";
        if (farmer) localStorage.setItem("farmerName", farmer);
      }
    }
  }, []);

  const handleAdd = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleDelete = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  const canAdd = role === "farmer" || role === "company";

  // Split products based on the selected category (if any)
  const matchedProducts = category
    ? products.filter((p) => p.type?.toLowerCase() === category.toLowerCase())
    : products;
  const otherProducts = category
    ? products.filter((p) => p.type?.toLowerCase() !== category.toLowerCase())
    : [];

  return (
    <div className={`min-h-screen bg-slate-50 transition-all duration-300 ${isOpen ? 'pl-[260px]' : 'pl-[72px]'}`}>
      <NavBar />
      <div className="flex">
        <FarmerSidebar />
        <main className="flex-1 p-8">
          <h1 className="mb-6 text-2xl font-bold text-slate-800">
            {category ? `${category} Products` : "My Products"}
          </h1>
          {canAdd && !category ? (
            <section className="mb-8">
              {(role === "farmer" || role === "company") && (
                <ProductForm onAdd={handleAdd} />
              )}
            </section>
          ) : !category ? (
            <p className="mb-8 text-sm text-slate-600">
              Only farmers and companies can add products.
            </p>
          ) : null}
          {matchedProducts.length > 0 ? (
            <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {matchedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  quantity={p.quantity}
                  location={p.location}
                  image={p.image}
                  description={p.details}
                  farmerName={p.farmerName}
                  onDelete={handleDelete}
                />
              ))}
            </section>
          ) : (
            <p className="mt-8 mb-4 text-lg font-medium text-slate-700">
              No {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : ""} products available
            </p>
          )}
          {/* Other products section */}
          {otherProducts.length > 0 && (
            <>
              <p className="mt-8 mb-4 text-lg font-medium text-slate-700">Other Products</p>
              <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {otherProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    price={p.price}
                    quantity={p.quantity}
                    location={p.location}
                    image={p.image}
                    description={p.details}
                    farmerName={p.farmerName}
                    onDelete={handleDelete}
                  />
                ))}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">Loading Products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
