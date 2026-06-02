import Sidebar from "@/components/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f8fc] text-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-14%] top-[-18%] h-[34rem] w-[34rem] rounded-full bg-indigo-300/24 blur-[130px]" />
        <div className="absolute right-[-14%] top-[3%] h-[34rem] w-[34rem] rounded-full bg-cyan-200/26 blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[38%] h-[30rem] w-[30rem] rounded-full bg-violet-300/18 blur-[130px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1520px] flex-col gap-5 p-3 sm:p-5 lg:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-8 lg:py-1">{children}</main>
      </div>
    </div>
  );
}
