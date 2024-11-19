import { MappingTypeMapping } from '@elastic/elasticsearch/lib/api/types'

export const mappings: MappingTypeMapping = {
  properties: {
    title: {
      type: 'text',
      analyzer: 'edge_ngram_analyzer',
      search_analyzer: 'standard',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
    artists: {
      type: 'text',
      analyzer: 'edge_ngram_analyzer',
      search_analyzer: 'standard',
    },
    writers: {
      type: 'text',
      analyzer: 'edge_ngram_analyzer',
      search_analyzer: 'standard',
    },
    album: {
      type: 'text',
      analyzer: 'edge_ngram_analyzer',
      search_analyzer: 'standard',
    },
    release_year: {
      type: 'integer',
    },
    playCounts: {
      type: 'nested',
      properties: {
        month: {
          type: 'date',
          format: 'yyyy-MM',
        },
        plays: {
          type: 'integer',
        },
      },
    },
    lastYearsCount: { type: 'integer' },
    last3MonthsCount: { type: 'integer' },
    lastMonthsCount: { type: 'integer' },
    totalCount: { type: 'integer' },
  },
}
