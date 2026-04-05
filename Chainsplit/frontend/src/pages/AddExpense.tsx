// @ts-nocheck
export default function AddExpense() {
  return (
    <>

{/*  Top Navigation Anchor  */}
<nav className="fixed top-0 w-full flex justify-between items-center px-6 py-4 max-w-none bg-[#32343f]/60 backdrop-blur-xl z-50 border-b border-white/10 shadow-[0_16px_32px_-12px_rgba(173,198,255,0.04)]">
<div className="flex items-center gap-8">
<span className="text-2xl font-black text-[#adc6ff] tracking-tighter font-headline">ChainSplit</span>
<div className="hidden md:flex gap-6">
<a className="font-headline font-bold tracking-tight text-[#32343f] hover:text-[#adc6ff]/80 transition-colors" href="#">Dashboard</a>
<a className="font-headline font-bold tracking-tight text-[#adc6ff] border-b-2 border-[#adc6ff] pb-1" href="#">Groups</a>
<a className="font-headline font-bold tracking-tight text-[#32343f] hover:text-[#adc6ff]/80 transition-colors" href="#">Activity</a>
</div>
</div>
<div className="flex items-center gap-4">
<div className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<span className="font-mono text-sm text-tertiary">1,250 CRO</span>
</div>
<button className="bg-surface-variant/40 p-2 rounded-full hover:bg-white/5 transition-all active:scale-95">
<span className="material-symbols-outlined text-primary">account_balance_wallet</span>
</button>
<div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-xl">
<span className="font-mono text-xs opacity-80">0x...A42B</span>
<img alt="User Wallet Avatar" className="w-6 h-6 rounded-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVpfmWVjTtQk5a88S8MlJYXGMPEY_D78KBq3hohuO3x2bIMyQKoJsljgDi4MvfHmtKMqqEKGNxv0zlJI_6mG88_m5NcM1ffBkO9rkHjYEiweEXUQxhjL3khyj5KsHFR8pkoIZ5pn17MvUcINJESOmFVyZzD8Ig-uEDZ8YnfEeQaqojmpC6JtzlPQUPULiI1Pht57K8IsMGYlwVFMeehm9g_yhZz3xi6Mr9pQM9m_IN7rz8-3qFY9YQweVK_0KzS7j6VDN9jP58c2Q"/>
</div>
</div>
</nav>
{/*  Sidebar (Hidden on mobile)  */}
<aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#10131c] border-r border-white/5 p-4 z-40 pt-24">
<div className="space-y-2 flex-1">
<div className="p-3 flex items-center gap-3 text-gray-500 hover:text-white hover:bg-[#181b25] rounded-lg transition-all cursor-pointer">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-medium">Dashboard</span>
</div>
<div className="p-3 flex items-center gap-3 text-[#adc6ff] bg-[#1c1f29] rounded-lg transition-all cursor-pointer">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span className="font-medium">Groups</span>
</div>
<div className="p-3 flex items-center gap-3 text-gray-500 hover:text-white hover:bg-[#181b25] rounded-lg transition-all cursor-pointer">
<span className="material-symbols-outlined" data-icon="history">history</span>
<span className="font-medium">History</span>
</div>
<div className="p-3 flex items-center gap-3 text-gray-500 hover:text-white hover:bg-[#181b25] rounded-lg transition-all cursor-pointer">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="font-medium">Settings</span>
</div>
</div>
<div className="mt-auto pt-6 border-t border-white/5 space-y-2">
<button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(173,198,255,0.2)] hover:shadow-[0_0_30px_rgba(173,198,255,0.3)] transition-all active:scale-95 mb-4">
                Settle Now
            </button>
<div className="p-2 flex items-center gap-3 text-gray-500 hover:text-[#adc6ff] text-xs uppercase tracking-widest transition-opacity cursor-pointer">
<span className="material-symbols-outlined text-sm" data-icon="description">description</span>
<span>Docs</span>
</div>
<div className="p-2 flex items-center gap-3 text-gray-500 hover:text-[#adc6ff] text-xs uppercase tracking-widest transition-opacity cursor-pointer">
<span className="material-symbols-outlined text-sm" data-icon="help">help</span>
<span>Support</span>
</div>
</div>
</aside>
{/*  Main Content Canvas  */}
<main className="md:ml-64 pt-24 pb-12 px-6 kinetic-glow min-h-screen">
<div className="max-w-4xl mx-auto">
{/*  Breadcrumbs / Back  */}
<div className="mb-8 flex items-center justify-between">
<button className="flex items-center gap-2 text-outline hover:text-primary transition-colors group">
<span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
<span className="font-medium">Back to European Tour Group</span>
</button>
<div className="flex gap-2">
<div className="w-8 h-1.5 rounded-full bg-primary"></div>
<div className="w-8 h-1.5 rounded-full bg-surface-container-highest"></div>
<div className="w-8 h-1.5 rounded-full bg-surface-container-highest"></div>
</div>
</div>
{/*  Page Title  */}
<h1 className="font-headline text-5xl font-extrabold tracking-tighter mb-12 text-on-background">
                Add <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Expense</span>
</h1>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
{/*  Step 1 Form Container  */}
<div className="lg:col-span-8 space-y-8">
{/*  Expense Details Card  */}
<div className="surface-container-low rounded-3xl p-8 glass-panel border border-white/5 relative overflow-hidden">
<div className="absolute top-0 right-0 p-6 opacity-10">
<span className="material-symbols-outlined text-6xl" data-icon="receipt_long">receipt_long</span>
</div>
<h2 className="font-headline text-2xl font-bold mb-8 flex items-center gap-3">
<span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">01</span>
                            Expense Details
                        </h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/*  Expense Name  */}
