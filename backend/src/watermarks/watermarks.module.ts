import { Module } from '@nestjs/common';
import { WatermarksService } from './watermarks.service';
import { WatermarksController } from './watermarks.controller';

@Module({
  controllers: [WatermarksController],
  providers: [WatermarksService],
  exports: [WatermarksService],
})
export class WatermarksModule {}
