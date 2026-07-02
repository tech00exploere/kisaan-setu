import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Users, Building2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-100 blur-3xl" />
        <div className="absolute right-0 top-20 h-[300px] w-[300px] rounded-full bg-blue-100 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            India&apos;s Agricultural Operating System
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-5xl font-bold tracking-tight text-slate-900 md:text-7xl">
            Connecting
            <span className="text-orange-500"> Farmers</span>,
            <span className="text-blue-600"> Buyers</span>
            <br />
            & Businesses Across India
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            List products, discover verified suppliers, manage procurement,
            and grow your agricultural business through one trusted platform.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-orange-500 px-8 hover:bg-orange-600"
            >
              Start Selling
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button size="lg" variant="outline">
              Explore Marketplace
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Verified Users
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              25K+ Farmers
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              500+ Companies
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h3 className="text-3xl font-bold">25K+</h3>
              <p className="mt-2 text-sm text-slate-600">Farmers</p>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h3 className="text-3xl font-bold">8K+</h3>
              <p className="mt-2 text-sm text-slate-600">Buyers</p>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="mt-2 text-sm text-slate-600">Companies</p>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h3 className="text-3xl font-bold">₹100Cr+</h3>
              <p className="mt-2 text-sm text-slate-600">Transactions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}