export function isHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isBlockedHost(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === 'localhost' || host.startsWith('127.') || host.startsWith('192.168.') || host.startsWith('10.') || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host);
  } catch {
    return true;
  }
}

export function sanitizeString(input: string, maxLen = 120): string {
  return String(input ?? '').trim().slice(0, maxLen);
}

export function normalizePage(page?: number): number {
  const n = Number.isFinite(page as number) ? (page as number) : 1;
  return Math.max(1, Math.min(100, n));
}


