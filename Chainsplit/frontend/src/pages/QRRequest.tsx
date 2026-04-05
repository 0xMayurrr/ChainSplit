// @ts-nocheck
export default function QRRequest() {
  return (
    <>

{/*  Top Navigation Anchor  */}
<header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 max-w-none bg-[#32343f]/60 backdrop-blur-xl border-b border-white/10 z-50">
<div className="text-2xl font-black text-[#adc6ff] tracking-tighter font-headline">
            ChainSplit
        </div>
<div className="hidden md:flex gap-8 items-center">
<a className="text-[#32343f] hover:text-[#adc6ff]/80 transition-colors font-headline font-bold tracking-tight" href="#">Dashboard</a>
<a className="text-[#adc6ff] border-b-2 border-[#adc6ff] pb-1 font-headline font-bold tracking-tight" href="#">Groups</a>
<a className="text-[#32343f] hover:text-[#adc6ff]/80 transition-colors font-headline font-bold tracking-tight" href="#">Activity</a>
</div>
<div className="flex items-center gap-4">
<span className="font-mono text-xs text-[#adc6ff] bg-white/5 px-3 py-1 rounded-full border border-white/5">1,250 CRO</span>
<div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-primary/20">
<img alt="User Wallet Avatar" className="w-full h-full" data-alt="Abstract geometric identicon representing a crypto wallet address in blue and white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE8mT4V1y9cZwU4_It1fGXL48RsYFv52P1oxP5I3EurKPSfQI9-Zvj4VNBF6FOOkN5n_py9Y8RJRY4O68ixx5y3MQ28ExcwFWlSMQcQI4Fe0CXyEV3PZuDj17rQsZi-q1w7GBUXQXtDKTCCEjzaTXSnpGHecKCc_ITsL1FC8IVQLJuZLZLqAw4RwMgTJQ6FEvyGzm6qBcUp1wW4YEDpG7_LteqcdS3Vbne50vv0zDR1E-3n09sWGTRl8ldy9pHre-BD0JfI-z6API"/>
</div>
</div>
</header>
<main className="pt-32 pb-20 px-4 flex justify-center items-center min-h-screen">
<div className="w-full max-w-md relative">
{/*  Decorative Glows  */}
<div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
<div className="absolute -bottom-20 -right-20 w-64 h-64 bg-tertiary/10 rounded-full blur-[100px] pointer-events-none"></div>
{/*  Main Payment Card  */}
<div className="glass-card rounded-[2rem] p-8 relative overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/5">
{/*  Status Header  */}
<div className="flex flex-col items-center mb-8 text-center">
<div className="flex items-center gap-2 mb-2">
<span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em]">Requesting Payment</span>
<div className="w-2 h-2 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_#3cddc7]"></div>
</div>
<h2 className="font-display text-2xl font-bold text-white mb-1">Dinner at Nobu</h2>
<p className="text-on-surface-variant text-sm flex items-center gap-1">
<span className="material-symbols-outlined text-sm">group</span>
                        Weekend in Tokyo
                    </p>
</div>
{/*  Amount Block  */}
<div className="bg-surface-container-lowest/50 rounded-2xl p-6 mb-8 text-center border border-white/5">
<p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-2">Amount Owed</p>
<div className="flex items-baseline justify-center gap-2">
<span className="font-display text-5xl font-extrabold text-white">30</span>
<span className="font-mono text-2xl font-bold text-primary">CRO</span>
</div>
</div>
{/*  QR Section  */}
<div className="flex flex-col items-center mb-10">
<div className="qr-gradient-border rounded-3xl p-1 mb-4">
<div className="bg-white p-4 rounded-[1.25rem]">
<img alt="Payment QR Code" className="w-48 h-48" data-alt="Clean minimalist QR code centered on a white background used for blockchain wallet transaction deep linking" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOvBfL-kX6ZN7KCNz5plMa5T6_LMK4mlAqzbyKtRZj8AzAm6k1svIVmn2Df9kYrnemNUVEo9D8CwuhYDInzAPmZoFFwik9KpRIQRUqjiBLGwtYlDQKLxkkDBvk_cUUWY99HCu5675xSj2HlJMtX-68WoEjK60J9-phCpnLCX6JLwZHJmZ_S6vR394-fXpAliwZxuatLy84HylL5PMajJ8nEFhZfi8X6p0kz1KvtmAKRpOy8lwNKOAI-4-gTtc17_02-CF-Ssn9zsE"/>
</div>
</div>
<p className="font-mono text-[10px] text-on-surface-variant/60 tracking-tight">0x71C765...d8E2FF</p>
</div>
{/*  Action Buttons  */}
<div className="space-y-3">
<button className="w-full py-4 px-6 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-headline font-bold flex items-center justify-center gap-3 shadow-[0_4px_24px_rgba(173,198,255,0.2)] active:scale-95 transition-transform">
<span className="material-symbols-outlined" data-weight="fill">account_balance_wallet</span>
                        Open in MetaMask
                    </button>
<button className="w-full py-4 px-6 rounded-xl border border-outline-variant/20 hover:bg-white/5 text-on-surface font-headline font-semibold flex items-center justify-center gap-3 transition-all active:scale-95">
<span className="material-symbols-outlined">link</span>
                        Copy Payment Link
                    </button>
</div>
{/*  Live Status Footer  */}
<div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-tertiary text-sm animate-spin">refresh</span>
</div>
<div>
<p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Transaction Status</p>
<p className="text-xs font-semibold text-white">Waiting for confirmation...</p>
</div>
</div>
<span className="font-mono text-[10px] text-tertiary/80">LIVE</span>
</div>
</div>
{/*  Technical Detail Overlay (Asymmetric)  */}
<div className="mt-6 flex justify-between px-4">
<div className="text-[10px] font-mono text-on-surface-variant/40 space-y-1">
<p>NETWORK: CRONOS_MAINNET</p>
<p>GAS_EST: 0.0021 CRO</p>
</div>
<div className="text-[10px] font-mono text-on-surface-variant/40 text-right space-y-1">
<p>REF: CS-992-PX</p>
<p>TIME: 12:44:02 UTC</p>
</div>
</div>
</div>
</main>
{/*  Global Footer  */}
<footer className="flex flex-col md:flex-row justify-between items-center px-8 w-full py-12 border-t border-white/5 bg-[#10131c]">
<div className="mb-4 md:mb-0">
<span className="text-[#adc6ff] font-bold font-headline tracking-tighter text-xl">ChainSplit</span>
<p className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-gray-500 mt-2">© 2024 ChainSplit. Built on Cronos.</p>
</div>
<div className="flex gap-6">
<a className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-gray-500 hover:text-[#adc6ff] transition-opacity opacity-80 hover:opacity-100" href="#">Terms</a>
<a className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-gray-500 hover:text-[#adc6ff] transition-opacity opacity-80 hover:opacity-100" href="#">Privacy</a>
<a className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-gray-500 hover:text-[#adc6ff] transition-opacity opacity-80 hover:opacity-100" href="#">Etherscan</a>
<a className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-gray-500 hover:text-[#adc6ff] transition-opacity opacity-80 hover:opacity-100" href="#">Github</a>
</div>
</footer>
{/*  Bottom Mobile Nav (Only visible on mobile)  */}
<nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#32343f]/80 backdrop-blur-xl border-t border-white/10 flex justify-around py-4 z-50">
<a className="flex flex-col items-center gap-1 text-[#adc6ff]" href="#">
<span className="material-symbols-outlined" data-weight="fill">dashboard</span>
<span className="text-[10px] font-bold uppercase">Dashboard</span>
</a>
<a className="flex flex-col items-center gap-1 text-gray-500" href="#">
<span className="material-symbols-outlined">group</span>
<span className="text-[10px] font-bold uppercase">Groups</span>
</a>
<a className="flex flex-col items-center gap-1 text-gray-500" href="#">
<span className="material-symbols-outlined">history</span>
<span className="text-[10px] font-bold uppercase">Activity</span>
</a>
</nav>

    </>
  );
}
