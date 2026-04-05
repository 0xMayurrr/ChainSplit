// @ts-nocheck
import { useNavigate, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { address } = useAccount();

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "0x...";

  const navItems = [
    { icon: "grid_view", label: "Dashboard", path: "/dashboard" },
    { icon: "group", label: "Groups", path: "/groups" },
    { icon: "receipt_long", label: "Activity", path: "/activity" },
    { icon: "account_circle", label: "Profile", path: "/profile" },
  ];

  function isActive(path: string) {
    if (path === "/groups") return location.pathname.startsWith("/groups");
    return location.pathname === path;
  }

  return (
    <aside className="group/sidebar hidden md:flex flex-col gap-8 py-10 px-4 h-screen fixed left-0 top-0 bg-[#181b25] w-[72px] hover:w-72 shadow-[20px_0_40px_rgba(0,0,0,0.3)] z-50 transition-all duration-300 ease-in-out overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 min-w-[200px]">
        <img
          src="/Geometric_Chain_Link_Logo_Design-removebg-preview.png"
          alt="ChainSplit"
          className="w-10 h-10 flex-shrink-0 object-contain"
        />
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 overflow-hidden">
          <h1 className="text-xl font-bold font-headline tracking-tighter whitespace-nowrap"
            style={{ background: "linear-gradient(to right, #adc6ff, #44e2cd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            ChainSplit
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Cronos Mainnet</p>
        </div>
      </div>

      {/* New Split CTA */}
      <button
        onClick={() => navigate("/groups/create")}
        className="w-full py-4 px-3 bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-bold font-headline rounded-xl flex items-center justify-center gap-2 shadow-lg hover:scale-[0.98] transition-transform min-w-[40px]"
      >
        <span className="material-symbols-outlined flex-shrink-0">add</span>
        <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">New Split</span>
      </button>

      {/* Nav */}
      <nav className="flex flex-col gap-2 font-headline font-medium">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <a
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-[#1c1f29] text-[#44e2cd] shadow-[inset_0_0_10px_rgba(68,226,205,0.1)] translate-x-1"
                  : "text-slate-500 hover:text-slate-200 hover:bg-[#1c1f29]"
              }`}
            >
              <span
                className="material-symbols-outlined flex-shrink-0"
                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="mt-auto p-3 bg-surface-container-lowest rounded-xl flex items-center gap-3 min-w-[40px]">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/30 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-primary">account_circle</span>
        </div>
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 overflow-hidden">
          <p className="text-xs font-mono text-on-surface truncate whitespace-nowrap">{shortAddr}</p>
          <p className="text-[10px] text-secondary font-mono">Connected</p>
        </div>
      </div>
    </aside>
  );
}
