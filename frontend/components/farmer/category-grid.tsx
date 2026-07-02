import { categories } from "@/data/categories";
import CategoryCard from "./category-card";

export default function CategoryGrid() {
  return (
    <section className="mt-10">
      <h2 className="mb-6 text-2xl font-bold">
        Product Categories
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            icon={category.icon}
            name={category.name}
            count={category.count}
            slug={category.slug}
          />
        ))}
      </div>
    </section>
  );
}