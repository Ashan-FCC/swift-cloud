import { Controller, Get, Query } from '@nestjs/common'
import { ApiService } from './api.service'
import { ISongAnalytics } from '../indexer/types'
import { ApiQuery, ApiResponse } from '@nestjs/swagger'
import { SongResponseDto } from './dto/resonse.dto'
import { SearchDto } from './dto/search.dto'

@Controller('swift-cloud')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('/songs')
  @ApiResponse({
    status: 200,
    description: 'A list of songs matching the search criteria',
    type: [SongResponseDto],
  })
  async popularSongs(@Query() dto: SearchDto): Promise<SongResponseDto[]> {
    return this.apiService.getSongs(dto)
  }
}
