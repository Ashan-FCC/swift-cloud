import { ElasticsearchService } from '@nestjs/elasticsearch'
import { Indexer } from './indexer'
import { mappings } from './v1/mapping'
import { transform } from './v1/transform'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ICsvInput, ISongAnalytics } from './types'

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
      settings: {
        index: {
          max_ngram_diff: 18,
        },
        analysis: {
          filter: {
            lowercase_filter: {
              type: 'lowercase',
            },
          },
          tokenizer: {
            edge_ngram_tokenizer: {
              type: 'edge_ngram',
              min_gram: 2,
              max_gram: 20,
              token_chars: ['letter', 'digit'],
            },
          },
          analyzer: {
            edge_ngram_analyzer: {
              type: 'custom',
              tokenizer: 'edge_ngram_tokenizer',
              filter: ['lower_case_filter'],
            },
          },
        },
      },
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
