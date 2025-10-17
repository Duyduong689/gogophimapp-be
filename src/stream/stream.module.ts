import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { StreamResolver } from './resolver';

@Module({
  controllers: [StreamController],
  providers: [StreamService, StreamResolver],
})
export class StreamModule {}


