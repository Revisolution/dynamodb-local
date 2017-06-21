import * as fs from 'fs'
import * as http from 'http'
import * as path from 'path'
import * as ProgressBar from 'progress'
import * as tar from 'tar'
import * as zlib from 'zlib'
import { Config } from './config'

const download = (config: Config): Promise<void> => {
  console.log('Start downloading dynamodb local...')
  return new Promise<void>((resolve, reject) => {
    http.get(config.downloadURL, (response) => {
      const len = parseInt(String(response.headers['content-length']), 10)
      const bar = new ProgressBar('Downloading dynamodb local [:bar] :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 40,
        total: len,
      })

      if (200 !== response.statusCode) {
        throw new Error('Error getting DynamoDb local latest tar.gz location ' + response.headers.location + ': ' + response.statusCode)
      }

      response
        .on('data', (chunk) => {
          bar.tick(chunk.length)
        })
        .pipe(zlib.createUnzip())
        .pipe(tar.extract({
          C: config.installPath,
        }))
        .on('end', () => {
          resolve()
        })
        .on('error', (error) => {
          reject(error)
        })
      })
  })
}

export const install = async (config: Config) => {
  if (fs.existsSync(path.join(config.installPath, config.jar))) {
    console.log('Dynamodb is already installed on path')
    return
  } else {
    if (!fs.existsSync(config.installPath)) {
      fs.mkdirSync(config.installPath)
    }
    return download(config)
  }
}
