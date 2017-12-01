import * as os from 'os'
import * as path from 'path'

export interface Config {
  downloadURL: string
  installPath: string
  jar: string
  port: number
  dbPath?: string
  sharedDB?: boolean
  cors?: string
  delayTransientStatuses?: boolean
  optimizeDbBeforeStartup?: boolean
  silent?: boolean
}

export const baseConfig: Config = {
  downloadURL: 'http://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz',
  installPath: path.join(os.homedir(), '.dynamodb'),
  jar: 'DynamoDBLocal.jar',
  port: 8000,
  silent: false,
}
