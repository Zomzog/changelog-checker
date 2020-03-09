import * as core from '@actions/core'
import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'
import {getOctokit} from './octokitProvider'
import {findFile, getCurrentPrNumber} from './prService'
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
    core.setFailed(`Missing changelog ${config.fileName}`)
  }
}

async function checkChangelog(config: Config): Promise<void> {
  const actionContext = github.context

  const octokit = getOctokit(config)
  const prNumber = getCurrentPrNumber(actionContext)
  if (!prNumber) {
    core.info('Not a PR')
  } else {
    checkChangelogExist(octokit, actionContext, prNumber, config)
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
