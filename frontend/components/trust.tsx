import {
  ShieldCheck,
  Building2,
  BadgeCheck,
  Landmark,
} from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Verified Farmers",
  },
  {
    icon: Building2,
    title: "Verified Companies",
  },
  {
    icon: Landmark,
    title: "Secure Transactions",
  },
  {
    icon: BadgeCheck,
    title: "Transparent Pricing",
  },
];

export default function Trust() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Built for Trust
          </h2>

          <p className="mt-4 text-slate-600">
            Every interaction is designed to create confidence
            between farmers, buyers and enterprises.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border bg-white p-8 shadow-sm"
              >
                <Icon className="mb-4 h-8 w-8 text-orange-500" />

                <h3 className="font-semibold">
                  {item.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}