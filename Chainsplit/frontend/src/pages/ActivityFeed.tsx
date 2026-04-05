// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Sidebar from "../components/Sidebar";

const ALL_ACTIVITY = [
  { id: 1, type: "settlement", icon: "check_circle",   iconColor: "text-primary",  bg: "bg-primary/10",  title: "Settlement Confirmed",  desc: "You settled your share for Goa Trip 2024",          amount: "-15.50 CRO", amountColor: "text-error",   time: "2 minutes ago",       tag: "Settlement", tagColor: "bg-primary/10 text-primary" },
  { id: 2, type: "expense",    icon: "restaurant",      iconColor: "text-orange-400", bg: "bg-orange-400/10", title: "Expense Added",          desc: 'Artisan Pizza added to "Office Eats"',              amount: "0.85 CRO",   amountColor: "text-slate-400", time: "2 hours ago",         tag: "Expense",    tagColor: "bg-orange-400/10 text-orange-400" },
  { id: 3, type: "payment",    icon: "call_received",   iconColor: "text-secondary",  bg: "bg-secondary/10",  title: "Payment Received",       desc: "0x7d1...90ab settled their share",                  amount: "+48.00 CRO", amountColor: "text-secondary", time: "Yesterday, 4:20 PM",  tag: "Payment",    tagColor: "bg-secondary/10 text-secondary" },
  { id: 4, type: "group",      icon: "group_add",       iconColor: "text-primary",  bg: "bg-primary/10",  title: "New Member Added",       desc: "0x12e...fe2a joined Bangalore Meetup",              amount: "",           amountColor: "",             time: "2 days ago",          tag: "Members",    tagColor: "bg-primary/10 text-primary" },
  { id: 5, type: "vault",      icon: "rocket_launch",   iconColor: "text-secondary", bg: "bg-secondary/10", title: "Vault Deployed",         desc: "Group vault created for London Flatmates",          amount: "",           amountColor: "",             time: "5 days ago",          tag: "Vault",      tagColor: "bg-secondary/10 text-secondary" },
  { id: 6, type: "expense",    icon: "directions_car",  iconColor: "text-primary",  bg: "bg-primary/10",  title: "Transport Expense",      desc: "Ola Cab from Airport split equally",                amount: "1.20 CRO",   amountColor: "text-slate-400", time: "1 week ago",          tag: "Expense",    tagColor: "bg-primary/10 text-primary" },
];

const TABS = ["All", "Expenses", "Settlements", "Payments", "Groups"];
const TYPE_MAP: Record<string, string[]> = {
  Expenses: ["expense"], Settlements: ["settlement"], Payments: ["payment"], Groups: ["group", "vault"],
};

export default function ActivityFeed() {
  const navigate      = useNavigate();
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState(ALL_ACTIVITY[0]);

  const filtered = tab === "All" ? ALL_ACTIVITY : ALL_ACTIVITY.filter((a) => TYPE_MAP[tab]?.includes(a.type));

  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      <Sidebar />

      <main className="md:ml-72 min-h-screen flex flex-col">

        {/* ── Sticky top bar ─────────────────────────────────── */}
        <header className="flex justify-between items-center px-6 md:px-12 py-6 sticky top-0 z-40 bg-background/60 backdrop-blur-2xl border-b border-outline-variant/5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-headline font-extrabold tracking-tight text-on-surface">Activity</h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary font-mono font-bold">LIVE</span>
            </div>
          </div>
          <ConnectButton />
        </header>

        {/* ── Content ─────────────────────────────── */}
        <section className="flex-1 px-6 md:px-12 py-8 pb-28 md:pb-12">
          <div className="flex gap-8 max-w-6xl">

            {/* Feed */}
            <div className="flex-1 space-y-6">

              {/* Filter tabs */}
              <div className="flex gap-2 p-1 bg-surface-container rounded-xl w-fit">
                {TABS.map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${tab === t ? "bg-surface-container-highest text-primary" : "text-slate-500 hover:text-on-surface"}`}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-outline-variant/10" />
                <div className="space-y-2">
                  {filtered.map((item) => (
                    <div key={item.id} onClick={() => setSelected(item)}
                      className={`relative pl-12 pr-6 py-5 rounded-2xl cursor-pointer transition-all border ${selected?.id === item.id ? "bg-surface-container border-primary/20" : "border-transparent hover:bg-surface-container-low hover:border-outline-variant/10"}`}>
                      {/* dot */}
                      <div className={`absolute left-3 top-6 w-4 h-4 rounded-full ${item.bg} border border-white/10 z-10 flex items-center justify-center`}>
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                            <span className={`material-symbols-outlined ${item.iconColor} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-bold text-on-surface">{item.title}</p>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${item.tagColor}`}>{item.tag}</span>
                            </div>
                            <p className="text-sm text-slate-400">{item.desc}</p>
                            <p className="text-[10px] font-mono text-slate-600 mt-1 uppercase tracking-tighter">{item.time}</p>
                          </div>
                        </div>
                        {item.amount && (
                          <span className={`font-mono font-bold flex-shrink-0 ${item.amountColor}`}>{item.amount}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="hidden lg:block w-80 sticky top-28 self-start">
                <div className="bg-surface-container rounded-3xl p-6 space-y-5 border border-outline-variant/5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-headline font-bold text-lg">Details</h3>
                    <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-on-surface transition-colors">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <div className={`w-16 h-16 rounded-2xl ${selected.bg} flex items-center justify-center mx-auto`}>
                    <span className={`material-symbols-outlined ${selected.iconColor} text-3xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{selected.icon}</span>
                  </div>

                  <div className="text-center">
                    <p className="font-headline font-bold text-lg">{selected.title}</p>
                    <p className="text-sm text-slate-400 mt-1">{selected.desc}</p>
                    {selected.amount && (
                      <p className={`text-2xl font-mono font-bold mt-3 ${selected.amountColor}`}>{selected.amount}</p>
                    )}
                  </div>

                  <div className="space-y-3 pt-2 border-t border-outline-variant/10">
                    {[
                      { label: "Type",  value: selected.tag },
                      { label: "Time",  value: selected.time },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 text-xs uppercase tracking-widest font-mono">{label}</span>
                        <span className="text-on-surface font-medium">{value}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-3 bg-surface-container-high rounded-xl text-sm font-bold text-slate-400 hover:text-on-surface transition-colors flex items-center justify-center gap-2 border border-outline-variant/10">
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    View on Explorer
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ── Mobile bottom nav ───────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container/90 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center py-3 z-50">
        {[
          { icon: "grid_view",     label: "Home",     action: () => navigate("/dashboard") },
          { icon: "group",         label: "Groups",   action: () => navigate("/groups") },
          { icon: "receipt_long",  label: "Activity", action: () => navigate("/activity"), active: true },
          { icon: "account_circle",label: "Profile",  action: () => navigate("/profile") },
        ].map(item => (
          <button key={item.label} onClick={item.action}
            className={`flex flex-col items-center gap-1 ${item.active ? "text-primary" : "text-slate-500 hover:text-on-surface"} transition-colors`}>
            <span className="material-symbols-outlined text-2xl"
              style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {item.icon}
            </span>
            <span className="text-[9px] font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
