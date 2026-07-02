import { Tractor, ShoppingBag, Building2 } from "lucide-react";

const benefits = [
  {
    icon: Tractor,
    title: "For Farmers",
    points: [
      "List products easily",
      "Connect directly with buyers",
      "Get better market visibility",
    ],
  },
  {
    icon: ShoppingBag,
    title: "For Buyers",
    points: [
      "Discover verified produce",
      "Compare suppliers",
      "Contact farmers instantly",
    ],
  },
  {
    icon: Building2,
    title: "For Companies",
    points: [
      "Bulk procurement",
      "Supplier management",
      "Transparent sourcing",
    ],
  },
];

export default function Benefits() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Built For Everyone In Agriculture
          </h2>

          <p className="mt-4 text-slate-600">
            Whether you're selling, buying or sourcing at scale.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                  <Icon className="h-7 w-7 text-orange-500" />
                </div>

                <h3 className="text-2xl font-semibold">
                  {item.title}
                </h3>

                <ul className="mt-6 space-y-3">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="text-slate-600"
                    >
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}