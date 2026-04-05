// @ts-nocheck
import { useNavigate } from "react-router-dom";
import { useAccount, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";
import { FACTORY_ABI, FACTORY_ADDRESS, VAULT_ABI } from "../abis/contracts";
import Sidebar from "../components/Sidebar";

/* ── Group card ─────────────────────────────────────────────────── */
function GroupCard({ vault, navigate }) {
  const { data: info } = useReadContract({
    address: vault, abi: VAULT_ABI, functionName: "getGroupInfo",
  });

  if (!info) return (
    <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/5 animate-pulse h-40" />
  );

  const [name, emoji, , memberCount, totalExpenses, isSettled, balance] = info;

  return (
    <button
      type="button"
      onClick={() => navigate(`/groups/${vault}`)}
      className="w-full text-left bg-surface-container rounded-2xl p-6 border border-outline-variant/5 hover:border-secondary/20 hover:bg-surface-container-high transition-all group cursor-pointer active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-11 h-11 rounded-xl bg-surface-container-highest flex items-center justify-center text-2xl">
          {emoji}
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border
          ${isSettled
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-secondary/10 text-secondary border-secondary/20"}`}>
          {isSettled ? "Settled" : "Active"}
        </span>
      </div>
      <h3 className="text-base font-headline font-bold mb-0.5 truncate">{name}</h3>
      <p className="text-xs text-slate-400 mb-5">
        {memberCount.toString()} members · {totalExpenses.toString()} expenses
      </p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Vault Balance</p>
          <p className="text-lg font-mono font-bold text-primary">{formatEther(balance)} CRO</p>
        </div>
        <span className="material-symbols-outlined text-slate-500 group-hover:text-secondary group-hover:translate-x-1 transition-all">
          arrow_forward
        </span>
      </div>
    </button>
  );
}

/* ── Dashboard ──────────────────────────────────────────────────── */
export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  const { data: userGroupAddresses } = useReadContract({
    address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: "getUserGroups",
    args: address ? [address] : undefined, query: { enabled: !!address },
  });
  const { data: allGroups } = useReadContract({
    address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: "getGroups",
  });

  const myGroups   = allGroups?.filter((g) => userGroupAddresses?.includes(g.vault)) ?? [];
  const shortAddr  = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  const activeCount = myGroups.filter(g => !g.isSettled).length;

  if (!isConnected) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-background text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
      </div>
      <h2 className="text-2xl font-headline font-bold text-primary">Connect your wallet</h2>
      <p className="text-on-surface-variant text-sm max-w-xs">Connect to view your groups and expenses on Cronos.</p>
      <ConnectButton />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      <Sidebar />

      <main className="md:ml-[72px] min-h-screen flex flex-col transition-all duration-300">

        {/* ── Sticky top bar ─────────────────────────────────── */}
        <header className="flex justify-between items-center px-6 md:px-12 py-6 sticky top-0 z-40 bg-background/60 backdrop-blur-2xl border-b border-outline-variant/5">
          <div>
            <h1 className="text-2xl font-headline font-extrabold tracking-tight text-on-surface">
              Welcome, <span className="text-primary">{shortAddr}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Your decentralized expense summary.</p>
          </div>
          <ConnectButton />
        </header>

        {/* ── Scrollable content ─────────────────────────────── */}
        <section className="flex-1 px-6 md:px-12 py-8 pb-28 md:pb-12 space-y-8">

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/5">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Total Groups</p>
              <p className="text-4xl font-headline font-bold text-on-surface">{myGroups.length}</p>
            </div>
            <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/5">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Active</p>
              <p className="text-4xl font-headline font-bold text-secondary">{myGroups.length}</p>
            </div>
            <div className="col-span-2 md:col-span-1 bg-surface-container rounded-2xl p-5 border border-outline-variant/5">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Network</p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
                <span className="text-sm font-mono font-bold text-primary">Cronos Testnet</span>
              </div>
            </div>
          </div>

          {/* ── My Groups section ──────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-headline font-bold">My Groups</h2>
              <button
                onClick={() => navigate("/groups/create")}
                className="text-sm font-bold text-secondary hover:text-on-surface transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Create New
              </button>
            </div>

            {myGroups.length === 0 ? (
              <div className="bg-surface-container rounded-2xl p-12 border border-dashed border-outline-variant/20 text-center">
                <div className="text-5xl mb-4">🏝️</div>
                <h3 className="text-lg font-headline font-bold mb-2">No groups yet</h3>
                <p className="text-slate-400 text-sm mb-6">Create your first shared vault on Cronos to get started.</p>
                <button
                  onClick={() => navigate("/groups/create")}
                  className="px-6 py-3 rounded-xl font-headline font-bold text-on-primary-fixed text-sm"
                  style={{ background: "linear-gradient(135deg, #adc6ff, #4d8eff)" }}
                >
                  Create First Group
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {myGroups.map((g) => (
                  <GroupCard key={g.vault} vault={g.vault} navigate={navigate} />
                ))}

                {/* Add group card */}
                <button
                  type="button"
                  onClick={() => navigate("/groups/create")}
                  className="border-2 border-dashed border-outline-variant/20 rounded-2xl flex flex-col items-center justify-center gap-3 py-10 hover:border-secondary/40 hover:bg-secondary/5 transition-all group active:scale-[0.98] min-h-[180px]"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-secondary">add</span>
                  </div>
                  <span className="font-headline font-bold text-slate-400 group-hover:text-secondary text-sm">+ New Group</span>
                </button>
              </div>
            )}
          </div>

          {/* ── Recent Activity strip ─────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-headline font-bold">Recent Activity</h2>
              <button onClick={() => navigate("/activity")} className="text-xs text-slate-400 hover:text-on-surface flex items-center gap-1">
                View all
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="bg-surface-container rounded-2xl border border-outline-variant/5 divide-y divide-outline-variant/5 overflow-hidden">
              {[
                { icon: "check_circle", color: "text-secondary", bg: "bg-secondary/10", title: "Settlement Confirmed", sub: "You settled your share for Goa Trip 2024", time: "2 mins ago", amt: "-15.50 CRO", amtColor: "text-on-surface" },
                { icon: "receipt_long", color: "text-orange-400", bg: "bg-orange-400/10", title: "Expense Added", sub: 'Artisan Pizza added to "Office Eats"', time: "2 hours ago", amt: "0.85 CRO", amtColor: "text-slate-400" },
                { icon: "call_received", color: "text-secondary", bg: "bg-secondary/10", title: "Payment Received", sub: "0x7d1...90ab settled their share", time: "Yesterday", amt: "+48.00 CRO", amtColor: "text-secondary" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container-high transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`material-symbols-outlined ${item.color} text-base`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.title}</p>
                    <p className="text-xs text-slate-500 truncate">{item.sub}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-mono font-bold ${item.amtColor}`}>{item.amt}</p>
                    <p className="text-[10px] text-slate-600 font-mono">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>

      {/* ── Mobile bottom nav ───────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container/90 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center py-3 z-50">
        {[
          { icon: "grid_view",    label: "Home",    active: true },
          { icon: "group",        label: "Groups",  action: () => navigate("/groups") },
          { icon: "add_circle",   label: "New",     action: () => navigate("/groups/create"), highlight: true },
          { icon: "receipt_long", label: "Activity",action: () => navigate("/activity") },
          { icon: "account_circle", label: "Profile", action: () => navigate("/profile") },
        ].map(item => (
          <button key={item.label} onClick={item.action}
            className={`flex flex-col items-center gap-1 ${item.highlight ? "text-secondary" : item.active ? "text-primary" : "text-slate-500 hover:text-on-surface"} transition-colors`}>
            <span className="material-symbols-outlined text-2xl"
              style={(item.highlight || item.active) ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {item.icon}
            </span>
            <span className="text-[9px] font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
