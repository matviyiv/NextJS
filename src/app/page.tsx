"use client";

import dynamic from "next/dynamic";
import StoreProvider from "@/store/provider";

const Dashboard = dynamic(() => import("@/components/dashboard/Dashboard"), {
  ssr: false,
  loading: () => <DashboardSkeleton />,
});

function DashboardSkeleton() {
  return (
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden w-64 border-r border-border bg-surface p-4 md:block">
        <div className="mb-6 h-8 w-32 animate-pulse rounded-lg bg-surface-tertiary" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-surface-tertiary" />
          ))}
        </div>
      </div>
      {/* Main area skeleton */}
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-tertiary" />
          <div className="h-10 w-28 animate-pulse rounded-lg bg-surface-tertiary" />
        </div>
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-tertiary" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-surface-tertiary" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <StoreProvider>
      <Dashboard />
    </StoreProvider>
  );
}
