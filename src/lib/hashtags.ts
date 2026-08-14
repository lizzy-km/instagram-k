const HASHTAG_PATTERN = /#([a-zA-Z0-9_]+)/g;

export function extractHashtags(text: string | null | undefined): string[] {
  if (!text) return [];
  const matches = text.matchAll(HASHTAG_PATTERN);
  const tags = new Set<string>();
  for (const match of matches) {
    const tag = match[1]?.toLowerCase();
    if (tag) tags.add(tag);
  }
  return Array.from(tags);
}
