import * as core from '@actions/core'
import {CheckNotification, Properties} from '../domain/Properties'

export class PropertiesService {
  private _properties: Properties

  constructor() {
    const token = this.readGithubToken()
    const name = this.readFileName()
    const noChangelogLabel = this.readNoChangelogLabel()
    const checkType = this.readCheckType()
    this._properties = new Properties(token, name, noChangelogLabel, checkType)
  }

  properties(): Properties {
    return this._properties
  }

  private readGithubToken(): string {
    core.debug('Read github token')
    const token = process.env.GITHUB_TOKEN
    if (!token)
      throw ReferenceError(
        'Github token required, add "env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}"'
      )
    return token
  }

  private readFileName(): string {
    core.debug('Read filename')
    const fileName = core.getInput('fileName')
    if (!fileName) throw ReferenceError('Changelog fileName required')
    return fileName
  }

  private readNoChangelogLabel(): string {
    const label = core.getInput('noChangelogLabel')
    if (!label) throw ReferenceError('Changelog label required')
    return label
  }

  private readCheckType(): CheckNotification {
    const checkNotification = core.getInput('checkNotification')
    if (!checkNotification) {
      return CheckNotification.Detailed
    } else {
      if (checkNotification === 'Simple') return CheckNotification.Simple
      if (checkNotification === 'Detailed') return CheckNotification.Detailed
      throw ReferenceError('Check notification must be Simple or Detailed')
    }
  }
}
