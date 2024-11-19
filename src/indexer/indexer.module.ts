import { IndexerService } from './indexer.service'
import { Module } from '@nestjs/common'
import { ElasticsearchModule } from '@nestjs/elasticsearch'

@Module({
  providers: [IndexerService],
  exports: [IndexerService],
})
export class IndexerModule {}
