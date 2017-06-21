import { ChildProcess } from 'child_process'
import {
  baseConfig,
  Config,
} from './config'
import { install } from './install'
import { start } from './start'

export class DynamoDB {
  public config: Config
  public process: ChildProcess

  public constructor(overrideConfig: Partial<Config> = {}) {
    this.config = {
      ...baseConfig,
      ...overrideConfig,
    }
  }

  public install(): Promise<void> {
    return install(this.config)
  }

  public start(): Promise<void> {
    return start(this.config)
      .then((child) => {
        console.log('Dynamodb Local Started, Visit: http://localhost:' + this.config.port + '/shell')
        this.process = child
      })
  }

  public installAndStart(): Promise<void> {
    return this.install()
      .then(this.start.bind(this))
  }

  public stop() {
    if (this.process == null || !this.process.connected) {
      console.warn('No process to stop.')
    } else {
      this.process.kill()
    }
  }

  public restart(): Promise<void> {
    this.stop()
    return this.start()
  }
}

export default DynamoDB
