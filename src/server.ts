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
  const port = Number(process.env.SERVICE_PORT || 3100)

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
  const options: Omit<OpenAPIObject, 'components' | 'paths'> =
    new DocumentBuilder()
      .setTitle('SwiftCloud API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addServer(`http://https://swift-cloud-799ab6467e8a.herokuapp.com`)
      .build()

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('docs', app, document)
}
