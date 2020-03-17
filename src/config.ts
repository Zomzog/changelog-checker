import * as core from '@actions/core'

export class Config {
  githubToken: string
  fileName: string
  noChangelogLabel: string
  constructor(githubToken: string, fileName: string, noChangelogLabel: string) {
    this.githubToken = githubToken
    this.fileName = fileName
    this.noChangelogLabel = noChangelogLabel
  }
}

export function readConfig(): Config {
  const token = readGithubToken()
  const name = readFileName()
  const noChangelogLabel = readNoChangelogLabel()
  return new Config(token, name, noChangelogLabel)
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


function readNoChangelogLabel(): string {
  const label = core.getInput('noChangelogLabel')
  if (!label) {
    return 'no changelog'
  } else {
    return label
  }
}
