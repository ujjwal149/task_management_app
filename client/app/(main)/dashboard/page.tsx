"use client";

import { useEffect } from "react";

import { useDashboard } from "@/hooks/useDashboard";

import StatCard from "@/components/dashboard/StatCard";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import RecentTasks from "@/components/dashboard/RecentTasks";
import QuickActions from "@/components/dashboard/QuickActions";
import HeroSection from "@/components/dashboard/HeroSection";
import WeeklyActivity from "@/components/dashboard/WeeklyActivity";
import ProductivityCard from "@/components/dashboard/ProductivityCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import TodaySchedule from "@/components/dashboard/TodaySchedule";

import StatusChart from "@/components/dashboard/Statuschart";
import PriorityChart from "@/components/dashboard/PriorityChart";

import PeriodFilter from "@/components/dashboard/PeriodFilter";

import PageTransition from "@/components/layout/PageTransition";

import Breadcrumbs from "@/components/layout/Breadcrumbs";




export default function DashboardPage() {

  const {
  overview,
  loading,
  period,
  fetchDashboard,
  } = useDashboard();
  
  useEffect(() => {
  fetchDashboard();
  }, [fetchDashboard, period]);
  
  if (loading || !overview) {
    return <p>Loading dashboard...</p>;
  }


  return (
    <PageTransition>
    <div className="space-y-8">

      <Breadcrumbs />
      
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="flex-1">
          <HeroSection />
        </div>
        
        <div className="w-full lg:w-auto lg:shrink-0">
          <PeriodFilter />
        </div>
      </div>

      {/* Statistics */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Tasks"
          value={overview?.totalTasks ?? 0}
          color="text-blue-600"
        />

        <StatCard
          title="Completed"
          value={overview?.completed ?? 0}
          color="text-green-600"
        />

        <StatCard
          title="Pending"
          value={overview?.todo ?? 0}
          color="text-amber-500"
        />

        <StatCard
          title="Overdue"
          value={overview?.overdue ?? 0}
          color="text-red-600"
        />
        
      </div>

<div className="grid gap-6 lg:grid-cols-3">

  {/* Left */}

  <div className="space-y-6 lg:col-span-2">

    <div className="grid gap-6 lg:grid-cols-2">

  <WeeklyActivity />

  <StatusChart />

</div>

<PriorityChart />

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