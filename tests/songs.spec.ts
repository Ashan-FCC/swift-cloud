import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { ApiModule } from '../src/api/api.module'
import * as dotenv from 'dotenv'
import request from 'supertest'

describe('Songs API Integration Tests', () => {
  dotenv.config({ path: '.env.itest' })

  let app: INestApplication
  const port = Number(process.env.PORT!)
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return a list of songs', async () => {
    const response = await request(app.getHttpServer()).get(
      '/swift-cloud/songs'
    )

    expect(response.body).toBeDefined()
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('album')
    expect(response.body[0]).toHaveProperty('song')
  })

  it('should return a list of songs filtered', async () => {
    const response = await request(app.getHttpServer())
      .get('/swift-cloud/songs')
      .query({ artist: 'Taylor Swift', releaseYear: 2020 })
      .expect(200)

    expect(response.body).toBeDefined()
  })

  it('should sort songs by release year', async () => {
    const response = await request(app.getHttpServer())
      .get('/swift-cloud/songs')
      .query({ sortBy: 'release_date', sortDirection: 'asc' })
      .expect(200)

    expect(response.body[0].releaseYear).toEqual(2006)
  })

  it('should sort songs by popularity', async () => {
    const response = await request(app.getHttpServer())
      .get('/swift-cloud/songs')
      .query({
        sortBy: 'popularity',
        sortDirection: 'desc',
        popularity: 'all_time',
      })
      .expect(200)

    expect(response.body[0].totalCount).toEqual(307)
  })
})
