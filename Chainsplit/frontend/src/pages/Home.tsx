import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import Navbar from "../components/Navbar";

export default function Home() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="page" style={{ textAlign: "center", paddingTop: 80 }}>
        <div style={{ fontSize: 64 }}>⛓️💸</div>
        <h1 style={{ fontSize: 42, fontWeight: 800, marginTop: 16 }}>
          Split expenses on-chain
        </h1>
        <p className="text-muted" style={{ fontSize: 16, marginTop: 12, maxWidth: 480, margin: "12px auto 0" }}>
          Create a group vault on Cronos, track shared expenses, and settle debts transparently on-chain.
        </p>
        <div style={{ marginTop: 36 }}>
          {isConnected ? (
            <button className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }} onClick={() => navigate("/groups")}>
              Go to My Groups →
            </button>
          ) : (
            <ConnectButton label="Connect Wallet to Start" />
          )}
        </div>
        <div className="grid-2" style={{ maxWidth: 600, margin: "64px auto 0", textAlign: "left" }}>
          {[
            { icon: "🏦", title: "Group Vault", desc: "Each group deploys its own smart contract vault on Cronos." },
            { icon: "🧾", title: "Track Expenses", desc: "Add expenses with equal or custom splits among members." },
            { icon: "⚖️", title: "Auto Settle", desc: "Greedy algorithm minimizes the number of transactions needed." },
            { icon: "🔒", title: "On-Chain", desc: "All data lives on-chain. No backend needed to trust." },
          ].map((f) => (
            <div key={f.title} className="card">
              <div style={{ fontSize: 28 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>{f.title}</div>
              <div className="text-muted text-sm mt-8">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
