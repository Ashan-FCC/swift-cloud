import { ApiProperty } from '@nestjs/swagger'
import { PlayCount } from '../../indexer/types'

export class SongResponseDto {
  @ApiProperty({ description: 'Unique identifier of the song', example: '1' })
  id!: string

  @ApiProperty({ description: 'Title of the song', example: 'Love Story' })
  song!: string

  @ApiProperty({
    description: 'Artists of the song',
    example: ['Taylor Swift'],
  })
  artists!: string[]

  @ApiProperty({
    description: 'Writers of the song',
    example: ['Taylor Swift', 'Ed Sheeran'],
  })
  writers!: string[]

  @ApiProperty({ description: 'Year the song was released', example: 2008 })
  releaseYear!: number

  @ApiProperty({
    description: 'Play counts of the song by month',
    example: [{ month: '2024-07', plays: 2000 }],
  })
  playCounts!: PlayCount[]

  @ApiProperty({
    description: 'Total number of plays in the last year',
    example: 1000,
  })
  lastYearsCount!: number

  @ApiProperty({
    description: 'Total number of plays in the last 3 months',
    example: 1000,
  })
  last3MonthsCount!: number

  @ApiProperty({
    description: 'Total number of plays in the last month',
    example: 1000,
  })
  lastMonthsCount!: number

  @ApiProperty({
    description: 'Total number of plays all time',
    example: 1000,
  })
  totalCount!: number
}
