import { config } from 'dotenv'
import { join } from 'path'

export function setupConfig() {
  config({ path: join(process.cwd(), '.env.base') })

  if (process.env.NODE_ENV === 'production') {
    config({ path: join(process.cwd(), '.env.production'), override: true })
  } else if (process.env.NODE_ENV === 'test') {
    config({ path: join(process.cwd(), '.env.itest'), override: true })
  } else {
    config({ path: join(process.cwd(), '.env'), override: true })
  }
}
