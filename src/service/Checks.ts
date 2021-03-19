import {Status} from '../domain/Status'
import {CheckNotification, Properties} from '../domain/Properties'
import {GitHub} from '@actions/github/lib/utils'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import * as core from '@actions/core'
import {
  ChecksCreateParams,
  ChecksCreateParamsOutput
} from '../domain/OctokitTypes'
import {Context} from '@actions/github/lib/context'

export class Checks {
  constructor(
    private _github: InstanceType<typeof GitHub>,
    private _properties: Properties,
    private _context: Context
  ) {}

  async createStatus(
    pullRequest: WebhookPayload,
    status: Status
  ): Promise<void> {
    switch (this._properties.checkNotification) {
      case CheckNotification.Detailed:
        this.detailedCheck(pullRequest, status)
        break
      case CheckNotification.Simple:
        this.simpleCheck(status)
        break
    }
  }

  private async detailedCheck(
    pullRequest: WebhookPayload,
    status: Status
  ): Promise<void> {
    const {owner, repo} = this._context.repo
    const headSha = pullRequest.head.sha

    const output = this.getDetailedOutput(status)
    const conclusion = this.getConclusion(status)

    const params: ChecksCreateParams = {
      owner,
      repo,
      conclusion,
      head_sha: headSha,
      name: 'Changelog check',
      output
    }
    try {
      const check = await this._github.checks.create(params)
      if (check.status > 299) {
        core.error(`Check creation failed with ${check.status}`)
        core.setFailed('Check creation failed')
      }
    } catch (err) {
      if (err && err.status === 403) {
        core.error(`With fork simpleCheck must be used, fallback to it`)
        this.simpleCheck(status)
      } else {
        core.error(`Unmanaged error ${JSON.stringify(err)}`)
        core.setFailed('Check creation failed')
      }
    }
  }

  private simpleCheck(status: Status): void {
    const conclusion = this.getConclusion(status)
    if (Conclusion.FAILURE === conclusion) {
      core.info(`${this._properties.fileName} must be updated`)
      core.setFailed(`${this._properties.fileName} must be updated`)
    }
  }

  private getDetailedOutput(status: Status): ChecksCreateParamsOutput {
    if (Status.NO_CHANGELOG_UPDATE === status) {
      return {
        title: `${this._properties.fileName} must be updated`,
        summary: 'the summary'
      }
    } else if (Status.SKIP_BY_LABEL) {
      return {
        title: `Ignore chagelog by label ${this._properties.noChangelogLabel}`,
        summary: 'the summary'
      }
    }
  }

  private getConclusion(status: Status): Conclusion {
    if (Status.OK === status) {
      return Conclusion.SUCCESS
    } else if (Status.SKIP_BY_LABEL === status) {
      return Conclusion.NEUTRAL
    }
    return Conclusion.FAILURE
  }
}

export enum Conclusion {
  SUCCESS = 'success',
  FAILURE = 'failure',
  NEUTRAL = 'neutral',
  CANCELLED = 'cancelled',
  TIMED_OUT = 'timed_out',
  ACTION_REQUIRED = 'action_required'
}
