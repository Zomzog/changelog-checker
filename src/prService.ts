import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'
import {Octokit} from '@octokit/rest'
import {Config} from './config'

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

export function getCurrentPrLabels(actionContext: Context): string[] {
  const pr = actionContext.payload.pull_request
  if (pr) {
    return pr.labels.map((it:any) => it.name)
  } else {
    return []
  }
}

export function getCurrentPrNumber(actionContext: Context): number | undefined {
  const pr = actionContext.payload.pull_request
  if (pr) {
    return pr.number
  }
}
