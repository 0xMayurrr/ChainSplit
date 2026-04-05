// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { VAULT_ABI } from "../abis/contracts";
import Sidebar from "../components/Sidebar";

export default function SettleUp() {
  const { address: vaultAddress } = useParams();
  const { address: userAddress }  = useAccount();
  const navigate                  = useNavigate();
  const vault                     = vaultAddress;

  const { data: info }        = useReadContract({ address: vault, abi: VAULT_ABI, functionName: "getGroupInfo" });
  const { data: settlements } = useReadContract({ address: vault, abi: VAULT_ABI, functionName: "calculateSettlements" });

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess }     = useWaitForTransactionReceipt({ hash: txHash });

  if (isSuccess) navigate(`/groups/${vault}`);

  const busy = isPending || isConfirming;

  if (!info) return (
    <div className="flex items-center justify-center min-h-screen text-on-surface-variant bg-background">
      Loading settlement data...
    </div>
  );

  const [groupName, groupEmoji, adminAddr, , , isSettled] = info;
  const isAdmin   = userAddress?.toLowerCase() === adminAddr?.toLowerCase();
  const debtors   = settlements?.[0] ?? [];
  const creditors = settlements?.[1] ?? [];
  const amounts   = settlements?.[2] ?? [];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      <Sidebar />

      {/* Header */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-72px)] flex justify-between items-center px-5 md:px-10 py-4 bg-background/60 backdrop-blur-xl z-40 border-b border-outline-variant/5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/groups/${vault}`)}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <p className="text-base font-headline font-bold text-on-surface">Settle Up</p>
            <p className="text-xs text-slate-400 font-mono">{groupEmoji} {groupName}</p>
          </div>
        </div>
        <ConnectButton />
      </header>

      {/* Main */}
      <main className="md:ml-[72px] pt-24 pb-28 md:pb-12 px-4 md:px-10">
        <div className="max-w-3xl mx-auto space-y-6">

          {isSettled || !settlements || debtors.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-headline font-bold mb-2">All Settled Up!</h2>
              <p className="text-on-surface-variant">No outstanding debts for this group.</p>
              <button onClick={() => navigate(`/groups/${vault}`)}
                className="mt-6 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl">
                Back to Group
              </button>
            </div>
          ) : (
            <>
              <div className="bg-surface-container rounded-3xl overflow-hidden border border-outline-variant/10">
                <div className="px-6 py-4 border-b border-outline-variant/10">
                  <h2 className="text-lg font-headline font-bold">Settlement Breakdown</h2>
                  <p className="text-xs text-slate-400">{debtors.length} transaction{debtors.length !== 1 ? "s" : ""} required</p>
                </div>
                <div className="divide-y divide-outline-variant/10">
                  {debtors.map((from, i) => {
                    const isUser = from.toLowerCase() === userAddress?.toLowerCase();
                    return (
                      <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-3 ${isUser ? "bg-secondary/5" : ""}`}>
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                          <span className={`font-mono text-xs ${isUser ? "text-error font-bold" : "text-on-surface-variant"}`}>
                            {from.slice(0, 6)}...{from.slice(-4)}
                            {isUser && <span className="ml-2 text-[10px] bg-error/10 text-error px-2 py-0.5 rounded-full">YOU</span>}
                          </span>
                          <span className="material-symbols-outlined text-secondary text-sm">arrow_forward</span>
                          <span className="font-mono text-xs text-secondary">{creditors[i].slice(0, 6)}...{creditors[i].slice(-4)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white">{formatEther(amounts[i])} CRO</span>
                          {isUser && !isSettled && (
                            <button
                              onClick={() => writeContract({ address: vault, abi: VAULT_ABI, functionName: "settleDebt", args: [creditors[i]], value: amounts[i] })}
                              disabled={busy}
                              className="px-4 py-2 bg-secondary text-on-secondary text-xs font-bold rounded-lg disabled:opacity-40 hover:brightness-110 transition-all">
                              {busy ? "Paying..." : "Pay Now"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isAdmin && !isSettled && (
                <button
                  onClick={() => writeContract({ address: vault, abi: VAULT_ABI, functionName: "markGroupSettled" })}
                  disabled={busy}
                  className="w-full py-4 glass-card rounded-2xl text-sm font-bold text-slate-400 hover:text-white transition-colors border border-outline-variant/10 disabled:opacity-40">
                  Mark Group as Fully Settled (Admin Only)
                </button>
              )}
            </>
          )}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container/90 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center py-3 z-50">
        {[
          { icon: "grid_view", label: "Home",  action: () => navigate("/dashboard") },
          { icon: "group",     label: "Groups", action: () => navigate("/groups") },
          { icon: "payments",  label: "Settle", action: () => {}, active: true },
          { icon: "account_circle", label: "Profile", action: () => navigate("/profile") },
        ].map(item => (
          <button key={item.label} onClick={item.action}
            className={`flex flex-col items-center gap-1 ${item.active ? "text-secondary" : "text-slate-500 hover:text-on-surface"} transition-colors`}>
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
