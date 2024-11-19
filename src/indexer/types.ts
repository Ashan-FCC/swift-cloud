import {
  IndicesIndexSettings,
  MappingTypeMapping,
} from '@elastic/elasticsearch/lib/api/types'

export interface IIndexable {
  readonly _id: string
  readonly version: number
}

export type TransformFunction<I, O> = (records: I[]) => (IIndexable & O)[]

export interface IIndexerOptions<I, O> {
  readonly mappings: MappingTypeMapping
  readonly transform: TransformFunction<I, O>
  readonly namespace: string
  readonly settings?: IndicesIndexSettings
  readonly version: number
  readonly url: string
  readonly entity: string
}

export type ICsvInput = {
  readonly id: string
  readonly song: string
  readonly artist: string
  readonly writer: string
  readonly album: string
  readonly year: string
}

export interface ISongAnalytics extends IIndexable {
  readonly album: string
  readonly artists: string[]
  readonly song: string
  readonly writers: string[]
  readonly releaseYear: number
  readonly playCounts: PlayCount[]
  readonly lastYearsCount: number
  readonly last3MonthsCount: number
  readonly lastMonthsCount: number
  readonly totalCount: number
}

export interface PlayCount {
  readonly month: string // Format: "yyyy-MM"
  readonly plays: number
}
