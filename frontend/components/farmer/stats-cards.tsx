import StatCard from "./stat-card";
import { dashboardStats } from "@/data/dashboard";

export default function StatsCards() {
  return (
    <section className="mt-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>
    </section>
  );
}