<div className="md:col-span-2 group">
<label className="block text-xs uppercase tracking-widest text-outline mb-2 ml-1">Expense Name</label>
<input className="w-full bg-surface-container-lowest border-0 rounded-2xl p-4 text-on-background placeholder:text-outline/40 focus:ring-2 focus:ring-primary/50 transition-all font-medium" placeholder="e.g. Dinner at Le Meurice" type="text"/>
</div>
{/*  Amount CRO  */}
<div className="group">
<label className="block text-xs uppercase tracking-widest text-outline mb-2 ml-1">Amount (CRO)</label>
<div className="relative">
<input className="w-full bg-surface-container-lowest border-0 rounded-2xl p-4 pr-16 text-on-background font-mono text-xl focus:ring-2 focus:ring-primary/50 transition-all" placeholder="0.00" type="number"/>
<span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded">CRO</span>
</div>
<p className="mt-2 ml-1 text-xs text-outline/60 font-mono">≈ $ 0.00 USD</p>
</div>
{/*  Date Picker  */}
<div className="group">
<label className="block text-xs uppercase tracking-widest text-outline mb-2 ml-1">Date</label>
<div className="relative">
<input className="w-full bg-surface-container-lowest border-0 rounded-2xl p-4 text-on-background focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer" type="date"/>
</div>
</div>
{/*  Category Picker  */}
<div className="md:col-span-2">
<label className="block text-xs uppercase tracking-widest text-outline mb-4 ml-1">Category</label>
<div className="grid grid-cols-3 md:grid-cols-6 gap-3">
<button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary transition-all">
<span className="material-symbols-outlined" data-icon="restaurant">restaurant</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">Food</span>
</button>
<button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-lowest border border-white/5 text-outline hover:text-on-surface hover:bg-surface-container transition-all">
<span className="material-symbols-outlined" data-icon="flight">flight</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">Travel</span>
</button>
<button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-lowest border border-white/5 text-outline hover:text-on-surface hover:bg-surface-container transition-all">
<span className="material-symbols-outlined" data-icon="home">home</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">Rent</span>
</button>
<button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-lowest border border-white/5 text-outline hover:text-on-surface hover:bg-surface-container transition-all">
<span className="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">Retail</span>
</button>
<button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-lowest border border-white/5 text-outline hover:text-on-surface hover:bg-surface-container transition-all">
<span className="material-symbols-outlined" data-icon="local_bar">local_bar</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">Drinks</span>
</button>
<button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-lowest border border-white/5 text-outline hover:text-on-surface hover:bg-surface-container transition-all">
<span className="material-symbols-outlined" data-icon="more_horiz">more_horiz</span>
<span className="text-[10px] font-bold uppercase tracking-tighter">Other</span>
</button>
</div>
</div>
{/*  IPFS Upload  */}
<div className="md:col-span-2">
<label className="block text-xs uppercase tracking-widest text-outline mb-2 ml-1">Receipt Upload (Optional)</label>
<div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors cursor-pointer bg-surface-container-lowest/50 group">
<div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline group-hover:text-primary transition-colors">
<span className="material-symbols-outlined">cloud_upload</span>
</div>
<div className="text-center">
<p className="text-sm font-medium">Drag and drop or click to upload</p>
<p className="text-[10px] text-outline/60 mt-1">Files will be encrypted and stored on IPFS</p>
</div>
</div>
</div>
</div>
</div>
{/*  Split Details Preview  */}
<div className="surface-container-low rounded-3xl p-8 glass-panel border border-white/5 opacity-40 grayscale pointer-events-none relative overflow-hidden">
<div className="absolute inset-0 bg-surface-dim/40 flex items-center justify-center z-10">
<span className="bg-surface-container-high px-4 py-2 rounded-full border border-white/10 text-xs font-bold tracking-widest uppercase">Complete Step 1 First</span>
</div>
<h2 className="font-headline text-2xl font-bold mb-8 flex items-center gap-3">
<span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">02</span>
                            Split Details
                        </h2>
