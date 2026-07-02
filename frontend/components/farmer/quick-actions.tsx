import Link from "next/link";
import {
  Plus,
  Package,
  ShoppingCart,
  MessageSquare,
} from "lucide-react";

const actions = [
  {
    title: "Add Product",
    description: "Create a new listing",
    href: "/farmer/products/new",
    icon: Plus,
  },
  {
    title: "Update Stock",
    description: "Manage inventory",
    href: "/farmer/products",
    icon: Package,
  },
  {
    title: "View Orders",
    description: "Check recent requests",
    href: "/farmer/orders",
    icon: ShoppingCart,
  },
  {
    title: "Messages",
    description: "Talk with buyers",
    href: "/farmer/messages",
    icon: MessageSquare,
  },
];

export default function QuickActions() {
  return (
    <section className="mt-10">
      <h2 className="mb-6 text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="
                rounded-3xl
                border
                bg-white
                p-6
                shadow-sm
                transition-all
                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                <Icon className="h-6 w-6 text-orange-500" />
              </div>

              <h3 className="font-semibold">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}