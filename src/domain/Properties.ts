export class Properties {
  githubToken: string
  fileName: string
  noChangelogLabel: string
  constructor(githubToken: string, fileName: string, noChangelogLabel: string) {
    this.githubToken = githubToken
    this.fileName = fileName
    this.noChangelogLabel = noChangelogLabel
  }
}
