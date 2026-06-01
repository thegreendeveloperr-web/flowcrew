import Sidebar from "@/components/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flow-bg relative min-h-screen overflow-hidden">
      <div className="flow-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-cyan-400/12 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-4 p-3 sm:p-4 lg:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-8 lg:py-2">{children}</main>
      </div>
    </div>
  );
}
