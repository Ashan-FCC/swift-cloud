import { Module } from '@nestjs/common'
import { ApiController } from './api.controller'
import { ApiService } from './api.service'
import { ElasticsearchModule } from '@nestjs/elasticsearch'

@Module({
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
