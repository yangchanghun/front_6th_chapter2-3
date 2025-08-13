export async function http<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${msg}`);
  }
  return res.json() as Promise<T>;
}
