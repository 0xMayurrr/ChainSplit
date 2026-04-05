// @ts-nocheck
import { useNavigate, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NAV = [
  { icon: "dashboard",    label: "Dashboard",    path: "/dashboard" },
  { icon: "group",        label: "Groups",       path: "/groups" },
  { icon: "add_circle",   label: "Create Group", path: "/groups/create" },
  { icon: "receipt_long", label: "Activity",     path: "/activity" },
  { icon: "settings",     label: "Profile",      path: "/profile" },
];

export default function AppLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const navigate  = useNavigate();
  const location  = useLocation();

  function isActive(path: string) {
    if (path === "/groups") return location.pathname === "/groups";
    return location.pathname.startsWith(path);
  }

  return (
    <div className="min-h-screen bg-[#080B14]">

      {/* ── Hover Sidebar (desktop only) ─────────────────────────────── */}
      <aside className="
        hidden md:flex flex-col
        fixed left-0 top-0 h-screen z-50
        bg-[#10131c] border-r border-white/5
        w-16 hover:w-60
        transition-all duration-300 ease-in-out
        overflow-hidden group/sidebar
      ">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 min-h-[64px]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
          </div>
          <span className="text-[#adc6ff] font-black tracking-tighter font-headline text-lg whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
            ChainSplit
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-2 flex-1 mt-2">
          {NAV.map((item) => {
            const active = isActive(item.path);
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left
                  transition-all duration-200 group/item relative
                  ${active
                    ? "bg-primary/10 text-[#adc6ff]"
                    : "text-gray-500 hover:text-white hover:bg-white/5"}
                `}>
                <span className={`material-symbols-outlined flex-shrink-0 text-xl ${active ? "text-[#adc6ff]" : ""}`}
                  style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                <span className="whitespace-nowrap text-sm font-medium opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
                  {item.label}
                </span>
                {/* Active indicator dot when collapsed */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#adc6ff] rounded-r-full group-hover/sidebar:hidden" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: new group CTA */}
        <div className="p-2 border-t border-white/5">
          <button onClick={() => navigate("/groups/create")}
            className="flex items-center gap-3 px-3 py-3 rounded-xl w-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200">
            <span className="material-symbols-outlined flex-shrink-0 text-xl">add</span>
            <span className="whitespace-nowrap text-sm font-bold opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
              New Group
            </span>
          </button>
        </div>
      </aside>

      {/* ── Top Navbar ───────────────────────────────────────────────── */}
      <header className="
        fixed top-0 right-0 z-40
        left-0 md:left-16
        flex items-center justify-between
        px-4 md:px-6 py-3
        bg-[#080B14]/80 backdrop-blur-xl
        border-b border-white/5
        transition-all duration-300
      ">
        {/* Mobile: logo */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
          </div>
          <span className="text-[#adc6ff] font-black tracking-tighter font-headline text-lg">ChainSplit</span>
        </div>

        {/* Desktop: page title */}
        {title && (
          <span className="hidden md:block text-sm font-mono text-outline uppercase tracking-widest">{title}</span>
        )}
        {!title && <span className="hidden md:block" />}

        <ConnectButton />
      </header>

      {/* ── Page content ─────────────────────────────────────────────── */}
      <div className="md:pl-16 pt-[57px] min-h-screen pb-20 md:pb-0">
        {children}
      </div>

      {/* ── Mobile Bottom Nav ────────────────────────────────────────── */}
      <nav className="
        md:hidden fixed bottom-0 left-0 right-0 z-50
        bg-[#10131c]/95 backdrop-blur-xl
        border-t border-white/10
        flex items-center justify-around
        px-2 py-2 safe-area-pb
      ">
        {[
          { icon: "dashboard",    label: "Home",     path: "/dashboard" },
          { icon: "group",        label: "Groups",   path: "/groups" },
          { icon: "add",          label: "",         path: "/groups/create", fab: true },
          { icon: "receipt_long", label: "Activity", path: "/activity" },
          { icon: "settings",     label: "Profile",  path: "/profile" },
        ].map((item) => {
          const active = isActive(item.path);
          if (item.fab) return (
            <button key="fab" onClick={() => navigate(item.path)}
              className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-transform -mt-5">
              <span className="material-symbols-outlined text-on-primary text-2xl font-bold">add</span>
            </button>
          );
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${active ? "text-[#adc6ff]" : "text-gray-500"}`}>
              <span className="material-symbols-outlined text-xl"
                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
