interface ProductCardProps {
  name: string;
  category: string;
  quantity: string;
  price: string;
  status: string;
}

export default function ProductCard({
  name,
  category,
  quantity,
  price,
  status,
}: ProductCardProps) {
  return (
    <div
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
        <h3 className="font-semibold">
          {name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {category}
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <p>Quantity: {quantity}</p>
          <p>Price: {price}</p>
        </div>

        <div className="mt-4">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}