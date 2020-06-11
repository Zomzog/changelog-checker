import * as github from '@actions/github'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import {getOctokit} from './OctokitProvider'
import {Status} from '../domain/Status'
import * as core from '@actions/core'
import {Checks} from './Checks'
import {PrService} from './PrService'
import {Properties} from '../domain/Properties'
import {PropertiesService} from './PropertiesService'

export class ChangelogChecker {
  private _properties: Properties
  private _octokit: github.GitHub
  private _checks: Checks
  private _prService: PrService

  constructor() {
    this._properties = new PropertiesService().properties()
    this._octokit = getOctokit(this._properties)
    this._checks = new Checks(this._octokit, this._properties)
    const actionContext = github.context
    this._prService = new PrService(
      this._octokit,
      this._properties,
      actionContext
    )
  }

  async checkChangelog(): Promise<void> {
    const labels = await this._prService.getCurrentPrLabels()
    const pr = this._prService.getPr()
    if (labels.includes(this._properties.noChangelogLabel)) {
      core.info(
        `Ignore changelog by label ${this._properties.noChangelogLabel}`
      )
      this._checks.createStatus(pr, Status.SKIP_BY_LABEL)
    } else {
      const result = await this.checkChangelogExist(pr)
      this._checks.createStatus(pr, result)
    }
  }

  private async checkChangelogExist(pr: WebhookPayload): Promise<Status> {
    const changlelogFiles = await this._prService.findFile(pr.number)
    if (!changlelogFiles) {
      return Status.NO_CHANGELOG_UPDATE
    }
    return Status.OK
  }
}
