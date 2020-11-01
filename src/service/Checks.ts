import {Status} from '../domain/Status'
import {Properties} from '../domain/Properties'
import {GitHub} from '@actions/github/lib/utils'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import * as core from '@actions/core'
import {
  ChecksCreateParams,
  ChecksCreateParamsOutput
} from '../domain/OctokitTypes'

export class Checks {
  constructor(
    private _github: InstanceType<typeof GitHub>,
    private _properties: Properties
  ) {}

  async createStatus(
    pullRequest: WebhookPayload,
    status: Status
  ): Promise<void> {
    const {owner, repo} = this._github.context.repo
    const headSha = pullRequest.head.sha

    const output = this.getOutput(status)
    const conclusion = this.getConclusion(status)

    const params: ChecksCreateParams = {
      owner,
      repo,
      conclusion,
      head_sha: headSha,
      name: 'Changelog check',
      output
    }

    const check = await this._github.checks.create(params)
    core.info(JSON.stringify(check))
  }

  private getOutput(status: Status): ChecksCreateParamsOutput | undefined {
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
