import { LogoutButton } from "@/components/dashboard/logout-button";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export function DashboardShell({ children, title = "Жеке кабинет" }: Props) {
  return (
    <div className="min-h-full bg-[var(--canvas)] text-[var(--ink)]">
      <header className="border-b border-[var(--teal-deep)]/10 bg-[var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--teal-deep)] sm:text-xl"
            >
              Brain Hub
            </a>
            <nav className="hidden items-center gap-3 text-sm font-medium text-[var(--ink-soft)] sm:flex">
              <a href="/dashboard" className="hover:text-[var(--teal-deep)]">
                Басты бет
              </a>
              <a
                href="/dashboard/ielts"
                className="hover:text-[var(--teal-deep)]"
              >
                VIP IELTS
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[var(--ink-muted)] md:inline">
              {title}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {children}
      </main>
    </div>
  );
}
