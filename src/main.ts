import * as core from '@actions/core'
import * as github from '@actions/github'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import {Context} from '@actions/github/lib/context'
import {getOctokit, Conclusion, createStatus} from './octokitProvider'
import {findFile, getCurrentPrLabels, getPr} from './prService'
import {Config, readConfig} from './config'

async function checkChangelogExist(
  octokit: github.GitHub,
  actionContext: Context,
  pr: WebhookPayload,
  config: Config
): Promise<void> {
  const changlelogFiles = await findFile(
    octokit,
    actionContext,
    pr.number,
    config
  )
  if (!changlelogFiles) {
    createStatus(octokit, pr, Conclusion.FAILURE)
    core.setFailed(`${config.fileName} must be updated`)
  }
}

async function checkChangelog(config: Config): Promise<void> {
  const actionContext = github.context

  const octokit = getOctokit(config)
  const labels = await getCurrentPrLabels(actionContext)
  if (labels.includes(config.noChangelogLabel)) {
    core.info(`Ignore chagelog by label ${config.noChangelogLabel}`)
  } else {
    const pr = getPr(actionContext)
    checkChangelogExist(octokit, actionContext, pr, config)
  }
}

async function run(): Promise<void> {
  try {
    const config = readConfig()
    await checkChangelog(config)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
