import * as github from '@actions/github'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import {Octokit} from '@octokit/rest'
import {Config} from './config'
import * as core from '@actions/core'

export function getOctokit(config: Config): github.GitHub {
  return new github.GitHub(config.githubToken)
}

export async function createStatus(
  octokit: github.GitHub,
  pullRequest: WebhookPayload,
  conclusion: Conclusion
): Promise<void> {
  const {owner, repo} = github.context.repo
  const headSha = pullRequest.head.sha

  const status: Octokit.ChecksCreateParams = {
    owner,
    repo,
    conclusion,
    head_sha: headSha, // eslint-disable-line @typescript-eslint/camelcase
    name: 'Changelog check'
  }

  const check = await octokit.checks.create(status)
  core.info(JSON.stringify(check))
}

export enum Conclusion {
  SUCCESS = 'success',
  FAILURE = 'failure',
  NEUTRAL = 'neutral',
  CANCELLED = 'cancelled',
  TIMED_OUT = 'timed_out',
  ACTION_REQUIRED = 'action_required'
}
