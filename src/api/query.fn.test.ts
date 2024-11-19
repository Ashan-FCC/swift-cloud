import {
  PopularityRange,
  SearchDto,
  SortBy,
  SortDirection,
} from './dto/search.dto'
import { buildEsQuery } from './query.fn'

describe('buildEsQuery', () => {
  it('should return an empty query and sort when DTO is empty', () => {
    const dto: SearchDto = {}
    const result = buildEsQuery(dto)

    expect(result.query.bool.must).toEqual([])
    expect(result.query.bool.should).toEqual([])
    expect(result.sort).toEqual([])
  })

  it('should add a match query for song', () => {
    const dto: SearchDto = {
      song: 'All you had to',
      artist: 'Adele',
      releaseYear: 2021,
      album: '25',
    }
    const result = buildEsQuery(dto)

    expect(result.query.bool.must).toContainEqual({
      match: {
        song: {
          query: 'All you had to',
          fuzziness: 'AUTO',
        },
      },
    })
    expect(result.query.bool.must).toContainEqual({
      match: {
        artists: {
          query: 'Adele',
          fuzziness: 'AUTO',
        },
      },
    })
    expect(result.query.bool.must).toContainEqual({
      match: {
        album: '25',
      },
    })
    expect(result.query.bool.must).toContainEqual({
      term: {
        releaseYear: 2021,
      },
    })
  })

  it('should sort by release year with sort direction', () => {
    const dto: SearchDto = {
      sortBy: SortBy.RELEASE_DATE,
      sortDirection: SortDirection.desc,
    }
    const result = buildEsQuery(dto)

    expect(result.sort).toContainEqual({ releaseYear: 'desc' })
  })

  it('should sort by popularity', () => {
    const dto: SearchDto = {
      sortBy: SortBy.POPULARITY,
      popularity: PopularityRange.ALL_TIME,
      sortDirection: SortDirection.asc,
    }
    const result = buildEsQuery(dto)

    expect(result.sort).toContainEqual({ totalCount: 'asc' })
  })
})
