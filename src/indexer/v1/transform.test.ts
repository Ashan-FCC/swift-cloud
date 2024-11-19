import { transform } from './transform'
import { ICsvInput } from '../types'

beforeAll(() => {
  jest.useFakeTimers()
  jest.setSystemTime(new Date('2024-11-30T00:00:00Z'))
})
describe('transform function', () => {
  it('should transform CSV input to song analytics', () => {
    const records = [
      {
        id: '1',
        song: 'Song A',
        artist: 'Artist 1\nfeaturing Artist 2\nand Artist 3',
        writer: 'Writer 1\nWriter 2',
        album: 'Album A',
        year: '2022',
        'plays_2024-07': 200,
        'plays_2024-08': 100,
        'plays_2024-09': 200,
        'plays_2024-10': 300,
      },
    ]

    const result = transform(records)
    expect(result).toEqual([
      {
        _id: '1',
        version: expect.any(Number),
        album: 'Album A',
        artists: ['Artist 1', 'Artist 2', 'Artist 3'],
        song: 'Song A',
        writers: ['Writer 1', 'Writer 2'],
        releaseYear: 2022,
        playCounts: [
          { month: '2024-07', plays: 200 },
          { month: '2024-08', plays: 100 },
          { month: '2024-09', plays: 200 },
          { month: '2024-10', plays: 300 },
        ],
        lastYearsCount: 800,
        last3MonthsCount: 600,
        lastMonthsCount: 300,
        totalCount: 800,
      },
    ])
  })

  it('should handle empty records gracefully', () => {
    const records: ICsvInput[] = []
    const result = transform(records)
    expect(result).toEqual([])
  })
})
