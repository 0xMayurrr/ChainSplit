import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">⛓️ ChainSplit</Link>
      <div className="flex gap-12 items-center">
        <Link to="/groups" style={{ color: "#aaa", fontSize: 14 }}>My Groups</Link>
        <ConnectButton />
      </div>
    </nav>
  );
}
