export function timeAgo(fromMs: number, nowMs: number = Date.now()): string {
  const diffMs = nowMs - fromMs;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffMonth > 11) {
    const date = new Date(fromMs);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
  if (diffWeek > 4) return `${diffMonth}mo ago`;
  if (diffDay > 7) return `${diffWeek}w ago`;
  if (diffHr > 23) return `${diffDay}d ago`;
  if (diffMin > 60) return `${diffHr}h ago`;
  if (diffSec > 60) return `${diffMin}m ago`;
  return "just now";
}
