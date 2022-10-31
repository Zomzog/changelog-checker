import {GitHub} from '@actions/github/lib/utils'
import {Context} from '@actions/github/lib/context'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import {Properties} from '../domain/Properties'
import type {PullsListFilesResponseDataElement} from '../domain/OctokitTypes'

export class PrService {
  constructor(
    private _github: InstanceType<typeof GitHub>,
    private _properties: Properties,
    private _actionContext: Context
  ) {}

  async findFile(
    prNumber: number
  ): Promise<PullsListFilesResponseDataElement | undefined> {
    const regex = new RegExp(this._properties.fileName)
    for await (const files of this._github.paginate.iterator(
      this._github.pulls.listFiles,
      {
        ...this._actionContext.repo,
        pull_number: prNumber,
        per_page: 100
      }
    )) {
      if (files.data.find(value => regex.test(value.filename))) {
        return files.data.find(value => regex.test(value.filename))
      }
    }
    return undefined
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
