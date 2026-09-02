export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

export function relativeTimeAgo(minutes: number): string {
  const date = new Date(Date.now() - minutes * 60 * 1000);
  return date.toISOString();
}

export function formatISODate(date: Date = new Date()): string {
  return date.toISOString();
}

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

