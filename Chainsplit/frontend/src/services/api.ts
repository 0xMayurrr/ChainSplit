const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function authHeaders(address: string, signMessage: (args: { message: string }) => Promise<string>) {
  const message   = `ChainSplit auth: ${Date.now()}`;
  const signature = await signMessage({ message });
  return {
    "x-wallet-address":   address,
    "x-wallet-signature": signature,
    "x-wallet-message":   message,
  };
}

export async function uploadReceipt(
  vaultAddress: string,
  file: File,
  address: string,
  signMessage: (args: { message: string }) => Promise<string>
): Promise<{ cid: string; url: string }> {
  const headers = await authHeaders(address, signMessage);
  const form    = new FormData();
  form.append("receipt", file);
  const res = await fetch(`${BASE}/api/groups/${vaultAddress}/receipt`, {
    method:  "POST",
    headers: headers as HeadersInit,
    body:    form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function pinExpenseMeta(
  vaultAddress: string,
  meta: { expenseName: string; amount: string; category: number; receiptCid?: string; paidBy: string; splitAmong: string[] },
  address: string,
  signMessage: (args: { message: string }) => Promise<string>
): Promise<{ cid: string; url: string }> {
  const headers = await authHeaders(address, signMessage);
  const res = await fetch(`${BASE}/api/groups/${vaultAddress}/expense-meta`, {
    method:  "POST",
    headers: { ...headers, "Content-Type": "application/json" } as HeadersInit,
    body:    JSON.stringify(meta),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function attachExpenseIpfs(
  vaultAddress: string,
  expenseId: number,
  ipfsCid: string,
  address: string,
  signMessage: (args: { message: string }) => Promise<string>
): Promise<void> {
  const headers = await authHeaders(address, signMessage);
  await fetch(`${BASE}/api/expenses/${vaultAddress}/${expenseId}/ipfs`, {
    method:  "PATCH",
    headers: { ...headers, "Content-Type": "application/json" } as HeadersInit,
    body:    JSON.stringify({ ipfsCid }),
  });
}

export async function getUser(address: string): Promise<{ address: string; displayName: string }> {
  const res = await fetch(`${BASE}/api/users/${address}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateUser(
  address: string,
  displayName: string,
  signMessage: (args: { message: string }) => Promise<string>
): Promise<{ address: string; displayName: string }> {
  const headers = await authHeaders(address, signMessage);
  const res = await fetch(`${BASE}/api/users/${address}`, {
    method:  "PUT",
    headers: { ...headers, "Content-Type": "application/json" } as HeadersInit,
    body:    JSON.stringify({ displayName }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getExpensesWithMeta(vaultAddress: string): Promise<Array<{
  id: string; name: string; amount: string; paidBy: string;
  category: number; ipfsCid: string | null; ipfsUrl: string | null;
}>> {
  const res = await fetch(`${BASE}/api/expenses/${vaultAddress}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
