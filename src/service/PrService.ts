import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'
import {Octokit} from '@octokit/rest'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import {Properties} from '../domain/Properties'

export class PrService {
  constructor(
    private _octokit: github.GitHub,
    private _properties: Properties,
    private _actionContext: Context
  ) {}

  async findFile(
    prNumber: number
  ): Promise<Octokit.PullsListFilesResponseItem | undefined> {
    const regex = new RegExp(this._properties.fileName)
    const files = await this._octokit.pulls.listFiles({
      ...this._actionContext.repo,
      pull_number: prNumber // eslint-disable-line @typescript-eslint/camelcase
    })
    return files.data.find(value => regex.test(value.filename))
  }

  async getCurrentPrLabels(): Promise<string[]> {
    const pr = this.getPr()
    return Promise.all(pr.labels.map(async (it: any) => it.name)) // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  getPr(): WebhookPayload {
    const pr = this._actionContext.payload.pull_request
    if (pr) {
      return pr
    } else {
      throw new Error('Not a PR')
    }
  }
}
