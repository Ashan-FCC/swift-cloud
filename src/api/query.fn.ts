import { PopularityRange, SearchDto, SortBy } from './dto/search.dto'

export function buildEsQuery(dto: SearchDto) {
  const {
    song,
    artist,
    releaseYear,
    album,
    sortBy,
    popularity,
    sortDirection,
  } = dto
  const query: any = {
    bool: {
      must: [],
      should: [],
    },
  }
  const sort = []

  if (song) {
    query.bool.must.push({
      match: {
        song: {
          query: song,
          fuzziness: 'AUTO',
        },
      },
    })
  }

  if (artist) {
    query.bool.must.push({
      match: {
        artists: {
          query: artist,
          fuzziness: 'AUTO',
        },
      },
    })
  }

  if (releaseYear) {
    query.bool.must.push({
      term: { releaseYear },
    })
  }

  if (album) {
    query.bool.must.push({
      match: { album },
    })
  }

  if (sortBy) {
    if (sortBy === SortBy.RELEASE_DATE) {
      sort.push({ releaseYear: sortDirection })
    } else if (sortBy === SortBy.POPULARITY) {
      const fieldMapping = {
        [PopularityRange.ALL_TIME]: 'totalCount',
        [PopularityRange.LAST_YEAR]: 'lastYearsCount',
        [PopularityRange.LAST_3_MONTHS]: 'last3MonthsCount',
        [PopularityRange.LAST_MONTH]: 'lastMonthsCount',
      }
      sort.push({
        [fieldMapping[popularity!]]: sortDirection,
      })
    }
  }

  return { query, sort }
}
