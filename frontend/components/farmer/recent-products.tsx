import { Button } from "@/components/ui/button";

const products = [
  {
    name: "Sharbati Wheat",
    category: "Crops",
    quantity: "120 Quintal",
    price: "₹2500/Qtl",
    status: "Active",
  },
  {
    name: "Cow Milk",
    category: "Dairy",
    quantity: "250 Litres",
    price: "₹60/L",
    status: "Active",
  },
  {
    name: "Gir Cow",
    category: "Cattle",
    quantity: "4 Available",
    price: "₹75,000",
    status: "Pending",
  },
];

export default function RecentProducts() {
  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Recent Products
        </h2>

        <Button variant="outline">
          View All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.name}
            className="
              overflow-hidden
              rounded-3xl
              border
              bg-white
              shadow-sm
              transition-all
              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            <div className="h-48 bg-slate-100" />

            <div className="p-6">
              <h3 className="text-lg font-semibold">
                {product.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {product.category}
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">
                    Quantity:
                  </span>{" "}
                  {product.quantity}
                </p>

                <p>
                  <span className="text-slate-500">
                    Price:
                  </span>{" "}
                  {product.price}
                </p>
              </div>

              <div className="mt-5">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {product.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}