import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface CategoryCardProps {
  icon: ReactNode;
  name: string;
  count: number;
  slug: string;
  className?: string;
}

export default function CategoryCard({ icon, name, count, slug, className }: CategoryCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/farmer/products/${slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white border shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col justify-center items-center p-4 ${className || "rounded-3xl p-6"}`}
    >
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-2 text-lg font-semibold text-slate-800 text-center">{name}</h3>
      <p className="mt-1 text-sm text-slate-500 text-center">{count} Active Listings</p>
    </div>
  );
}