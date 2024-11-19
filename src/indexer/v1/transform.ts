import { ICsvInput, ISongAnalytics } from '../types'

export function transform(records: ICsvInput[]): ISongAnalytics[] {
  return records.map((r) => {
    const { id, song, artist, writer, album, year, ...rest } = r

    return {
      _id: id,
      version: new Date().getTime(),
      album,
      artists: artist.split('\n').map((a) => {
        let artistStr = a.replace('featuring ', '')
        artistStr = artistStr.startsWith('and ')
          ? artistStr.replace('and ', '')
          : artistStr

        return artistStr.trim()
      }),
      song,
      writers: writer.split('\n').map((a) => a.trim()),
      releaseYear: Number(year),
      ...aggregatesPlayCounts(rest),
    }
  })
}

function aggregatesPlayCounts(playCountsData: Record<string, number>) {
  const playCounts = []
  let lastYearsCount = 0
  let last3MonthsCount = 0
  let lastMonthsCount = 0
  let totalCount = 0
  const now = new Date()
  now.setDate(1)
  now.setHours(0, 0, 0, 0)

  for (const key in playCountsData) {
    if (!key.startsWith('plays_')) {
      continue
    }
    const yyyyMM = key.replace('plays_', '')
    const plays = Number(playCountsData[key])
    playCounts.push({
      month: yyyyMM,
      plays,
    })

    const [year, month] = yyyyMM.split('-').map(Number)
    const date = new Date(year, month - 1)

    if (isWithinLastMonths(date, 1)) {
      lastMonthsCount += plays
    }
    if (isWithinLastMonths(date, 3)) {
      last3MonthsCount += plays
    }
    if (isWithinLastMonths(date, 12)) {
      lastYearsCount += plays
    }
    totalCount += plays
  }

  return {
    playCounts,
    lastYearsCount,
    last3MonthsCount,
    lastMonthsCount,
    totalCount,
  }
}

function isWithinLastMonths(inputDate: Date, months: number) {
  // Get the current date and set to the first day of the current month
  const currentDate = new Date()
  currentDate.setDate(1)
  currentDate.setHours(0, 0, 0, 0)

  const pastDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
  pastDate.setMonth(pastDate.getMonth() - months)

  // Return true if the input date is within the range
  return inputDate >= pastDate && inputDate < currentDate
}