</div>
{/*  CTA Buttons  */}
<div className="flex items-center justify-end gap-4">
<button className="px-8 py-4 rounded-2xl border border-white/10 font-bold hover:bg-surface-container transition-all">Save as Draft</button>
<button className="px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-bold shadow-[0_16px_32px_-12px_rgba(173,198,255,0.4)] hover:shadow-[0_16px_48px_-12px_rgba(173,198,255,0.6)] transition-all flex items-center gap-2 group">
                            Continue to Split
                            <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
</button>
</div>
</div>
{/*  Right Column: Context/Preview  */}
<div className="lg:col-span-4 sticky top-24 space-y-6">
{/*  Group Status Card  */}
<div className="surface-container rounded-3xl p-6 border border-white/5 relative overflow-hidden">
<div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full"></div>
<h3 className="text-xs uppercase tracking-widest text-outline mb-4">Target Group</h3>
<div className="flex items-center gap-4 mb-6">
<div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-3xl" data-icon="explore">explore</span>
</div>
<div>
<p className="font-headline font-bold text-lg leading-tight">European Tour 2024</p>
<p className="text-xs text-outline">Cronos Mainnet</p>
</div>
</div>
<div className="space-y-4">
<div className="flex justify-between items-center text-sm">
<span className="text-outline">Members</span>
<div className="flex -space-x-2">
<img alt="Member" className="w-6 h-6 rounded-full border-2 border-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAArh1JrkGtb_I_z9XhOSQLYKPzj2EvRWyuMNZeRVX2LG27H4oTLpUXkeDnhdD273Uy8u7Y_L_Gj4JktbZEqkpGJ1ZIbKOWRagrCGk9CwcMyDbl0biRE46BpIb_aJW5wN8iu9qgpDJ_75DrwuEgtHyQyCGvyH08aFCyzBxh7Bg8tK53S1s06DuKDk4Z4itjbESLksRKBpCQek_414JWYlV2qQK8jVP5czbbtc_vWq0a_xLV_A3jfoFyLw2c77LaDUcprXBiENtJuKE"/>
<img alt="Member" className="w-6 h-6 rounded-full border-2 border-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyzavMsmPlNcLYTsAd2TzCFv8LdRITFejWt2oR0fYaoBgh0bdB8V8-xvTGPMXr1n5y4ARhl9V6IrzU4RJgSghwe4MQggQI3MYl1n9FNDE-WsFNgsHqtaeg1IVnI31Sl0C0w7KHAyO8tKdkB1q0cmsIC-ObWvHLsdU1FAV3YIc_6eElBpA_wDF63uN2NqNF7zXVzvTAuvSYtZFCN1-oomanDx7F0OKsxv5qZOYI2ldUrqETb28LqzjW_hZWwN0w6d_GbZNRYH2B2QM"/>
<img alt="Member" className="w-6 h-6 rounded-full border-2 border-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNv-qlyVagyUNfFfPeCmOtWnsjP1sRXp7Iov67HxCKqDRuV2xUPzAM_ITi_b8xIjakiYEx5SYLLN8WZ6KIZBSLcKAFAcpH1CbFHOC00sbbPj7EZ_Y425uKKv5h8gDxMg8B9c7A-fyMdbECbz7otdu5zxwUpQ1NKAvKdW2uaL7Xd3uSioF85XXiRmysT2VAuHA9--abrekLmh2BbU5rtpY7d9_ZE750dBd8L2GiqLHC-6clFjapMxHDvgbdSqbQdTERc6kH2VxhtR0"/>
<div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-[8px] font-bold border-2 border-surface-container">+2</div>
</div>
</div>
<div className="flex justify-between items-center text-sm">
<span className="text-outline">Total Debt Pool</span>
<span className="font-mono text-tertiary">4,280.50 CRO</span>
</div>
</div>
</div>
{/*  Helpful Info  */}
<div className="surface-container-lowest rounded-3xl p-6 border border-white/5 space-y-4">
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary" data-icon="info">info</span>
<p className="text-xs leading-relaxed text-outline">All expenses on ChainSplit are logged as smart contract events. Only members of the group can view details on-chain.</p>
</div>
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-tertiary" data-icon="security">security</span>
<p className="text-xs leading-relaxed text-outline">Receipts are stored on IPFS. Your privacy is maintained through cryptographic hashes.</p>
</div>
</div>
</div>
</div>
</div>
</main>
{/*  Footer Anchor  */}
<footer className="md:ml-64 bg-[#10131c] border-t border-white/5 py-12 px-8 flex flex-col md:flex-row justify-between items-center w-full mt-auto">
<div className="mb-6 md:mb-0">
<span className="text-[#adc6ff] font-bold font-headline tracking-tight">ChainSplit</span>
<p className="text-[#adc6ff] font-mono text-xs uppercase tracking-widest mt-2">© 2024 ChainSplit. Built on Cronos.</p>
</div>
<div className="flex gap-8">
<a className="font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-[#adc6ff] transition-opacity" href="#">Terms</a>
<a className="font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-[#adc6ff] transition-opacity" href="#">Privacy</a>
<a className="font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-[#adc6ff] transition-opacity" href="#">Etherscan</a>
<a className="font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-[#adc6ff] transition-opacity" href="#">Github</a>
</div>
</footer>
{/*  Mobile Bottom Navigation (Visible on mobile only)  */}
<div className="md:hidden fixed bottom-0 w-full bg-[#181b25] border-t border-white/10 px-6 py-3 flex justify-around items-center z-50">
<button className="flex flex-col items-center gap-1 text-outline">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-[10px] uppercase font-bold tracking-tighter">Dash</span>
</button>
<button className="flex flex-col items-center gap-1 text-primary">
<span className="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">group</span>
<span className="text-[10px] uppercase font-bold tracking-tighter">Groups</span>
</button>
<div className="relative -top-8">
<button className="w-14 h-14 bg-gradient-to-r from-primary to-primary-container rounded-2xl shadow-lg flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined text-3xl">add</span>
</button>
</div>
<button className="flex flex-col items-center gap-1 text-outline">
<span className="material-symbols-outlined">history</span>
<span className="text-[10px] uppercase font-bold tracking-tighter">Activity</span>
</button>
<button className="flex flex-col items-center gap-1 text-outline">
<span className="material-symbols-outlined">person</span>
<span className="text-[10px] uppercase font-bold tracking-tighter">Profile</span>
</button>
</div>

    </>
  );
}
