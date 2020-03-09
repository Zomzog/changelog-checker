import * as core from '@actions/core'

export class Config {
  githubToken: string
  fileName: string
  constructor(githubToken: string, fileName: string) {
    this.githubToken = githubToken
    this.fileName = fileName
  }
}

export function readConfig(): Config {
  const token = readGithubToken()
  const name = readFileName()
  return new Config(token, name)
}

function readGithubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token)
    throw ReferenceError(
      'Github token required, add "env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}"'
    )
  return token
}

function readFileName(): string {
  const fileName = core.getInput('fileName')
  if (!fileName) throw ReferenceError('Changelog fileName required"')
  return fileName
}
