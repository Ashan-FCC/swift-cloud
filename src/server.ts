import { INestApplication, Logger, ValidationPipe } from '@nestjs/common'
import { setupConfig } from './config'
import { NestFactory } from '@nestjs/core'
import { ApiModule } from './api/api.module'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'

if (require.main === module) {
  start().catch(die)
}

export async function start(): Promise<INestApplication> {
  setupConfig()

  process.on('warning', (e) => {
    console.error(e, { kind: 'process-warning' })
  })

  process.on('uncaughtException', (err) => {
    console.error(err, { kind: 'process-error' })
  })

  process.on('unhandledRejection', (err) => {
    console.error(err, { kind: 'process-rejection' })
  })

  const app: INestApplication = await NestFactory.create(ApiModule, {
    logger: Logger,
  })

  app.setGlobalPrefix('v1')
  app.use(helmet())
  app.enableCors({ origin: true, credentials: true })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  setupSwagger(app)
  const port = Number(process.env.PORT || 3100)

  await app.listen(port)

  console.log('http app listening on port', port)
  return app
}

function die(error: Error): Promise<void> {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
}

function setupSwagger(app: INestApplication): void {
  const server =
    process.env.NODE_ENV === 'production'
      ? process.env.SERVICE_HOST!
      : `http://localhost:${process.env.PORT}`
  const options: Omit<OpenAPIObject, 'components' | 'paths'> =
    new DocumentBuilder()
      .setTitle('SwiftCloud API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addServer(server)
      .build()

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('docs', app, document)
}
