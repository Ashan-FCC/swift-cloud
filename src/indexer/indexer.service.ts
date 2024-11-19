import { ElasticsearchService } from '@nestjs/elasticsearch'
import { Indexer } from './indexer'
import { mappings } from './v1/mapping'
import { transform } from './v1/transform'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ICsvInput, ISongAnalytics } from './types'
import { settings } from './v1/settings'

@Injectable()
export class IndexerService implements OnApplicationBootstrap {
  private readonly elasticsearch: ElasticsearchService
  private readonly indexer: Indexer<ICsvInput, ISongAnalytics>
  constructor() {
    this.elasticsearch = new ElasticsearchService({
      node: process.env.ELASTICSEARCH_URL,
      requestTimeout: Number(
        process.env.ELASTICSEARCH_REQUEST_TIMEOUT_MS || 30_000
      ),
      tls: {
        rejectUnauthorized: false, // Optional: Only for self-signed certificates
      },
      ...(process.env.NODE_ENV === 'production'
        ? { auth: { apiKey: process.env.ELASTICSEARCH_AUTH! } }
        : {}),
    })

    this.indexer = new Indexer<ICsvInput, ISongAnalytics>(this.elasticsearch, {
      namespace: process.env.ES_NAMESPACE!,
      mappings: mappings,
      transform: transform,
      settings,
      url: process.env.ELASTICSEARCH_URL!,
      entity: process.env.ANALYTICS_INDEX_NAME!,
      version: Number(process.env.SONG_ANALYTICS_INDEX_VERSION || 1),
    })
  }

  async onApplicationBootstrap() {
    await this.indexer.assertIndex()
  }

  async indexRecords(data: ICsvInput[]) {
    await this.indexer.bulkIndex(data)
  }

  async deleteIndex() {
    await this.indexer.deleteIndex()
  }
}
