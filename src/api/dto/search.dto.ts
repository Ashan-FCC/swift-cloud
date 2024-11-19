import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  ValidateIf,
} from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export enum PopularityRange {
  ALL_TIME = 'all_time',
  LAST_YEAR = 'last_12_months',
  LAST_3_MONTHS = 'last_3_months',
  LAST_MONTH = 'last_month',
}
export enum SortBy {
  RELEASE_DATE = 'release_date',
  POPULARITY = 'popularity',
}

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export class SearchDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'A song you want to search by. Can match partially too',
    required: false,
  })
  song?: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'A name of the artist other than Taylor Swift to search for. Can match partially too',
    required: false,
  })
  artist?: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Name of the album to search for. Can match partially too',
    required: false,
  })
  album?: string

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Year the song was released',
    required: false,
    example: 2020,
  })
  @Transform(({ value }) => parseInt(value, 10))
  releaseYear?: number

  @IsOptional()
  @IsEnum(SortBy)
  @ApiProperty({
    description: 'Sorting criterion',
    required: false,
    enum: SortBy,
  })
  sortBy?: SortBy

  @ValidateIf((o) => o.sortBy === SortBy.POPULARITY)
  @IsOptional()
  @IsEnum(PopularityRange)
  @ApiProperty({
    description:
      'If sorting by popularity, you must specify the range to look up for',
    required: false,
    enum: PopularityRange,
    default: 'desc',
  })
  popularity?: PopularityRange

  @ValidateIf((o) => !!o.sortBy)
  @IsOptional()
  @IsEnum(SortDirection)
  @ApiProperty({
    description: 'Sorting direction',
    required: false,
    enum: SortDirection,
    default: 'desc',
  })
  sortDirection?: SortDirection = SortDirection.desc
}
