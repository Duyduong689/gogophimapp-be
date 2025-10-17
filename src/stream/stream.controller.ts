import { Controller, Get, Query } from '@nestjs/common';
import { StreamService } from './stream.service';
import { GetDirectQueryDto, GetStreamQueryDto, StreamItem } from './dto';

@Controller('v1')
export class StreamController {
  constructor(private readonly service: StreamService) {}

  @Get('stream')
  async getStream(@Query() query: GetStreamQueryDto): Promise<StreamItem[]> {
    return this.service.resolve(query);
  }

  @Get('direct')
  async getDirect(@Query() query: GetDirectQueryDto): Promise<StreamItem> {
    return this.service.direct(query);
  }
}


