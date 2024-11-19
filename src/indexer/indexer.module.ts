import { IndexerService } from './indexer.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [IndexerService],
  exports: [IndexerService],
})
export class IndexerModule {}
