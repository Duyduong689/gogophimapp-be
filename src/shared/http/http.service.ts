import { Injectable, Logger } from '@nestjs/common';
import { delayWithJitter } from '../utils/backoff';
import { isBlockedHost, isHttpsUrl } from '../utils/url';

type HttpMethod = 'GET' | 'POST';

export interface HttpRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: string | Buffer;
  timeoutMs?: number;
  retries?: number;
  retryBackoffsMs?: number[]; // e.g. [250, 750]
}

interface CircuitState {
  failures: number;
  openedAt: number | null;
}

type FetchResponse = Awaited<ReturnType<typeof fetch>>;

@Injectable()
export class HttpService {
  private readonly logger = new Logger(HttpService.name);
  private readonly defaultTimeout = 6000;
  private readonly defaultUA =
    process.env.PROXY_UA_MOBILE ??
    'Mozilla/5.0 (Android 13; Mobile) AppleWebKit/537.36 Chrome/124.0 Safari/537.36';
  private readonly circuitByHost = new Map<string, CircuitState>();
  private readonly failureThreshold = 5;
  private readonly openMs = 30000; // 30s

  private getHost(url: string): string {
    try {
      return new URL(url).host;
    } catch {
      return 'invalid';
    }
  }

  private isCircuitOpen(host: string): boolean {
    const state = this.circuitByHost.get(host);
    if (!state || state.openedAt == null) return false;
    const now = Date.now();
    if (now - state.openedAt > this.openMs) {
      this.circuitByHost.set(host, { failures: 0, openedAt: null });
      return false;
    }
    return true;
  }

  private recordFailure(host: string): void {
    const prev = this.circuitByHost.get(host) ?? { failures: 0, openedAt: null };
    const failures = prev.failures + 1;
    const openedAt = failures >= this.failureThreshold ? Date.now() : prev.openedAt;
    this.circuitByHost.set(host, { failures, openedAt });
  }

  private recordSuccess(host: string): void {
    this.circuitByHost.set(host, { failures: 0, openedAt: null });
  }

  async request(url: string, opts: HttpRequestOptions = {}): Promise<FetchResponse> {
    if (!isHttpsUrl(url)) {
      throw new Error('Only https scheme is allowed');
    }
    if (isBlockedHost(url)) {
      throw new Error('Blocked host');
    }

    const host = this.getHost(url);
    if (this.isCircuitOpen(host)) {
      throw new Error(`Circuit open for ${host}`);
    }

    const method = opts.method ?? 'GET';
    const timeoutMs = opts.timeoutMs ?? this.defaultTimeout;
    const retries = opts.retries ?? 2;
    const retryBackoffsMs = opts.retryBackoffsMs ?? [250, 750];

    let lastErr: unknown = undefined;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        const headers: Record<string, string> = {
          'User-Agent': this.defaultUA,
          ...(opts.headers ?? {}),
        };

        const res = await fetch(url, {
          method,
          headers,
          body: opts.body as any,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (res.status >= 500 && attempt < retries) {
          await delayWithJitter(retryBackoffsMs[attempt] ?? 500);
          continue;
        }
        if (res.status >= 400) {
          if (res.status >= 500) this.recordFailure(host);
          return res;
        }

        this.recordSuccess(host);
        return res;
      } catch (err) {
        lastErr = err;
        this.recordFailure(host);
        if (attempt < retries) {
          await delayWithJitter(retryBackoffsMs[attempt] ?? 500);
          continue;
        }
      }
    }

    this.logger.warn(`HTTP request failed after retries: ${url}`);
    throw lastErr instanceof Error ? lastErr : new Error('Request failed');
  }

  async getJson<T>(url: string, opts: HttpRequestOptions = {}): Promise<T> {
    const res = await this.request(url, { ...opts, method: 'GET' });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Upstream error ${res.status}: ${text.slice(0, 200)}`);
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error('Invalid JSON from upstream');
    }
  }

  async getText(url: string, opts: HttpRequestOptions = {}): Promise<string> {
    const res = await this.request(url, { ...opts, method: 'GET' });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Upstream error ${res.status}: ${text.slice(0, 200)}`);
    }
    return text;
  }
}


