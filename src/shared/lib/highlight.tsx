export function escapeRegex(src: string) {
  return src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function Highlight({ text, q }: { text?: string; q: string }) {
  if (!text) return null;
  if (!q.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${escapeRegex(q)})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
      )}
    </span>
  );
}
