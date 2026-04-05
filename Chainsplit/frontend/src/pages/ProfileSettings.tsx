// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getUser, updateUser } from "../services/api";
import Sidebar from "../components/Sidebar";

const RECENT_TX = [
  { icon: "call_made", label: "Rent Settlement", group: "London Flatmates Group", date: "Oct 24, 2023", hash: "0x2f...1a4", amount: "-1,200.00 CRO", color: "text-on-surface", bg: "bg-secondary/10 text-secondary" },
  { icon: "call_received", label: "Split Received", group: "Dinner at Zuma", date: "Oct 22, 2023", hash: "0x88...c4d", amount: "+245.50 CRO", color: "text-secondary", bg: "bg-secondary/10 text-secondary" },
  { icon: "refresh", label: "Staking Reward", group: "Cronos Mainnet", date: "Oct 20, 2023", hash: "0x41...9e2", amount: "+12.40 CRO", color: "text-secondary", bg: "bg-secondary/10 text-secondary" },
];

export default function ProfileSettings() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const { signMessageAsync } = useSignMessage();

  const [displayName, setDisplayName] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!address) return;
    getUser(address).then((u) => setDisplayName(u.displayName ?? "")).catch(() => {});
  }, [address]);

  async function handleSave() {
    if (!address || !displayName.trim()) return;
    setSaving(true); setError(""); setSaved(false);
    try {
      await updateUser(address, displayName.trim(), signMessageAsync);
      setSaved(true);
    } catch (e: any) {
      setError(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!isConnected) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-surface">
      <ConnectButton />
    </div>
  );

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <Sidebar />

      {/* Fixed Header */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-72px)] h-20 z-40 bg-surface/40 backdrop-blur-xl flex items-center justify-between px-5 md:px-10 bg-gradient-to-b from-[#181b25] to-transparent">
        <div className="flex items-center gap-4 bg-surface-container-lowest px-4 py-2 rounded-lg border border-outline-variant/10">
          <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm text-on-surface w-48 placeholder:text-slate-500 outline-none"
            placeholder="Search..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-6">
          <button className="text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-3 bg-surface-container rounded-full pl-2 pr-4 py-1.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">account_circle</span>
            </div>
            <span className="text-slate-100 font-bold text-sm tracking-tight">{shortAddr}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-[72px] pt-24 pb-28 md:pb-12 px-4 md:px-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Identity */}
          <section className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="w-[120px] h-[120px] rounded-full border-4 border-surface-container-high relative z-10 shadow-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-4xl">{displayName ? displayName.charAt(0).toUpperCase() : "?"}</span>
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-secondary rounded-full border-4 border-surface-container-high flex items-center justify-center z-20">
                <span className="material-symbols-outlined text-on-secondary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-headline font-bold tracking-tight text-on-surface">
                {displayName || "Anonymous"}
              </h2>
              <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
                <span className="font-mono text-sm text-primary tracking-wider break-all">
                  {address}
                </span>
                <button
                  onClick={() => navigator.clipboard?.writeText(address)}
                  className="hover:text-primary transition-colors text-slate-500 flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">content_copy</span>
                </button>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Balance Card */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-8 relative overflow-hidden group border border-outline-variant/5">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="space-y-1">
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Available Balance</p>
                  <div className="flex items-baseline gap-4 mt-2">
                    <h3 className="text-6xl font-headline font-bold text-on-surface">42,850.25</h3>
                    <span className="text-2xl font-headline font-medium text-primary">CRO</span>
                  </div>
                  <p className="font-mono text-slate-500 mt-2 text-lg">≈ $12,456.82 USD</p>
                </div>
                <div className="flex gap-4 mt-8">
                  <button className="flex-1 bg-gradient-to-br from-primary to-primary-container py-3 rounded-lg text-on-primary-fixed font-bold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">send</span> Send
                  </button>
                  <button className="flex-1 bg-surface-container-highest/50 py-3 rounded-lg border border-outline-variant/20 font-bold hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">add</span> Top Up
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              {[
                { label: "Groups Joined", val: "14", icon: "groups", color: "text-secondary" },
                { label: "Total Settled", val: "$2,840.00", icon: "account_balance", color: "text-secondary" },
                { label: "Member Since", val: "Oct 2023", icon: "calendar_today", color: "text-secondary" },
              ].map((s) => (
                <div key={s.label} className="bg-surface-container p-6 rounded-xl border border-outline-variant/5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400 text-sm font-medium">{s.label}</p>
                    <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                  </div>
                  <p className="text-3xl font-headline font-bold">{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Display Name Card */}
          <div className="glass-card rounded-xl p-8 border border-outline-variant/10 space-y-6">
            <h3 className="text-xl font-headline font-bold">Identity Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-widest text-outline">Display Name</label>
                <input
                  value={displayName}
                  onChange={(e) => { setDisplayName(e.target.value); setSaved(false); }}
                  className="w-full bg-surface-container-lowest rounded-xl p-4 text-on-surface placeholder:text-outline/50 border-none focus:ring-1 focus:ring-secondary/40 transition-all"
                  placeholder="e.g. Karthick"
                />
                <p className="text-xs text-outline">Stored off-chain. Shown to group members. Requires a wallet signature to verify.</p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-widest text-outline">Wallet Address</label>
                <div className="w-full bg-surface-container-lowest rounded-xl p-4 text-on-surface font-mono text-sm break-all border border-outline-variant/10">
                  {address}
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-error">{error}</p>}
            {saved && <p className="text-sm text-secondary">✓ Profile saved successfully</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving || !displayName.trim()}
                className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-bold rounded-xl disabled:opacity-40 flex items-center gap-2"
              >
                {saving
                  ? <><span className="material-symbols-outlined animate-spin text-sm">refresh</span> Saving...</>
                  : <><span className="material-symbols-outlined">save</span> Save Profile</>
                }
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 glass-card text-on-surface-variant font-bold rounded-xl hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-headline font-bold">Transaction History</h3>
              <button className="text-sm text-primary font-medium hover:underline">Export CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-widest border-b border-outline-variant/10">
                    <th className="pb-4 font-semibold">Activity</th>
                    <th className="pb-4 font-semibold">Status</th>
                    <th className="pb-4 font-semibold">Date</th>
                    <th className="pb-4 font-semibold">Hash</th>
                    <th className="pb-4 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {RECENT_TX.map((tx, i) => (
                    <tr key={i} className="group hover:bg-surface-container-highest/20 transition-colors">
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.bg.split(" ")[0]}`}>
                            <span className={`material-symbols-outlined ${tx.bg.split(" ")[1]}`}>{tx.icon}</span>
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{tx.label}</p>
                            <p className="text-xs text-slate-500">{tx.group}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full border border-secondary/20">CONFIRMED</span>
                      </td>
                      <td className="py-5 text-sm text-slate-400">{tx.date}</td>
                      <td className="py-5">
                        <span className="font-mono text-xs text-slate-500">{tx.hash}</span>
                      </td>
                      <td className={`py-5 text-right font-bold ${tx.color}`}>{tx.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Disconnect */}
          <div className="pt-8 flex justify-center">
            <button className="flex items-center gap-2 px-8 py-4 text-error font-bold rounded-xl border border-error/20 hover:bg-error/5 transition-all group active:scale-95">
              <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">power_settings_new</span>
              Disconnect Wallet
            </button>
          </div>
        </div>
      </main>

      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
