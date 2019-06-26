#!/usr/bin/env node

import program from 'commander'
import path from 'path'
import index from './index'

const split = (value: string) => {
  return value.split(',')
}

const resolve = (value: string) => {
  return path.resolve(value)
}

interface Options {
  dir: string
  outDir: string
  scopes: string[]
}

program
  .version(require('../package.json').version)
  .arguments('<scope>')
  .option('-d, --dir <dir>', 'directory where credentials.json placed', resolve, process.cwd())
  .option('-o, --out-dir <dir>', 'out dir where token.json will be dumped', resolve, process.cwd())
  .option('-s, --scopes <scopes>', 'optional scopes', split, [])
  .action((scope: string, options: Options) => {
    options.scopes.push(scope)
    index(options)
  })

program.parse(process.argv)
