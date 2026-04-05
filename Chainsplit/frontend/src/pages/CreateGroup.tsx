// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FACTORY_ABI, FACTORY_ADDRESS } from "../abis/contracts";
import Sidebar from "../components/Sidebar";

const EMOJIS = ["🏔️", "🏖️", "🏠", "🍕", "✈️", "🎉", "💼", "🎮", "🚗", "💸"];
const CATEGORIES = [
  { label: "Trip", icon: "✈️" },
  { label: "Flat", icon: "🏠" },
  { label: "Office", icon: "💼" },
  { label: "Friends", icon: "🎉" },
  { label: "Other", icon: "💸" },
];

const STEPS = ["Info", "Members", "Vault", "Deploy"];

export default function CreateGroup() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏔️");
  const [adminName, setAdminName] = useState("");
  const [activeCategory, setActiveCategory] = useState("Trip");
  const [currentStep] = useState(0);

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  if (isSuccess) navigate("/dashboard");

  const busy = isPending || isConfirming;

  function handleDeploy() {
    if (!name || !adminName) return;
    writeContract({ address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: "createGroup", args: [name, emoji, adminName] });
  }

  if (!isConnected) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-surface">
      <ConnectButton />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <Sidebar />

      {/* Blurred Dashboard Background */}
      <div className="md:ml-[72px] min-h-screen relative">
        {/* Background blur content */}
        <div className="fixed inset-0 md:ml-[72px] z-0 opacity-20 pointer-events-none blur-sm">
          <div className="grid grid-cols-3 gap-6 p-12 mt-20">
            <div className="h-48 bg-surface-container-low rounded-xl" />
            <div className="h-48 bg-surface-container-low rounded-xl" />
            <div className="h-48 bg-surface-container-low rounded-xl" />
            <div className="col-span-2 h-96 bg-surface-container-low rounded-xl" />
            <div className="h-96 bg-surface-container-low rounded-xl" />
          </div>
        </div>

        {/* Modal Overlay */}
        <div className="fixed inset-0 md:ml-[72px] z-50 flex items-center justify-center bg-surface-container-lowest/60 backdrop-blur-sm p-4 md:p-0">
          <div className="w-full max-w-[700px] glass-panel rounded-xl shadow-2xl border border-outline-variant/15 flex flex-col overflow-hidden max-h-[95vh] md:max-h-none">
            {/* Modal Header */}
            <div className="px-5 md:px-10 pt-10 pb-6">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-headline font-bold text-on-surface">Create Group</h1>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container-high"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Step Indicator */}
              <div className="relative flex justify-between items-center px-4">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-surface-container-highest -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 z-0 transition-all duration-500"
                  style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%`, background: "linear-gradient(to right, #adc6ff, #4d8eff)" }}
                />
                {STEPS.map((step, i) => (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full transition-all ${
                        i <= currentStep
                          ? "shadow-[0_0_10px_rgba(173,198,255,0.5)]"
                          : "bg-surface-container-highest border-2 border-outline-variant"
                      }`}
                      style={i <= currentStep ? { background: "linear-gradient(135deg, #adc6ff 0%, #4d8eff 100%)" } : {}}
                    />
                    <span className={`text-[10px] font-headline font-medium uppercase tracking-widest ${i <= currentStep ? "text-primary" : "text-on-surface-variant"}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 px-5 md:px-10 py-6 overflow-y-auto max-h-[60vh] md:max-h-[500px]">
              <div className="space-y-8">
                {/* Emoji + Name Row */}
                <div className="flex gap-8">
                  {/* Emoji Picker */}
                  <div className="group relative">
                    <div className="w-24 h-24 bg-surface-container-lowest rounded-xl flex items-center justify-center border border-outline-variant/15 hover:border-secondary/40 transition-all cursor-pointer">
                      <span className="text-4xl">{emoji}</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-surface-container-highest w-8 h-8 rounded-lg flex items-center justify-center border border-outline-variant/30 text-on-surface">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </div>
                  </div>

                  {/* Name + Admin Name */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-2">Group Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-surface-container-lowest border-none rounded-lg p-4 text-lg focus:ring-1 focus:ring-secondary/40 transition-all placeholder:text-outline/40 text-on-surface"
                        placeholder="e.g. Alps Expedition 2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-2">Your Display Name</label>
                      <input
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full bg-surface-container-lowest border-none rounded-lg p-4 text-lg focus:ring-1 focus:ring-secondary/40 transition-all placeholder:text-outline/40 text-on-surface"
                        placeholder="e.g. Karthick"
                      />
                    </div>
                  </div>
                </div>

                {/* Emoji Picker Grid */}
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-3">Pick an Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => setEmoji(e)}
                        className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                          emoji === e
                            ? "bg-primary/20 ring-2 ring-primary"
                            : "bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/15"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-on-surface-variant">Group Category</label>
                  <div className="flex flex-wrap gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.label}
                        onClick={() => setActiveCategory(cat.label)}
                        className={`px-6 py-2 rounded-full border font-medium transition-all ${
                          activeCategory === cat.label
                            ? "border-secondary/40 bg-secondary/10 text-secondary"
                            : "border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:text-on-surface"
                        }`}
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary-container/20 to-transparent border border-primary/10">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">info</span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-on-surface">Vault Smart Contract</h4>
                      <p className="text-sm text-on-surface-variant mt-1">
                        Every group creates a unique multi-signature vault on Cronos for secure asset management.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <div>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-1">Network</p>
                    <p className="text-sm font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />Cronos
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-1">Group</p>
                    <p className="text-sm font-mono text-primary">{name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-1">Admin</p>
                    <p className="text-sm font-mono">{adminName || "—"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 md:p-8 bg-surface-container-low flex justify-between items-center border-t border-outline-variant/10">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 text-on-surface-variant font-medium hover:text-on-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeploy}
                disabled={busy || !name || !adminName}
                className="px-8 py-3 rounded-lg font-bold text-on-primary-fixed disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
                style={{ background: "linear-gradient(135deg, #adc6ff 0%, #4d8eff 100%)" }}
              >
                <span className="material-symbols-outlined">rocket_launch</span>
                {busy ? "Deploying..." : "Deploy Vault on Cronos"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-72px)] h-16 md:h-20 z-[60] bg-surface/40 backdrop-blur-xl flex items-center justify-between px-5 md:px-10 pointer-events-none">
        <div className="flex items-center gap-4 text-slate-100 font-headline font-bold text-lg">
          <span>ChainSplit</span>
        </div>
        <div className="flex items-center gap-6 pointer-events-auto">
          <div className="bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#44e2cd]" />
            <span className="font-mono text-sm text-secondary">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not Connected"}
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}
