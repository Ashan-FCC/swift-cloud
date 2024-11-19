import { NestFactory } from '@nestjs/core'
import { IndexerModule } from './indexer/indexer.module'
import { IndexerService } from './indexer/indexer.service'
import path from 'node:path'
import * as fs from 'node:fs'
import csv from 'csv-parser'
import { setupConfig } from './config'
async function bootstrap() {
  setupConfig()

  const app = await NestFactory.createApplicationContext(IndexerModule)

  const indexerService = app.get(IndexerService)
  await indexerService.deleteIndex()
  try {
    const filePath = path.resolve(__dirname, '../initial-data.csv')
    const readStream = fs.createReadStream(filePath).pipe(csv())

    let records = []
    for await (const data of readStream) {
      records.push(data)
      if (records.length >= 200) {
        await indexerService.indexRecords(records)
        records = []
      }
    }
    await indexerService.indexRecords(records)

    console.log('CSV file successfully processed.')
  } catch (error) {
    console.error('Error in script execution:', error)
  } finally {
    await app.close()
  }
}

bootstrap()
