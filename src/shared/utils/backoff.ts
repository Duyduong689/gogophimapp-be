export function expoBackoff(attempt: number, baseMs = 250): number {
  return baseMs * Math.pow(1.5, attempt);
}

export async function delay(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

export async function delayWithJitter(ms: number): Promise<void> {
  const jitter = Math.floor(Math.random() * Math.floor(ms / 2));
  await delay(ms + jitter);
}


