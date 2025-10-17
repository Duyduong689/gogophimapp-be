import { Body, Controller, Post } from '@nestjs/common';

@Controller('v1/admin')
export class AdminController {

  @Post('cache/purge')
  purge(@Body() body: { keys?: string[]; prefix?: string }): { purged: number } {
    // Cache disabled; respond success without action
    const count = (body?.keys?.length ?? 0) > 0 || body?.prefix ? 0 : 0;
    return { purged: count };
  }
}


