/**
 * Zapisuje dist/version.json: wersja, commit SHA i czas builda.
 *
 * Uruchamiany jako czesc `npm run build`, nie tylko w CI - inaczej build lokalny
 * dawalby inny artefakt niz CI, co lamie powtarzalnosc (spec 23.3).
 * Plik NIE zawiera sekretow.
 */

import { execFileSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

function git(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
  } catch {
    return null
  }
}

const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
const commit = process.env.GITHUB_SHA ?? git(['rev-parse', 'HEAD']) ?? 'unknown'

const version = {
  version: pkg.version,
  commit,
  shortCommit: commit.slice(0, 7),
  ref: process.env.GITHUB_REF_NAME ?? git(['describe', '--tags', '--always']) ?? 'unknown',
  environment: process.env.VITE_ENV_NAME ?? 'local',
  builtAt: new Date().toISOString(),
  node: process.version,
}

const target = resolve(root, 'dist', 'version.json')
await writeFile(target, `${JSON.stringify(version, null, 2)}\n`, 'utf8')
console.log(`version.json -> ${version.version} @ ${version.shortCommit} (${version.environment})`)
