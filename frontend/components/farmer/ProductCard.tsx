"use client";

import { Trash2 } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: string | number;
  quantity: string | number;
  location?: string;
  description?: string;
  image?: string;
  farmerName?: string;
  onDelete?: (id: string) => void;
}

import Link from "next/link";

export default function ProductCard({
  id,
  name,
  price,
  quantity,
  location,
  description,
  image,
  farmerName,
  onDelete,
}: ProductCardProps) {
  const bgStyle = image
    ? {
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        backgroundColor: "#2E7D32"
    };

  const canDelete = typeof window !== "undefined" && farmerName && localStorage.getItem("farmerName") === farmerName;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  return (
    <Link href={`/product/${id}`} className="block">
      <div className="relative rounded-3xl border p-6 shadow-sm hover:shadow-lg transition-all overflow-hidden min-h-[220px] flex flex-col justify-end" style={bgStyle}>
        <div className="relative text-white z-10 space-y-1">
          <h3 className="text-xl font-bold line-clamp-1">{name}</h3>
          {description && <p className="text-sm opacity-90 line-clamp-2">{description}</p>}
          <div className="flex items-center justify-between pt-2">
            <p className="text-lg font-bold text-orange-400">₹{price}</p>
            <p className="text-sm font-medium bg-white/20 px-2 py-1 rounded backdrop-blur-sm">{quantity}</p>
          </div>
          {location && <p className="text-xs opacity-75 pt-1">📍 {location}</p>}
          
          {canDelete && (
            <button 
              onClick={handleDelete} 
              className="absolute top-0 right-0 mt-[-30px] mr-[-10px] bg-red-500/80 hover:bg-red-600 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
