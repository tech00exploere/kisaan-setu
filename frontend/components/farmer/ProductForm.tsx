"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: string;
  type: string;
  name: string;
  quantity: string;
  location: string;
  farmerName: string;
  details: string;
  price: string;
  image?: string; // base64 data URL
}

export default function ProductForm({ onAdd }: { onAdd?: (product: Product) => void }) {
  const [product, setProduct] = useState<Partial<Product>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedFarmer = typeof window !== "undefined" ? localStorage.getItem("farmerName") || "" : "";
    const newProduct: Product = {
      id: crypto.randomUUID(),
      type: product.type ?? "",
      name: product.name ?? "",
      quantity: product.quantity ?? "",
      location: product.location ?? "",
      farmerName: storedFarmer,
      details: product.details ?? "",
      price: product.price ?? "",
      image: product.image,
    };
    // Save to localStorage for demo purposes
    const stored = JSON.parse(localStorage.getItem("products") || "[]");
    stored.push(newProduct);
    localStorage.setItem("products", JSON.stringify(stored));
    if (onAdd) onAdd(newProduct);
    setProduct({}); // reset form
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input name="type" placeholder="Product Type (e.g., Dairy)" value={product.type ?? ""} onChange={handleChange} required />
      <Input name="name" placeholder="Product Name" value={product.name ?? ""} onChange={handleChange} required />
      <Input name="quantity" placeholder="Quantity (e.g., 10 kg)" value={product.quantity ?? ""} onChange={handleChange} required />
      <Input name="location" placeholder="Location" value={product.location ?? ""} onChange={handleChange} required />
      <Input name="farmerName" placeholder="Farmer Name" value={product.farmerName ?? ""} onChange={handleChange} required />
      <Textarea name="details" placeholder="Additional details" value={product.details ?? ""} onChange={handleChange} />
      <Input name="price" placeholder="Price (e.g., ₹200 per kg)" value={product.price ?? ""} onChange={handleChange} required />
      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
      <Button type="submit" className="w-full">Add Product</Button>
    </form>
  );
}
