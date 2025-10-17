import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TimingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): void {
    const start = Date.now();
    res.on('finish', () => {
      const dur = Date.now() - start;
      if (dur > 1000) console.warn(`[TIMING] ${req.method} ${req.url} took ${dur}ms`);
    });
    next();
  }
}


