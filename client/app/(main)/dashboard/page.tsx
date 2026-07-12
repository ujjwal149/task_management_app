import StatCard from "@/components/dashboard/StatCard";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import RecentTasks from "@/components/dashboard/RecentTasks";
import QuickActions from "@/components/dashboard/QuickActions";
import HeroSection from "@/components/dashboard/HeroSection";
import WeeklyActivity from "@/components/dashboard/WeeklyActivity";
import ProductivityCard from "@/components/dashboard/ProductivityCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import TodaySchedule from "@/components/dashboard/TodaySchedule";

import PageTransition from "@/components/layout/PageTransition";

import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function DashboardPage() {
  return (
    <PageTransition>
    <div className="space-y-8">

      <Breadcrumbs />
      
      {/* Header */}

      <HeroSection />

      {/* Statistics */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Tasks"
          value={24}
          color="text-blue-600"
        />

        <StatCard
          title="Completed"
          value={18}
          color="text-green-600"
        />

        <StatCard
          title="Pending"
          value={5}
          color="text-amber-500"
        />

        <StatCard
          title="Overdue"
          value={1}
          color="text-red-600"
        />
        
      </div>

<div className="grid gap-6 lg:grid-cols-3">

  {/* Left */}

  <div className="space-y-6 lg:col-span-2">

    <WeeklyActivity />

    <div className="grid gap-6 lg:grid-cols-2">

        <RecentTasks />

        <RecentActivity />

    </div>

  </div>

  {/* Right */}

  <div className="space-y-6">

    <UpcomingDeadlines />

    <TodaySchedule />

    <ProductivityCard />

    <QuickActions />

  </div>

</div>

</div>
</PageTransition> 
  );
}