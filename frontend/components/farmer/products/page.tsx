import Link from "next/link";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/categories";

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-slate-500">
            Organize and manage your agricultural inventory
          </p>
        </div>

        <Link href="/farmer/products/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            + Add Product
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/farmer/products/${category.slug}`}
            className="
              rounded-3xl
              border
              bg-white
              p-6
              shadow-sm
              transition-all
              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            <div className="text-4xl">{category.icon}</div>

            <h2 className="mt-4 text-xl font-semibold">
              {category.name}
            </h2>

            <p className="mt-2 text-slate-500">
              {category.count} Active Listings
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}