export class Properties {
  githubToken: string
  fileName: string
  noChangelogLabel: string
  checkNotification: CheckNotification
  constructor(
    githubToken: string,
    fileName: string,
    noChangelogLabel: string,
    checkNotification: CheckNotification
  ) {
    this.githubToken = githubToken
    this.fileName = fileName
    this.noChangelogLabel = noChangelogLabel
    this.checkNotification = checkNotification
  }
}

export enum CheckNotification {
  Simple,
  Detailed
}
