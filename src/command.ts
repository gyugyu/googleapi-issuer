#!/usr/bin/env node

import { program } from 'commander'
import path from 'path'
import index from './index'

const cwd = process.cwd()

const split = (value: string) => {
  return value.split(',')
}

const join = (value: string) => {
  return path.join(cwd, value)
}

interface Options {
  dir: string
  outDir: string
  scopes: string[]
}

program
  .version(require('../package.json').version)
  .arguments('<scope>')
  .option('-d, --dir <dir>', 'directory where credentials.json placed', join, cwd)
  .option('-o, --out-dir <dir>', 'out dir where token.json will be dumped', join, cwd)
  .option('-s, --scopes <scopes>', 'optional scopes', split, [])
  .action((scope: string, options: Options) => {
    options.scopes.push(scope)
    index(options).then(() => {
      process.exit(0)
    }).catch(err => {
      console.error(err)
      process.exit(1)
    })
  })

program.parse(process.argv)
