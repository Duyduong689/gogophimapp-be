import { Controller, Get, Query } from '@nestjs/common';
import { MetaService } from './meta.service';
import { GetMetaQueryDto, Info } from './dto';

@Controller('v1')
export class MetaController {
  constructor(private readonly service: MetaService) {}

  @Get('meta')
  async getMeta(@Query() query: GetMetaQueryDto): Promise<Info> {
    return this.service.getMeta(query);
  }
}


