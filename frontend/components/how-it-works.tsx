import { Upload, Search, Building2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Farmers List Products",
    description:
      "Upload produce details, quantity, pricing and availability in minutes.",
  },
  {
    icon: Search,
    title: "Buyers Discover Produce",
    description:
      "Search verified products from trusted farmers across India.",
  },
  {
    icon: Building2,
    title: "Companies Source at Scale",
    description:
      "Manage procurement and connect directly with suppliers.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            How Super Mandi Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            One platform connecting farmers, buyers and businesses.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-3xl border bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                  <Icon className="h-7 w-7 text-orange-500" />
                </div>

                <span className="text-sm font-medium text-orange-500">
                  Step {index + 1}
                </span>

                <h3 className="mt-2 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-4 text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}