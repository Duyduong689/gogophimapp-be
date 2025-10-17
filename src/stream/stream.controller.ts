import { Controller, Get, Query } from '@nestjs/common';
import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get()
  async get(@Query('type') type?: 'movie' | 'series', @Query('link') link?: string) {
    return this.streamService.getStream({ type, link });
  }

  @Get('direct')
  async getDirect(@Query('path') path?: string, @Query('url') url?: string) {
    // either provide a full url or a media path
    return this.streamService.getDirectStream({ path, url });
  }
}


