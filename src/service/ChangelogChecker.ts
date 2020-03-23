import {Config, readConfig} from '../config'
import * as github from '@actions/github'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import {Context} from '@actions/github/lib/context'
import {getOctokit} from '../octokitProvider'
import {getCurrentPrLabels, getPr, findFile} from '../prService'
import {Status} from '../domain/Status'
import * as core from '@actions/core'
import {Checks} from './Checks'

export class ChangelogChecker {
  private _config: Config
  private _octokit: github.GitHub
  private _checks: Checks

  constructor() {
    this._config = readConfig()
    this._octokit = getOctokit(this._config)
    this._checks = new Checks(this._octokit, this._config)
  }

  async checkChangelog(): Promise<void> {
    const actionContext = github.context

    const labels = await getCurrentPrLabels(actionContext)
    const pr = getPr(actionContext)
    if (labels.includes(this._config.noChangelogLabel)) {
      core.info(`Ignore chagelog by label ${this._config.noChangelogLabel}`)
      this._checks.createStatus(pr, Status.SKIP_BY_LABEL)
    } else {
      const result = await this.checkChangelogExist(
        actionContext,
        pr,
        this._config
      )
      this._checks.createStatus(pr, result)
    }
  }

  private async checkChangelogExist(
    actionContext: Context,
    pr: WebhookPayload,
    config: Config
  ): Promise<Status> {
    const changlelogFiles = await findFile(
      this._octokit,
      actionContext,
      pr.number,
      config
    )
    if (!changlelogFiles) {
      return Status.NO_CHANGELOG_UPDATE
    }
    return Status.OK
  }
}
