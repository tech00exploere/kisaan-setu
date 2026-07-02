const testimonials = [
  {
    name: "Ramesh Patel",
    role: "Farmer",
    quote:
      "Super Mandi helped me connect directly with buyers and get better visibility for my produce.",
  },
  {
    name: "Ankit Sharma",
    role: "Buyer",
    quote:
      "Finding verified suppliers is much easier compared to traditional sourcing channels.",
  },
  {
    name: "Procurement Team",
    role: "Company",
    quote:
      "We streamlined agricultural procurement across multiple states using one platform.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Trusted By Agriculture Professionals
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border bg-white p-8 shadow-sm"
            >
              <p className="text-slate-600">
                &quot;{item.quote}&quot;
              </p>

              <div className="mt-6">
                <h4 className="font-semibold">
                  {item.name}
                </h4>

                <p className="text-sm text-slate-500">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}