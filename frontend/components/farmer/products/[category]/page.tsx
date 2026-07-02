interface Props {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: Props) {
  const category =
    params.category.charAt(0).toUpperCase() +
    params.category.slice(1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {category}
        </h1>

        <p className="text-slate-500">
          Manage all products under {category}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6">
          <div className="h-40 rounded-2xl bg-slate-100" />

          <h3 className="mt-4 font-semibold">
            Sample Product
          </h3>

          <p className="text-sm text-slate-500">
            Quantity: 100
          </p>

          <p className="text-sm text-slate-500">
            Price: ₹2500
          </p>
        </div>
      </div>
    </div>
  );
}