"use client";

import Sidebar from "@/components/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flow-lime-glow min-h-screen bg-[var(--fc-bg)] text-[var(--fc-text)]">
      <div className="pointer-events-none fixed inset-0 flow-grid-dark opacity-55" />
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <Sidebar />
        <main className="relative z-10 min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
