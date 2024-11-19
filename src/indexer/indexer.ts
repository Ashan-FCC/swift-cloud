import { ICsvInput, IIndexerOptions, ISongAnalytics } from './types'
import { indexName } from './indexer.fn'
import { ElasticsearchService } from '@nestjs/elasticsearch'

export class Indexer<I extends { readonly id: string }, O> {
  public readonly indexName: string

  constructor(
    private readonly elasticsearch: ElasticsearchService,
    private readonly options: IIndexerOptions<ICsvInput, ISongAnalytics>
  ) {
    this.indexName = indexName(
      options.namespace,
      options.entity,
      options.version
    )
  }

  public async bulkIndex(records: I[]): Promise<void> {
    try {
      if (!records?.length) {
        return
      }

      // @ts-ignore
      const sources = this.options.transform(records)

      const operations = sources.flatMap((source) => {
        const { _id, ...rest } = source

        return [
          {
            index: {
              _id,
              _index: this.indexName,
              version: source.version,
              version_type: 'external',
            },
          },
          rest,
        ]
      })

      // await this.elasticsearch.bulk({});
      const data = await this.elasticsearch.bulk({
        refresh: true,
        operations,
      })

      // Check for errors
      if (data.errors) {
        console.error('Bulk indexing errors:', data.items)
      } else {
        console.log(`Successfully indexed ${records.length} songs`)
      }
    } catch (error) {
      console.error(error, {
        message: 'Error on bulkIndex',
        index: this.indexName,
        records: records.map((r) => r.id),
      })

      throw error
    }
  }

  public async assertIndex(): Promise<void> {
    const exist = await this.hasIndex()
    if (exist) {
      return
    }

    try {
      await this.elasticsearch.indices.create({
        index: this.indexName,
        body: {
          mappings: this.options.mappings,
          settings: {
            analysis: {
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
                  filter: ['lowercase'],
                },
              },
            },
          },
        },
      })
    } catch (e) {
      console.error(e)
    }
  }

  private async hasIndex(): Promise<boolean> {
    try {
      const config = await this.elasticsearch.indices.get({
        index: this.indexName,
      })

      return Object.keys(config).indexOf(this.indexName) !== -1
    } catch (error: any) {
      if (error?.statusCode === 404) {
        return false
      }

      throw error
    }
  }

  private serializeBody(body: any[]): string {
    return body.reduce(
      (acc, current) => `${acc}${JSON.stringify(current)}\n`,
      ''
    )
  }

  public async deleteIndex(): Promise<void> {
    await this.elasticsearch.indices.delete({ index: this.indexName })
  }
}
