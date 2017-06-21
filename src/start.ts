import { ChildProcess, spawn } from 'child_process'
import * as path from 'path'
import { Config } from './config'

export const start = (config: Config): Promise<ChildProcess> => {
  return new Promise((resolve, reject) => {

    const additionalArgs = []

    if (config.dbPath) {
      additionalArgs.push('-dbPath', config.dbPath)
    } else {
      additionalArgs.push('-inMemory')
    }
    if (config.sharedDB) {
      additionalArgs.push('-sharedDb')
    }
    if (config.cors) {
      additionalArgs.push('-cors', config.cors)
    }
    if (config.delayTransientStatuses) {
      additionalArgs.push('-delayTransientStatuses')
    }
    if (config.optimizeDbBeforeStartup) {
      additionalArgs.push('-optimizeDbBeforeStartup')
    }

    const args = [
      '-Djava.library.path=' + config.installPath + '/DynamoDBLocal_lib',
      '-jar', path.join(config.installPath, config.jar),
      '-port', String(config.port),
      ...additionalArgs,
    ]

    const child = spawn('java', args, {
        cwd: config.installPath,
        env: process.env,
        stdio: ['pipe', 'pipe', process.stderr],
    })

    if (!child.pid) {
      return reject(new Error('Unable to start DynamoDB Local process!'))
    }

    child.on('error', (error) => {
      console.error(error)
    })
    child.on('close', (code) => {
      if (code && code !== 0) {
        console.warn('DynamoDB Local process has been closed with ' + code)
      }
    })

    resolve(child)
  })
}
