import * as core from '@actions/core'
import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'
import {getOctokit, Conclusion, createStatus} from './octokitProvider'
import {findFile, getCurrentPrNumber, getCurrentPrLabels} from './prService'
import {Config, readConfig} from './config'

async function checkChangelogExist(
  octokit: github.GitHub,
  actionContext: Context,
  prNumber: number,
  config: Config
): Promise<void> {
  const changlelogFiles = await findFile(
    octokit,
    actionContext,
    prNumber,
    config
  )
  if (!changlelogFiles) {
    createStatus(octokit, Conclusion.FAILURE)
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
    const prNumber = getCurrentPrNumber(actionContext)
    if (prNumber) {
      checkChangelogExist(octokit, actionContext, prNumber, config)
    } else {
      core.info('Not a PR')
    }
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
