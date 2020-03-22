import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'
import {Octokit} from '@octokit/rest'
import {Config} from './config'
import {WebhookPayload} from '@actions/github/lib/interfaces'

export async function findFile(
  octokit: github.GitHub,
  actionContext: Context,
  prNumber: number,
  config: Config
): Promise<Octokit.PullsListFilesResponseItem | undefined> {
  const regex = new RegExp(config.fileName)
  const files = await octokit.pulls.listFiles({
    ...actionContext.repo,
    pull_number: prNumber // eslint-disable-line @typescript-eslint/camelcase
  })
  return files.data.find(value => regex.test(value.filename))
}

export async function getCurrentPrLabels(
  actionContext: Context
): Promise<string[]> {
  const pr = getPr(actionContext)
  return Promise.all(pr.labels.map(async (it: any) => it.name)) // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function getPr(actionContext: Context): WebhookPayload {
  const pr = actionContext.payload.pull_request
  if (pr) {
    return pr
  } else {
    throw new Error('Not a PR')
  }
}
