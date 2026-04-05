// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FACTORY_ABI, FACTORY_ADDRESS, VAULT_ABI } from "../abis/contracts";
import { formatEther } from "viem";
import Sidebar from "../components/Sidebar";

const EMOJIS = ["🏔️", "🏖️", "🏠", "🍕", "✈️", "🎉", "💼", "🎮", "🚗", "💸"];

function GroupCard({ vault, navigate }) {
  const { data: info } = useReadContract({
    address: vault, abi: VAULT_ABI, functionName: "getGroupInfo",
  });

  // guard: vault address must be valid before rendering
  if (!vault || !vault.startsWith("0x")) return null;
  if (!info) {
    return (
      <div className="bg-surface-container rounded-2xl p-6 animate-pulse h-40 border border-outline-variant/5" />
    );
  }

  const [name, emoji, , memberCount, totalExpenses, isSettled, balance] = info;

  function handleClick(e) {
    e.stopPropagation();
    navigate(`/groups/${vault}`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full text-left bg-surface-container rounded-2xl p-6 border border-outline-variant/5 hover:border-secondary/20 hover:bg-surface-container-high transition-all group cursor-pointer active:scale-[0.98]"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-2xl">
          {emoji}
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border
          ${isSettled
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-secondary/10 text-secondary border-secondary/20"}`}>
          {isSettled ? "Settled" : "Active"}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-headline font-bold text-on-surface mb-1 truncate">{name}</h3>
      <p className="text-xs text-slate-400 mb-6">
        {memberCount.toString()} members · {totalExpenses.toString()} expenses
      </p>

      {/* Bottom row */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Vault Balance</p>
          <p className="text-xl font-mono font-bold text-primary">{formatEther(balance)} CRO</p>
        </div>
        <span className="material-symbols-outlined text-slate-500 group-hover:text-secondary group-hover:translate-x-1 transition-all">
          arrow_forward
        </span>
      </div>
    </button>
  );
}

export default function Groups() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", emoji: "🏔️", adminName: "" });

  const { data: userGroupAddresses, refetch } = useReadContract({
    address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: "getUserGroups",
    args: address ? [address] : undefined, query: { enabled: !!address },
  });

  const { data: allGroups } = useReadContract({
    address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: "getGroups",
  });

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && showModal) {
      setShowModal(false);
      setForm({ name: "", emoji: "🏔️", adminName: "" });
      refetch();
    }
  }, [isSuccess]);

  const myGroups = allGroups?.filter((g) => userGroupAddresses?.includes(g.vault)) ?? [];
  const busy = isPending || isConfirming;

  if (!isConnected) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-background">
      <h2 className="text-2xl font-headline font-bold text-primary">Connect your wallet</h2>
      <ConnectButton />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      <Sidebar />

      {/* Main */}
      <main className="md:ml-[72px] min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center px-5 md:px-12 py-5 md:py-8 sticky top-0 bg-background/40 backdrop-blur-2xl z-40 border-b border-outline-variant/5">
          <div>
            <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">My Groups</h1>
            <p className="text-sm text-slate-400 mt-1">All your shared expense vaults on Cronos.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-headline font-bold text-on-primary-fixed text-sm hover:opacity-90 active:scale-95 transition-all"
              style={{ background: "linear-gradient(135deg, #adc6ff, #4d8eff)" }}
            >
              <span className="material-symbols-outlined">add</span>
              New Group
            </button>
            <ConnectButton />
          </div>
        </header>

        {/* Content */}
        <section className="px-4 md:px-12 py-6 pb-28 md:pb-8">
          {myGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="w-24 h-24 rounded-3xl bg-surface-container flex items-center justify-center text-5xl border border-outline-variant/10">
                🏝️
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-headline font-bold mb-2">No groups yet</h2>
                <p className="text-slate-400">Create your first shared vault to start splitting expenses.</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-8 py-4 rounded-xl font-headline font-bold text-on-primary-fixed"
                style={{ background: "linear-gradient(135deg, #adc6ff, #4d8eff)" }}
              >
                Create First Group
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {myGroups.map((g) => (
                <GroupCard key={g.vault} vault={g.vault} navigate={navigate} />
              ))}

              {/* Create new card */}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="border-2 border-dashed border-outline-variant/20 rounded-2xl flex flex-col items-center justify-center py-10 gap-4 hover:border-secondary/40 hover:bg-secondary/5 transition-all group active:scale-[0.98] min-h-[180px]"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-slate-500 group-hover:text-secondary">add</span>
                </div>
                <span className="font-headline font-bold text-slate-400 group-hover:text-secondary">Create New Group</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container/90 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center py-3 z-50">
        {[
          { icon: "grid_view",    label: "Home",    action: () => navigate("/dashboard") },
          { icon: "group",        label: "Groups",  action: () => {}, active: true },
          { icon: "add_circle",   label: "New",     action: () => setShowModal(true), highlight: true },
          { icon: "account_circle", label: "Profile", action: () => navigate("/profile") },
        ].map(item => (
          <button key={item.label} onClick={item.action}
            className={`flex flex-col items-center gap-1 ${item.highlight ? "text-secondary" : item.active ? "text-primary" : "text-slate-500 hover:text-on-surface"} transition-colors`}>
            <span className="material-symbols-outlined text-2xl" style={item.highlight || item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {item.icon}
            </span>
            <span className="text-[9px] font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Create Group Modal ─────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-6 bg-surface-dim/80 backdrop-blur-md"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full sm:max-w-md bg-surface-container-low sm:rounded-2xl rounded-t-2xl shadow-2xl border border-outline-variant/10 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-outline-variant/40" />
            </div>

            <div className="px-6 pt-5 pb-4 border-b border-outline-variant/10 flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold">Create New Group</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Emoji picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Group Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((e) => (
                    <button key={e} onClick={() => setForm({ ...form, emoji: e })}
                      className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all
                        ${form.emoji === e ? "bg-primary/20 ring-2 ring-primary" : "bg-surface-container hover:bg-surface-container-high border border-outline-variant/10"}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Group Name</label>
                <input
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface placeholder:text-slate-600 focus:ring-1 focus:ring-secondary/40 outline-none"
                  placeholder="e.g. Goa Trip 2025"
                />
              </div>

              {/* Admin name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Your Display Name</label>
                <input
                  value={form.adminName} onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface placeholder:text-slate-600 focus:ring-1 focus:ring-secondary/40 outline-none"
                  placeholder="e.g. Karthick"
                />
              </div>

              {/* Info */}
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3 items-start">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This deploys a smart contract vault on Cronos. A small gas fee applies. No personal data is stored on-chain.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-4 rounded-xl font-headline font-bold text-slate-400 bg-surface-container-highest/50">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!form.name || !form.adminName) return;
                  writeContract({
                    address: FACTORY_ADDRESS, abi: FACTORY_ABI,
                    functionName: "createGroup",
                    args: [form.name, form.emoji, form.adminName],
                  });
                }}
                disabled={busy || !form.name || !form.adminName}
                className="flex-[2] py-4 rounded-xl font-headline font-bold text-on-primary-fixed disabled:opacity-40 active:scale-95 transition-all"
                style={{ background: "linear-gradient(135deg, #adc6ff, #4d8eff)" }}
              >
                {busy ? "Deploying Vault..." : "Deploy Vault on Cronos"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
