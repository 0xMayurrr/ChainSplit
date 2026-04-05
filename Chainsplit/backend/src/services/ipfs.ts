const PINATA_API_KEY    = process.env.PINATA_API_KEY    ?? "";
const PINATA_API_SECRET = process.env.PINATA_API_SECRET ?? "";

const pinataHeaders = () => ({
  pinata_api_key:        PINATA_API_KEY,
  pinata_secret_api_key: PINATA_API_SECRET,
});

export async function pinJSON(data: object): Promise<string> {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method:  "POST",
    headers: { ...pinataHeaders(), "Content-Type": "application/json" },
    body:    JSON.stringify({ pinataContent: data }),
  });
  if (!res.ok) throw new Error(`Pinata pinJSON failed: ${await res.text()}`);
  const json = (await res.json()) as { IpfsHash: string };
  return json.IpfsHash;
}

export async function pinFile(buffer: Buffer, filename: string, mimetype: string): Promise<string> {
  const form = new globalThis.FormData();
  const blob = new Blob([new Uint8Array(buffer)], { type: mimetype });
  form.append("file", blob, filename);
  form.append("pinataMetadata", JSON.stringify({ name: filename }));

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method:  "POST",
    headers: pinataHeaders(),
    body:    form,
  });
  if (!res.ok) throw new Error(`Pinata pinFile failed: ${await res.text()}`);
  const json = (await res.json()) as { IpfsHash: string };
  return json.IpfsHash;
}

export function ipfsUrl(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
