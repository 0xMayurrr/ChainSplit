// @ts-nocheck
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) navigate("/dashboard");
  }, [isConnected, navigate]);

  return (
    <div className="min-h-screen bg-[#080B14] text-on-surface overflow-x-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#080B14] via-transparent to-primary/5 pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="w-full sticky top-0 bg-gradient-to-b from-[#10131c] to-transparent z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-10 py-8">
          <div className="flex items-center gap-2">
            <img src="/Geometric_Chain_Link_Logo_Design-removebg-preview.png" alt="ChainSplit" className="h-9 w-9 object-contain" />
            <span className="text-2xl font-black text-primary tracking-tighter font-headline">ChainSplit</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {["Solutions", "Ecosystem", "Security", "Docs"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-slate-400 font-medium hover:text-secondary transition-colors duration-300 font-headline"
              >
                {item}
              </a>
            ))}
          </div>
          <ConnectButton label="Connect Wallet" />
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-10 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono font-medium tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
              </span>
              LIVE ON CRONOS MAINNET
            </div>

            <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-[0.9] text-on-surface">
              Split Bills. <br />
              <span className="text-primary">No Drama.</span> <br />
              No Middlemen.
            </h1>

            <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed font-body">
              Group vaults on Cronos. Smart contract escrow. 1% fee. Always. Experience the future
              of collaborative finance without the trust issues.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <ConnectButton label="Launch App" />
              <button className="px-8 py-4 glass-card text-on-surface rounded-xl font-bold font-headline text-lg hover:bg-white/5 transition-all">
                View Contracts
              </button>
            </div>
          </div>

          {/* Floating Dashboard Mockup */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative glass-card rounded-[2rem] p-8 shadow-2xl overflow-hidden">
              {/* Mock Dashboard Content */}
              <div className="space-y-6">
                {/* Balance */}
                <div className="p-6 bg-surface-container rounded-2xl relative overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
                  <p className="text-slate-400 font-medium text-sm mb-1">Net Balance Overview</p>
                  <h3 className="text-4xl font-headline font-black text-secondary tracking-tighter">
                    +45.50 <span className="text-xl font-mono align-middle">CRO</span>
                  </h3>
                  <p className="mt-2 text-on-surface-variant text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
                    owed to you across 4 active groups
                  </p>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Groups", val: "12", icon: "hub", color: "text-primary" },
                    { label: "Pending", val: "07", icon: "pending_actions", color: "text-tertiary" },
                    { label: "You're Owed", val: "+312 CRO", icon: "account_balance", color: "text-secondary" },
                  ].map((s) => (
                    <div key={s.label} className="p-4 bg-surface-container rounded-xl border border-outline-variant/5">
                      <span className={`material-symbols-outlined ${s.color} text-lg`}>{s.icon}</span>
                      <p className={`text-xl font-headline font-bold mt-2 ${s.color}`}>{s.val}</p>
                      <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
                {/* Recent Activity */}
                <div className="space-y-3">
                  {[
                    { label: "Settle: Goa Trip", time: "2 mins ago", amt: "-15.50 CRO", color: "text-error", dot: "border-secondary" },
                    { label: "Payment Received", time: "Yesterday", amt: "+48.00 CRO", color: "text-secondary", dot: "border-primary" },
                  ].map((item) => (
                    <div key={item.label} className="relative pl-8 py-2 flex justify-between items-center hover:bg-white/5 rounded-lg px-3 transition-colors">
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-surface ${item.dot}`} />
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{item.label}</p>
                        <p className="text-[10px] font-mono text-slate-500">{item.time}</p>
                      </div>
                      <p className={`text-sm font-mono ${item.color}`}>{item.amt}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating UI Element */}
              <div className="absolute top-4 -right-4 glass-card p-3 rounded-xl shadow-xl border-secondary/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                  <span className="font-mono text-[10px] text-secondary-fixed">0x71C...4f2a</span>
                </div>
                <div className="text-base font-headline font-bold text-white">4,290.50 CRO</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="max-w-7xl mx-auto px-10 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Total Settled", val: "$12.4M+" },
              { label: "Active Groups", val: "1,842" },
              { label: "Protocol Fee", val: "1.0%", color: "text-secondary" },
              { label: "Avg Settlement", val: "< 12s" },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <div className="text-slate-500 font-mono text-xs uppercase tracking-widest">{s.label}</div>
                <div className={`text-3xl font-black font-headline text-on-surface ${s.color || ""}`}>{s.val}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-10 py-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter mb-6">
                Split with Confidence.
              </h2>
              <p className="text-on-surface-variant text-lg">
                We've removed the social friction of asking for money back. Smart contracts handle
                the math and the movement.
              </p>
            </div>
            <div className="font-mono text-xs text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
              03 Steps to Freedom
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "account_balance_wallet",
                title: "Connect Wallet",
                desc: "Securely link your Cronos-compatible wallet. No signup, no personal data, just your keys.",
                step: "01",
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                icon: "token",
                title: "Fund Group Vault",
                desc: "Create a shared vault for your trip or dinner. Deposit CRO or stablecoins directly into the smart contract.",
                step: "02",
                color: "text-secondary",
                bg: "bg-secondary/10",
              },
              {
                icon: "flash_on",
                title: "Settle Instantly",
                desc: "One-click settlement. The smart contract calculates the delta and distributes funds automatically.",
                step: "03",
                color: "text-tertiary",
                bg: "bg-tertiary/10",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="group glass-card p-10 rounded-[2rem] hover:bg-surface-container-high transition-all duration-500 flex flex-col h-full"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}
                >
                  <span
                    className={`material-symbols-outlined ${s.color} text-3xl`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {s.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-headline mb-4">{s.title}</h3>
                <p className="text-on-surface-variant leading-relaxed mb-10 flex-grow">{s.desc}</p>
                <div className={`${s.color} font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2`}>
                  {s.step} / STEP{" "}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-10 pb-32">
          <div className="bg-surface-container-low rounded-[2.5rem] overflow-hidden p-12 md:p-20 relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle at 80% 50%, #44e2cd 0%, transparent 50%)" }} />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter leading-[1.1] mb-8">
                Ready to split with the power of Cronos?
              </h2>
              <div className="flex flex-wrap gap-4">
                <ConnectButton label="Open Dashboard" />
                <div className="flex items-center gap-4 px-6">
                  <div className="flex -space-x-3">
                    {["JD", "ML", "+12"].map((u) => (
                      <div
                        key={u}
                        className="w-10 h-10 rounded-full border-2 border-surface bg-slate-700 flex items-center justify-center text-[10px] font-bold"
                      >
                        {u}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-medium text-slate-400">Join 50k+ users</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/Geometric_Chain_Link_Logo_Design-removebg-preview.png" alt="ChainSplit" className="h-10 w-10 object-contain" />
              <span className="text-3xl font-black text-primary tracking-tighter font-headline">ChainSplit</span>
            </div>
            <p className="text-slate-500 max-w-xs font-body leading-relaxed">
              Financial autonomy for the social era. Decentralized bill splitting built on the
              high-performance Cronos blockchain.
            </p>
            <div className="flex items-center gap-3 py-2 px-4 bg-surface-container rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs font-mono font-bold text-on-surface-variant">Built on Cronos</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            {[
              { title: "Product", links: ["Vaults", "Security", "Fees"] },
              { title: "Developers", links: ["Documentation", "Github", "Smart Contracts"] },
              { title: "Company", links: ["Privacy", "Terms", "Contact"] },
            ].map((col) => (
              <div key={col.title} className="space-y-4">
                <div className="text-on-surface font-headline font-bold">{col.title}</div>
                <ul className="space-y-2 text-slate-400 text-sm">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="hover:text-primary transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-10 mt-20 pt-10 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-600 text-xs font-mono">
            © 2024 CHAINSPLIT PROTOCOL. NO RIGHTS RESERVED. IT'S THE BLOCKCHAIN.
          </div>
          <div className="flex gap-6">
            {["public", "code", "alternate_email"].map((icon) => (
              <a key={icon} href="#" className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">{icon}</span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
