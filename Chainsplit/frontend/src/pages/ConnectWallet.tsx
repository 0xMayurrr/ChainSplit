// @ts-nocheck
export default function ConnectWallet() {
  return (
    <>

{/*  TopNavBar Suppression: Onboarding flow focuses the user  */}
<main className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
{/*  Brand Anchor  */}
<div className="mb-12 flex flex-col items-center">
<div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_32px_rgba(173,198,255,0.2)]">
<span className="material-symbols-outlined text-on-primary-fixed text-4xl" data-icon="account_balance_wallet" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
</div>
<h2 className="font-brand text-2xl font-black text-primary tracking-tighter uppercase">ChainSplit</h2>
</div>
{/*  Connection Vault  */}
<div className="w-full max-w-xl">
<div className="glass-card rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
{/*  Background Ambient Pulse  */}
<div className="absolute -top-24 -right-24 w-48 h-48 bg-tertiary/10 rounded-full blur-[80px]"></div>
<div className="relative z-10 text-center mb-10">
<h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-on-background">
                        Your Wallet. <br/> <span className="text-primary">Your Identity.</span>
</h1>
<p className="text-on-surface-variant font-medium max-w-xs mx-auto">
                        Connect your Web3 gateway to begin splitting expenses across the Cronos network.
                    </p>
</div>
{/*  Wallet Options  */}
<div className="space-y-4 mb-10">
{/*  MetaMask  */}
<button className="w-full group flex items-center justify-between p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/15 transition-all duration-300 transform active:scale-[0.98]">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-[#e2761b]/10 flex items-center justify-center">
<img alt="MetaMask" className="w-7 h-7" data-alt="MetaMask fox logo in vibrant orange with 3D faceted geometry style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-xFyn-ssObxw30cuX--Q3l_2_t4GONI7ItjzmjFA_qayU8674orTaBj-NHKCNEsu6_W3Z63sh-wc1CInni-NrpFIFyfhsVrpq0kUSz9G4-dHmeTtEVWDD_egnsQs7vrEUgn1Eq8ZruoesmPkQRUrJ_-u-r2mP_8Z8yvQSoocmtBfmvcmGxvXoE-nBOvXDjQWcoaz1a2HEniW01Zr0mFJi33DM-IlBaZnBQYvWeZarQeDwJqh3Kcvqly95OrBCb8HgQn4nfefBGWw"/>
</div>
<div className="text-left">
<span className="block font-bold text-lg text-on-surface">MetaMask</span>
<span className="block text-xs text-on-surface-variant font-medium">Browser Extension &amp; Mobile</span>
</div>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="chevron_right">chevron_right</span>
</button>
{/*  WalletConnect  */}
<button className="w-full group flex items-center justify-between p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/15 transition-all duration-300 transform active:scale-[0.98]">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-[#3396ff]/10 flex items-center justify-center">
<img alt="WalletConnect" className="w-8 h-8" data-alt="WalletConnect blue logo with two stylized bridge connection symbols" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeKkLfvqEpt71RpVsdWjlfMIuAafW7KPhHR4hqiH3r7TOIDPdGatLIOI8d3bbhCM9YQN7J94DFhLVGIh0od4C6TmbY7vI6GBLl4Mf8DKTV_lWGkfqCGupBbAX_pd7IzkOmowhyv3-OWBkYeY1E0hV6NX9O7w5PjEs9MHjh03umqfjLBRB0vwskEtEnolaRReDwM-keQXZC-Oo1TNhNFFXkDYBoG-wRTZ4evJsZmfBML0idZBBJ4RdB5aqm5f2iBv4Lu86zXB_l1fI"/>
</div>
<div className="text-left">
<span className="block font-bold text-lg text-on-surface">WalletConnect</span>
<span className="block text-xs text-on-surface-variant font-medium">Scan with mobile wallet</span>
</div>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="qr_code_scanner">qr_code_scanner</span>
</button>
{/*  Coinbase Wallet  */}
<button className="w-full group flex items-center justify-between p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/15 transition-all duration-300 transform active:scale-[0.98]">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-[#0052ff]/10 flex items-center justify-center">
<img alt="Coinbase Wallet" className="w-7 h-7" data-alt="Coinbase wallet logo representing a blue square with a white circle inside" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBwlpmkJnvPhjXtmqa-dxakm__ckf-JI9ejA8mCM0xNbCKCIbPqF-FfdmwQlyJY2ttn7zB1lurVo8TMRquxIX_lfaXWVHYbCq8Po888_xjQ0rA-fdWRS5C_vzY_8RSQIq09hUjo1ahWtg3y4l2wScniAgwV4VGTtg7MW3fJJEJuFxWhQ16m5kNAoeLUY1TvIa2u6Lb9VBr0eKcbh5rZij6yvX7yrxq3l5WDPLRNX2yn8PTUGqR1LdAfCcsYb2BqbxI_8rnGyF8tKQ"/>
</div>
<div className="text-left">
<span className="block font-bold text-lg text-on-surface">Coinbase Wallet</span>
<span className="block text-xs text-on-surface-variant font-medium">Direct connection</span>
</div>
</div>
<span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="bolt" style="font-variation-settings: 'FILL' 1;">bolt</span>
</button>
</div>
{/*  Footer Context  */}
<div className="text-center">
<p className="text-xs text-on-surface-variant/60 font-medium mb-6">
                        By connecting, you agree to our <a className="text-primary hover:underline" href="#">Terms of Service</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
                    </p>
<div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-full border border-outline-variant/10">
<span className="flex h-2 w-2 rounded-full bg-tertiary animate-pulse"></span>
<span className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">Cronos Mainnet Active</span>
</div>
</div>
</div>
{/*  Contextual Helper: Benefits Grid  */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
<div className="p-6 rounded-2xl bg-surface-container-low/50 border border-outline-variant/5">
<span className="material-symbols-outlined text-tertiary mb-3" data-icon="security">security</span>
<h3 className="font-bold text-sm text-on-surface mb-1">Non-Custodial</h3>
<p className="text-xs text-on-surface-variant leading-relaxed">We never store your keys. You maintain full control of your assets.</p>
</div>
<div className="p-6 rounded-2xl bg-surface-container-low/50 border border-outline-variant/5">
<span className="material-symbols-outlined text-primary mb-3" data-icon="electric_bolt">electric_bolt</span>
<h3 className="font-bold text-sm text-on-surface mb-1">Zero Latency</h3>
<p className="text-xs text-on-surface-variant leading-relaxed">Settlements are instant using the Cronos EVM infrastructure.</p>
</div>
<div className="p-6 rounded-2xl bg-surface-container-low/50 border border-outline-variant/5">
<span className="material-symbols-outlined text-secondary mb-3" data-icon="group_work">group_work</span>
<h3 className="font-bold text-sm text-on-surface mb-1">Collaborative</h3>
<p className="text-xs text-on-surface-variant leading-relaxed">Split bills with anyone using an Ethereum-compatible address.</p>
</div>
</div>
</div>
{/*  Success/Connected State Overlay (Simulated Preview for the prompt)  */}
<div className="hidden fixed inset-0 z-[100] flex items-center justify-center p-6 bg-surface-dim/80 backdrop-blur-md">
<div className="glass-card w-full max-w-md rounded-[2.5rem] p-10 text-center relative shadow-2xl scale-100 transition-transform duration-500">
<div className="w-20 h-20 bg-tertiary-container rounded-full flex items-center justify-center mx-auto mb-6">
<span className="material-symbols-outlined text-on-tertiary-container text-4xl" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<h3 className="font-headline text-2xl font-bold text-on-background mb-2">Wallet Connected</h3>
<p className="text-on-surface-variant mb-8">Redirecting to your dashboard...</p>
<div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 text-left space-y-4">
<div className="flex justify-between items-center">
<span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Address</span>
<span className="font-mono text-primary font-medium tracking-tight">0x71C...A42B</span>
</div>
<div className="flex justify-between items-center">
<span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Balance</span>
<span className="font-mono text-on-surface font-bold text-lg tracking-tight">1,250.45 <span className="text-xs text-tertiary ml-1">CRO</span></span>
</div>
</div>
<div className="mt-10">
<div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full bg-primary w-2/3 animate-[loading_2s_ease-in-out_infinite]"></div>
</div>
</div>
</div>
</div>
</main>
{/*  Branding Element: Kinetic Background Detail  */}
<div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[409px] bg-primary/5 blur-[120px] -z-10 rounded-full"></div>
{/*  Footer Alignment from Shared Components  */}
<footer className="w-full py-12 border-t border-white/5 bg-[#10131c] flex flex-col md:flex-row justify-between items-center px-8">
<div className="flex items-center gap-6 mb-8 md:mb-0">
<span className="text-[#adc6ff] font-bold font-mono text-xs uppercase tracking-widest">© 2024 ChainSplit. Built on Cronos.</span>
</div>
<div className="flex gap-8">
<a className="text-gray-500 hover:text-[#adc6ff] font-mono text-xs uppercase tracking-widest transition-opacity opacity-80 hover:opacity-100" href="#">Terms</a>
<a className="text-gray-500 hover:text-[#adc6ff] font-mono text-xs uppercase tracking-widest transition-opacity opacity-80 hover:opacity-100" href="#">Privacy</a>
<a className="text-gray-500 hover:text-[#adc6ff] font-mono text-xs uppercase tracking-widest transition-opacity opacity-80 hover:opacity-100" href="#">Etherscan</a>
<a className="text-gray-500 hover:text-[#adc6ff] font-mono text-xs uppercase tracking-widest transition-opacity opacity-80 hover:opacity-100" href="#">Github</a>
</div>
</footer>

    </>
  );
}
