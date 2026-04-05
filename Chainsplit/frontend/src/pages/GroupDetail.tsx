// @ts-nocheck
import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAccount, useReadContract, useWriteContract,
  useWaitForTransactionReceipt, useSignMessage,
} from "wagmi";
import { formatEther, parseEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { VAULT_ABI } from "../abis/contracts";
import { uploadReceipt, pinExpenseMeta, attachExpenseIpfs } from "../services/api";
import Sidebar from "../components/Sidebar";

/* ── constants ─────────────────────────────────────────────────── */
const CATEGORIES = ["General", "Food", "Transport", "Stay", "Fun", "Other"];
const CAT_EMOJI  = ["💸", "🍔", "🚗", "🏨", "🎉", "📦"];
const CAT_ICON   = ["payments", "restaurant", "directions_car", "hotel", "local_activity", "inventory_2"];
const CAT_COLOR  = ["text-primary", "text-orange-400", "text-blue-400", "text-purple-400", "text-green-400", "text-slate-400"];
const CAT_BG     = ["bg-primary/10", "bg-orange-400/10", "bg-blue-400/10", "bg-purple-400/10", "bg-green-400/10", "bg-slate-400/10"];

/* ── MemberBalanceRow ───────────────────────────────────────────── */
function MemberBalanceRow({ vault, member, adminAddress }) {
  const { data }    = useReadContract({ address: vault, abi: VAULT_ABI, functionName: "members", args: [member] });
  const { data: balance } = useReadContract({ address: vault, abi: VAULT_ABI, functionName: "getMemberNetBalance", args: [member] });
  const displayName = data?.[1] || member.slice(0, 6) + "..." + member.slice(-4);
  const net         = balance ?? 0n;
  const isAdmin     = member.toLowerCase() === adminAddress?.toLowerCase();
  const isPos       = net >= 0n;
  const isZero      = net === 0n;

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border-l-4 bg-surface-container transition-all
      ${isZero ? "border-outline-variant/40" : isPos ? "border-secondary/60" : "border-error/60"}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center font-bold text-sm text-on-surface">
          {displayName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-sm flex items-center gap-2">
            {displayName}
            {isAdmin && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Admin</span>}
          </p>
          <p className="text-[10px] font-mono text-slate-500">
            {isZero ? "Balanced" : isPos ? "Is owed" : "Owes others"}
          </p>
        </div>
      </div>
      <span className={`font-mono font-bold text-base ${isZero ? "text-slate-400" : isPos ? "text-secondary" : "text-error"}`}>
        {isPos && !isZero ? "+" : ""}{formatEther(net)} CRO
      </span>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function GroupDetail() {
  const { address: vaultAddress } = useParams();
  const { address: userAddress }  = useAccount();
  const navigate                  = useNavigate();
  const vault                     = vaultAddress;

  /* local state */
  const [tab,          setTab]          = useState("expenses");
  const [showExpense,  setShowExpense]  = useState(false);
  const [showMember,   setShowMember]   = useState(false);
  const [showSettle,   setShowSettle]   = useState<any>(null);
  const [showDeposit,  setShowDeposit]  = useState(false);
  const [depositAmt,   setDepositAmt]   = useState("");
  const [filterCat,    setFilterCat]    = useState("All");
  const [expForm,      setExpForm]      = useState({ name: "", amount: "", category: "0" });
  const [memberForm,   setMemberForm]   = useState({ wallet: "", name: "" });
  const [receiptFile,  setReceiptFile]  = useState<File | null>(null);
  const [ipfsStatus,   setIpfsStatus]   = useState<"idle"|"uploading"|"done"|"error">("idle");
  const [lastExpId,    setLastExpId]    = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { signMessageAsync } = useSignMessage();

  /* contract reads */
  const { data: info,        refetch: refetchInfo }     = useReadContract({ address: vault, abi: VAULT_ABI, functionName: "getGroupInfo" });
  const { data: members,     refetch: refetchMembers }  = useReadContract({ address: vault, abi: VAULT_ABI, functionName: "getMembers" });
  const { data: expenses,    refetch: refetchExpenses } = useReadContract({ address: vault, abi: VAULT_ABI, functionName: "getExpenses" });
  const { data: settlements }                           = useReadContract({ address: vault, abi: VAULT_ABI, functionName: "calculateSettlements" });

  /* contract writes */
  const { writeContract, data: txHash, isPending }          = useWriteContract();
  const { isLoading: isConfirming, isSuccess }              = useWaitForTransactionReceipt({ hash: txHash });

  /* post-tx effects */
  if (isSuccess) {
    refetchInfo(); refetchMembers(); refetchExpenses();
    if (lastExpId !== null && userAddress) {
      const expId = lastExpId;
      setIpfsStatus("uploading");
      (async () => {
        try {
          let receiptCid: string | undefined;
          if (receiptFile) {
            const r = await uploadReceipt(vault!, receiptFile, userAddress, signMessageAsync);
            receiptCid = r.cid;
          }
          const meta = await pinExpenseMeta(vault!, {
            expenseName: expForm.name, amount: expForm.amount,
            category: parseInt(expForm.category), receiptCid,
            paidBy: userAddress, splitAmong: [...(members ?? [])],
          }, userAddress, signMessageAsync);
          await attachExpenseIpfs(vault!, expId, meta.cid, userAddress, signMessageAsync);
          setIpfsStatus("done");
        } catch { setIpfsStatus("error"); }
      })();
      setLastExpId(null);
    }
    setShowExpense(false); setShowMember(false); setShowSettle(null);
    setShowDeposit(false); setDepositAmt("");
    setReceiptFile(null);
  }

  /* loading */
  if (!info) return (
    <div className="flex items-center justify-center min-h-screen bg-background text-on-surface-variant">
      <div className="text-center space-y-4">
        <span className="material-symbols-outlined text-5xl text-primary animate-pulse">hub</span>
        <p className="font-mono text-sm">Loading vault...</p>
      </div>
    </div>
  );

  const [groupName, groupEmoji, adminAddr, memberCount, totalExpenses, isSettled, balance] = info;
  const isAdmin       = userAddress?.toLowerCase() === adminAddr?.toLowerCase();
  const activeExpenses = expenses?.filter(e => !e.isDeleted) ?? [];
  const busy          = isPending || isConfirming;
  const debtors       = settlements?.[0] ?? [];
  const creditors     = settlements?.[1] ?? [];
  const amounts       = settlements?.[2] ?? [];

  /* filtered expenses */
  const filteredExpenses = filterCat === "All"
    ? activeExpenses
    : activeExpenses.filter(e => CATEGORIES[e.category] === filterCat);

  function handleAddExpense() {
    if (!expForm.name || !expForm.amount || !members?.length || !userAddress) return;
    setLastExpId(Number(totalExpenses));
    writeContract({
      address: vault, abi: VAULT_ABI, functionName: "addExpenseEqual",
      args: [expForm.name, parseEther(expForm.amount), userAddress, parseInt(expForm.category), [...members]],
    });
  }

  function handleAddMember() {
    if (!memberForm.wallet || !memberForm.name) return;
    writeContract({ address: vault, abi: VAULT_ABI, functionName: "addMember", args: [memberForm.wallet, memberForm.name] });
  }

  function handleSettle() {
    if (!showSettle) return;
    writeContract({ address: vault, abi: VAULT_ABI, functionName: "settleDebt", args: [showSettle.to], value: showSettle.amount });
  }

  function handleDeposit() {
    if (!depositAmt) return;
    writeContract({ address: vault, abi: VAULT_ABI, functionName: "deposit", value: parseEther(depositAmt) });
  }

  function handleWithdraw() {
    writeContract({ address: vault, abi: VAULT_ABI, functionName: "withdrawRemaining" });
  }

  /* ── JSX ─────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* ── HERO HEADER ─────────────────────────────────────────── */}
      <div className="md:ml-72">
        <section className="relative w-full overflow-hidden" style={{ minHeight: 280 }}>
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0e1422] via-[#10131c] to-[#0a0d17]" />
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute -top-20 right-10 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(68,226,205,0.08) 0%, transparent 70%)" }} />
          <div className="absolute top-0 left-40 w-[300px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(173,198,255,0.06) 0%, transparent 70%)" }} />
          {/* Fade to page bg at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />

          {/* Content */}
          <div className="relative z-10 px-6 md:px-12 pt-6 pb-14">
            {/* Top bar for mobile */}
            <div className="flex items-center justify-between mb-8 md:hidden">
              <button onClick={() => navigate("/dashboard")}
                className="w-10 h-10 rounded-full bg-surface-container/60 backdrop-blur flex items-center justify-center text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <span className="font-headline font-bold text-primary tracking-tight">ChainSplit</span>
              <ConnectButton />
            </div>

            {/* Desktop top bar */}
            <div className="hidden md:flex justify-end mb-8">
              <ConnectButton />
            </div>

            {/* Group identity */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-3">
                {/* Status pill + members */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border
                    ${isSettled
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-secondary/10 text-secondary border-secondary/20"}`}>
                    {isSettled ? "Settled" : "Active Group"}
                  </span>
                  {/* Member avatars */}
                  <div className="flex -space-x-2">
                    {members?.slice(0, 4).map((m, i) => (
                      <div key={m} className="w-7 h-7 rounded-full border-2 border-background bg-surface-container-highest flex items-center justify-center text-[9px] font-bold">
                        {m.slice(2, 4).toUpperCase()}
                      </div>
                    ))}
                    {(memberCount > 4) && (
                      <div className="w-7 h-7 rounded-full border-2 border-background bg-surface-container-highest flex items-center justify-center text-[9px] text-primary font-bold">
                        +{memberCount - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{memberCount.toString()} members · {totalExpenses.toString()} expenses</span>
                </div>

                {/* Group name */}
                <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface leading-none">
                  {groupEmoji} {groupName}
                </h1>

                {/* Vault balance */}
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-400 text-sm font-medium">Vault Balance</span>
                  <span className="text-3xl font-headline font-bold text-primary tracking-tight">{formatEther(balance)} CRO</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {!isSettled && (
                  <button onClick={() => setShowExpense(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-headline font-bold text-on-primary-fixed text-sm hover:opacity-90 active:scale-95 transition-all"
                    style={{ background: "linear-gradient(135deg, #adc6ff, #4d8eff)" }}>
                    <span className="material-symbols-outlined text-xl">add</span>
                    Add Expense
                  </button>
                )}
                <button onClick={() => setShowDeposit(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-headline font-bold text-sm bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-xl">savings</span>
                  Deposit
                </button>
                {!isSettled && isAdmin && (
                  <button onClick={() => setShowMember(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-headline font-bold text-sm glass-card border border-outline-variant/20 hover:bg-white/10 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-xl">person_add</span>
                    Invite Member
                  </button>
                )}
                {!isSettled && (
                  <button onClick={() => setTab("settlements")}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-headline font-bold text-secondary text-sm bg-secondary/10 border border-secondary/25 hover:bg-secondary/20 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                    Settle Now
                  </button>
                )}
                {isSettled && isAdmin && (
                  <button onClick={handleWithdraw} disabled={busy}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-headline font-bold text-sm bg-tertiary/10 border border-tertiary/20 text-tertiary hover:bg-tertiary/20 active:scale-95 transition-all disabled:opacity-40">
                    <span className="material-symbols-outlined text-xl">download</span>
                    {busy ? "Withdrawing..." : "Withdraw Remaining"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ──────────────────────────────────────── */}
        <div className="px-6 md:px-12 pb-28 md:pb-12 -mt-4">

          {/* Mobile tabs */}
          <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl mb-6 w-fit">
            {["expenses", "members", "settlements"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-colors
                  ${tab === t ? "bg-surface-container-highest text-secondary" : "text-on-surface-variant hover:text-on-surface"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* ── TWO COLUMN LAYOUT (desktop) ───────────────────── */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* LEFT: Expenses */}
            {(tab === "expenses" || window.innerWidth >= 1024) && (
              <div className={`lg:flex-1 ${tab !== "expenses" && "hidden lg:block"}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-headline font-bold">Recent Expenses</h2>
                  <span className="text-xs font-mono text-slate-500 px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant/10">
                    {activeExpenses.length} total
                  </span>
                </div>

                {/* Category filter pills */}
                <div className="flex gap-2 flex-wrap mb-5">
                  {["All", ...CATEGORIES].map(cat => (
                    <button key={cat} onClick={() => setFilterCat(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
                        ${filterCat === cat
                          ? "bg-secondary/10 text-secondary border-secondary/30"
                          : "bg-surface-container text-slate-400 border-outline-variant/10 hover:border-secondary/20 hover:text-on-surface"}`}>
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/5">
                  {filteredExpenses.length === 0 ? (
                    <div className="p-12 text-center">
                      <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">receipt_long</span>
                      <p className="text-on-surface-variant text-sm">No expenses yet.</p>
                      {!isSettled && (
                        <button onClick={() => setShowExpense(true)}
                          className="mt-4 px-4 py-2 text-sm font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5">
                          Add first expense
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Table header */}
                      <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto] gap-x-4 px-6 py-3 bg-surface-container-lowest/50 border-b border-outline-variant/10">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Cat.</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Name</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Paid By</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 text-right">Amount</span>
                      </div>
                      <div className="divide-y divide-outline-variant/10">
                        {filteredExpenses.map(e => (
                          <div key={e.id.toString()}
                            className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container transition-colors group">
                            {/* Category icon */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${CAT_BG[e.category] ?? "bg-primary/10"}`}>
                              <span className={`material-symbols-outlined text-lg ${CAT_COLOR[e.category] ?? "text-primary"}`}
                                style={{ fontVariationSettings: "'FILL' 1" }}>
                                {CAT_ICON[e.category] ?? "payments"}
                              </span>
                            </div>
                            {/* Name */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{e.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{CATEGORIES[e.category]}</p>
                            </div>
                            {/* Paid by */}
                            <div className="hidden sm:flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-[9px] font-bold">
                                {e.paidBy.slice(2, 4).toUpperCase()}
                              </div>
                              <span className="text-xs font-mono text-slate-400">
                                {e.paidBy.slice(0, 6)}...{e.paidBy.slice(-4)}
                              </span>
                            </div>
                            {/* Amount */}
                            <span className="font-mono font-bold text-primary text-sm flex-shrink-0">
                              {formatEther(e.amount)} CRO
                            </span>
                            {/* Delete */}
                            {isAdmin && !isSettled && (
                              <button onClick={() => writeContract({ address: vault, abi: VAULT_ABI, functionName: "deleteExpense", args: [e.id] })}
                                disabled={busy}
                                className="opacity-0 group-hover:opacity-100 text-error hover:text-red-400 transition-all">
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* RIGHT COLUMN: Members + Settlements */}
            <div className={`lg:w-[360px] flex-shrink-0 space-y-6 ${tab === "expenses" ? "hidden lg:flex flex-col" : ""}`}>

              {/* ── Member Balances ─────────────────────────── */}
              {(tab === "members" || window.innerWidth >= 1024) && (
                <div className={tab !== "members" ? "hidden lg:block" : ""}>
                  <h3 className="text-lg font-headline font-bold mb-4">Member Balances</h3>
                  <div className="space-y-3">
                    {members?.map(m => (
                      <MemberBalanceRow key={m} vault={vault} member={m} adminAddress={adminAddr} />
                    ))}
                    {(!members || members.length === 0) && (
                      <p className="text-slate-500 text-sm text-center py-6">No members yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Settlement Preview ──────────────────────── */}
              {(tab === "settlements" || window.innerWidth >= 1024) && (
                <div className={tab !== "settlements" ? "hidden lg:block" : ""}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-secondary">account_tree</span>
                    <h3 className="text-lg font-headline font-bold">Settlement Preview</h3>
                  </div>

                  <div className="bg-surface-container rounded-2xl border border-outline-variant/10 overflow-hidden">
                    {!debtors.length ? (
                      <div className="p-10 text-center">
                        <span className="text-4xl block mb-3">🎉</span>
                        <p className="font-bold text-secondary">All settled up!</p>
                        <p className="text-xs text-slate-400 mt-1">No outstanding debts.</p>
                      </div>
                    ) : (
                      <>
                        {/* Settlement rows */}
                        <div className="divide-y divide-outline-variant/10">
                          {debtors.map((from, i) => {
                            const isUser = from.toLowerCase() === userAddress?.toLowerCase();
                            return (
                              <div key={i} className={`flex items-center justify-between px-5 py-4 ${isUser ? "bg-secondary/5" : ""}`}>
                                {/* From → To */}
                                <div className="flex items-center gap-2 text-xs">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold border
                                    ${isUser ? "border-error/40 bg-error/10" : "border-outline-variant/20 bg-surface-container-highest"}`}>
                                    {from.slice(2, 4).toUpperCase()}
                                  </div>
                                  <span className={`font-mono ${isUser ? "text-error" : "text-slate-400"}`}>
                                    {from.slice(0, 5)}...{from.slice(-3)}
                                    {isUser && <span className="ml-1 text-[9px] bg-error/10 text-error px-1.5 rounded-full">YOU</span>}
                                  </span>
                                  <span className="material-symbols-outlined text-secondary text-sm">arrow_forward</span>
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold border border-secondary/30 bg-secondary/10">
                                    {creditors[i].slice(2, 4).toUpperCase()}
                                  </div>
                                </div>
                                {/* Amount + Pay */}
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-secondary text-sm">
                                    {formatEther(amounts[i])} CRO
                                  </span>
                                  {isUser && !isSettled && (
                                    <button
                                      onClick={() => setShowSettle({ to: creditors[i], amount: amounts[i] })}
                                      className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-secondary text-on-secondary hover:opacity-90 glow-secondary">
                                      Pay
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Execute button */}
                        {isAdmin && !isSettled && (
                          <div className="p-5 border-t border-outline-variant/10 space-y-3">
                            <button
                              onClick={() => writeContract({ address: vault, abi: VAULT_ABI, functionName: "markGroupSettled" })}
                              disabled={busy}
                              className="w-full py-4 rounded-xl font-headline font-bold flex items-center justify-center gap-3 disabled:opacity-40 active:scale-95 transition-all glow-secondary"
                              style={{ background: "linear-gradient(135deg, #44e2cd, #03c6b2)" }}>
                              <span className="text-on-secondary">Execute Settlements</span>
                              <span className="material-symbols-outlined text-on-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                            </button>
                            <p className="text-center text-[10px] font-mono text-slate-500">
                              Gas estimate: ~0.15 CRO
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container/90 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center py-3 z-50">
        {[
          { icon: "grid_view",    label: "Home",      action: () => navigate("/dashboard") },
          { icon: "group",        label: "Groups",    action: () => navigate("/groups") },
          { icon: "add_circle",   label: "Expense",   action: () => setShowExpense(true), highlight: true },
          { icon: "payments",     label: "Settle",    action: () => setTab("settlements") },
          { icon: "account_circle", label: "Profile", action: () => navigate("/profile") },
        ].map(item => (
          <button key={item.label} onClick={item.action}
            className={`flex flex-col items-center gap-1 ${item.highlight ? "text-secondary" : "text-slate-500 hover:text-on-surface"} transition-colors`}>
            <span className="material-symbols-outlined text-2xl" style={item.highlight ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {item.icon}
            </span>
            <span className="text-[9px] font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          MODALS
      ═══════════════════════════════════════════════════════════ */}

      {/* Add Expense Modal */}
      {showExpense && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-6 bg-surface-dim/80 backdrop-blur-md"
          onClick={() => setShowExpense(false)}>
          <div className="w-full sm:max-w-[560px] bg-surface-container-low sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl border border-outline-variant/10"
            onClick={e => e.stopPropagation()}>

            {/* Handle bar (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-outline-variant/40" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-4 border-b border-outline-variant/10">
              <h2 className="text-xl font-headline font-bold">Add Expense</h2>
              <button onClick={() => setShowExpense(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-highest/60 hover:bg-surface-container-highest text-slate-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="px-6 py-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Amount */}
              <div className="bg-surface-container rounded-xl p-5 text-center">
                <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-2">Amount in CRO</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-xl font-mono text-primary-fixed-dim">CRO</span>
                  <input type="number" value={expForm.amount}
                    onChange={e => setExpForm({ ...expForm, amount: e.target.value })}
                    className="bg-transparent border-none focus:ring-0 text-5xl font-headline font-bold tracking-tight text-on-surface w-40 text-center placeholder:text-slate-700 outline-none"
                    placeholder="0.00" />
                </div>
                <p className="text-xs text-secondary mt-2 font-mono">
                  Split equally among {members?.length ?? 0} members
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description</label>
                <input value={expForm.name} onChange={e => setExpForm({ ...expForm, name: e.target.value })}
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface placeholder:text-slate-600 focus:ring-1 focus:ring-secondary/40 outline-none"
                  placeholder="e.g. Beachside Dinner" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat, i) => (
                    <button key={cat} onClick={() => setExpForm({ ...expForm, category: i.toString() })}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all text-xs font-semibold
                        ${expForm.category === i.toString()
                          ? `${CAT_BG[i]} border-current ${CAT_COLOR[i]}`
                          : "bg-surface-container border-outline-variant/10 text-slate-400 hover:border-secondary/20"}`}>
                      <span className={`material-symbols-outlined text-lg ${CAT_COLOR[i]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        {CAT_ICON[i]}
                      </span>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Receipt upload */}
              <div>
                <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden"
                  onChange={e => setReceiptFile(e.target.files?.[0] ?? null)} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full py-3 border-2 border-dashed border-outline-variant/20 rounded-xl text-sm text-slate-400 hover:border-secondary/40 hover:text-secondary transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">cloud_upload</span>
                  {receiptFile ? receiptFile.name : "Attach Receipt (IPFS, optional)"}
                </button>
                {ipfsStatus === "uploading" && <p className="text-xs text-secondary mt-1.5 font-mono">Pinning to IPFS...</p>}
                {ipfsStatus === "done"      && <p className="text-xs text-primary mt-1.5 font-mono">✓ Receipt pinned</p>}
                {ipfsStatus === "error"     && <p className="text-xs text-error mt-1.5 font-mono">IPFS upload failed (expense saved on-chain)</p>}
              </div>

              {/* Gas */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Est. gas: <span className="text-secondary">~0.001 CRO</span></span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  Cronos Mainnet
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowExpense(false)}
                className="flex-1 py-4 rounded-xl font-headline font-bold text-slate-400 bg-surface-container-highest/60 hover:bg-surface-container-highest transition-colors">
                Cancel
              </button>
              <button onClick={handleAddExpense} disabled={busy || !expForm.name || !expForm.amount}
                className="flex-[2] py-4 rounded-xl font-headline font-bold disabled:opacity-40 active:scale-95 transition-all flex items-center justify-center gap-2 text-on-primary-fixed"
                style={{ background: "linear-gradient(135deg, #adc6ff, #4d8eff)" }}>
                {busy ? "Adding..." : "Log On-Chain"}
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMember && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-6 bg-surface-dim/80 backdrop-blur-md"
          onClick={() => setShowMember(false)}>
          <div className="w-full sm:max-w-md bg-surface-container-low sm:rounded-2xl rounded-t-2xl p-6 space-y-5 shadow-2xl border border-outline-variant/10"
            onClick={e => e.stopPropagation()}>
            <div className="flex sm:hidden justify-center mb-2">
              <div className="w-10 h-1 rounded-full bg-outline-variant/40" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold">Invite Member</h3>
              <button onClick={() => setShowMember(false)} className="text-slate-400 hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <input value={memberForm.wallet} onChange={e => setMemberForm({ ...memberForm, wallet: e.target.value })}
              className="w-full bg-surface-container-lowest border-none rounded-xl p-4 font-mono text-sm text-on-surface placeholder:text-slate-600 focus:ring-1 focus:ring-secondary/40 outline-none"
              placeholder="Wallet address (0x...)" />
            <input value={memberForm.name} onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
              className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface placeholder:text-slate-600 focus:ring-1 focus:ring-secondary/40 outline-none"
              placeholder="Display name" />
            <div className="flex gap-3">
              <button onClick={() => setShowMember(false)}
                className="flex-1 py-3 rounded-xl font-bold text-slate-400 bg-surface-container-highest/50">Cancel</button>
              <button onClick={handleAddMember} disabled={busy || !memberForm.wallet || !memberForm.name}
                className="flex-1 py-3 rounded-xl font-bold text-on-primary disabled:opacity-40 bg-primary">
                {busy ? "Adding..." : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-6 bg-surface-dim/80 backdrop-blur-md"
          onClick={() => setShowDeposit(false)}>
          <div className="w-full sm:max-w-md bg-surface-container-low sm:rounded-2xl rounded-t-2xl p-6 space-y-5 shadow-2xl border border-outline-variant/10"
            onClick={e => e.stopPropagation()}>
            <div className="flex sm:hidden justify-center mb-2">
              <div className="w-10 h-1 rounded-full bg-outline-variant/40" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold">Deposit to Vault</h3>
              <button onClick={() => setShowDeposit(false)} className="text-slate-400 hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="bg-surface-container rounded-xl p-5 text-center">
              <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-2">Amount in CRO</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-xl font-mono text-primary">CRO</span>
                <input type="number" value={depositAmt} onChange={e => setDepositAmt(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-5xl font-headline font-bold tracking-tight text-on-surface w-40 text-center placeholder:text-slate-700 outline-none"
                  placeholder="0.00" />
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">Funds are held in the smart contract vault</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeposit(false)}
                className="flex-1 py-4 rounded-xl font-headline font-bold text-slate-400 bg-surface-container-highest/50">Cancel</button>
              <button onClick={handleDeposit} disabled={busy || !depositAmt}
                className="flex-[2] py-4 rounded-xl font-headline font-bold text-on-primary-fixed disabled:opacity-40 active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #adc6ff, #4d8eff)" }}>
                {busy ? "Depositing..." : "Deposit to Vault"}
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settle Modal */}
      {showSettle && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-6 bg-surface-dim/80 backdrop-blur-md"
          onClick={() => setShowSettle(null)}>
          <div className="w-full sm:max-w-md bg-surface-container-low sm:rounded-2xl rounded-t-2xl p-6 space-y-6 shadow-2xl border border-outline-variant/10"
            onClick={e => e.stopPropagation()}>
            <div className="flex sm:hidden justify-center mb-2">
              <div className="w-10 h-1 rounded-full bg-outline-variant/40" />
            </div>
            <h3 className="text-xl font-headline font-bold">Confirm Payment</h3>
            <div className="p-6 bg-surface-container rounded-xl text-center space-y-2">
              <p className="text-slate-400 text-sm">You are paying</p>
              <p className="text-4xl font-headline font-bold text-secondary">{formatEther(showSettle.amount)} CRO</p>
              <p className="text-sm text-slate-400">
                to <span className="font-mono text-on-surface">{showSettle.to.slice(0, 8)}...{showSettle.to.slice(-6)}</span>
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-2">1% protocol fee will be deducted</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSettle(null)}
                className="flex-1 py-3 rounded-xl font-bold text-slate-400 bg-surface-container-highest/50">Cancel</button>
              <button onClick={handleSettle} disabled={busy}
                className="flex-1 py-3 rounded-xl font-bold text-on-secondary disabled:opacity-40 glow-secondary"
                style={{ background: "linear-gradient(135deg, #44e2cd, #03c6b2)" }}>
                {busy ? "Paying..." : "Confirm & Pay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
