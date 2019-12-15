import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { AdminOnlyGuard } from './guards/admin-only/admin-only.guard';
import { SplitPipe } from './pipes/split/split.pipe';
import { IsObjectIdPipe } from './pipes/is-object-id/is-object-id.pipe';

@Module({
  imports: [ConfigModule],
  providers: [AdminOnlyGuard, SplitPipe, IsObjectIdPipe],
  exports: [AdminOnlyGuard, SplitPipe, IsObjectIdPipe],
})
export class CommonModule {}
