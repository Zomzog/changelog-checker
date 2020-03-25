import * as core from '@actions/core'
import {Properties} from '../domain/Properties'

export class PropertiesService {
  private _properties: Properties

  constructor() {
    const token = this.readGithubToken()
    const name = this.readFileName()
    const noChangelogLabel = this.readNoChangelogLabel()
    this._properties = new Properties(token, name, noChangelogLabel)
  }

  properties(): Properties {
    return this._properties
  }

  private readGithubToken(): string {
    const token = process.env.GITHUB_TOKEN
    if (!token)
      throw ReferenceError(
        'Github token required, add "env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}"'
      )
    return token
  }

  private readFileName(): string {
    const fileName = core.getInput('fileName')
    if (!fileName) throw ReferenceError('Changelog fileName required"')
    return fileName
  }

  private readNoChangelogLabel(): string {
    const label = core.getInput('noChangelogLabel')
    if (!label) throw ReferenceError('Changelog label required"')
    return label
  }
}
