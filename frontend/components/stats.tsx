const stats = [
  { value: "25K+", label: "Farmers" },
  { value: "8K+", label: "Buyers" },
  { value: "500+", label: "Companies" },
  { value: "₹100Cr+", label: "Transactions" },
];

export default function Stats() {
  return (
    <section className="pb-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border bg-white p-8 text-center"
          >
            <h3 className="text-3xl font-bold text-slate-900">
              {stat.value}
            </h3>

            <p className="mt-2 text-slate-600">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}