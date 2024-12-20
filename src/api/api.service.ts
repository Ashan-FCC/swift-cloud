import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { indexName } from '../indexer/indexer.fn'
import { ISongAnalytics } from '../indexer/types'
import { buildEsQuery } from './query.fn'
import { SearchDto } from './dto/search.dto'
import { SongResponseDto } from './dto/resonse.dto'

@Injectable()
export class ApiService {
  private readonly indexName: string
  private readonly elasticsearch: ElasticsearchService
  constructor() {
    this.elasticsearch = new ElasticsearchService({
      node: process.env.ELASTICSEARCH_URL,
      requestTimeout: Number(
        process.env.ELASTICSEARCH_REQUEST_TIMEOUT_MS || 30_000
      ),
      tls: {
        rejectUnauthorized: false,
      },
      ...(process.env.NODE_ENV === 'production'
        ? { auth: { apiKey: process.env.ELASTICSEARCH_AUTH! } }
        : {}),
    })
    this.indexName = indexName(
      process.env.ES_NAMESPACE!,
      process.env.ANALYTICS_INDEX_NAME!,
      Number(process.env.SONG_ANALYTICS_INDEX_VERSION || 1)
    )
  }

  async getSongs(dto: SearchDto): Promise<SongResponseDto[]> {
    try {
      const searchResponse = await this.elasticsearch.search({
        index: this.indexName,
        ...buildEsQuery(dto),
        size: 200,
      })

      return searchResponse.hits.hits.map((hit) => {
        const {
          song,
          artists,
          album,
          version,
          writers,
          releaseYear,
          playCounts,
          lastYearsCount,
          last3MonthsCount,
          lastMonthsCount,
          totalCount,
        } = hit._source as ISongAnalytics
        return {
          id: hit._id!,
          song,
          artists,
          writers,
          album,
          version,
          releaseYear,
          playCounts,
          lastYearsCount,
          last3MonthsCount,
          lastMonthsCount,
          totalCount,
        }
      })
    } catch (e) {
      return []
    }
  }
}
