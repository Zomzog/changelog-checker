import * as core from '@actions/core'
import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'
import {getOctokit} from './octokitProvider'
import {findFile, getCurrentPrNumber} from './prService'

async function checkChangelogExist(
  octokit: github.GitHub,
  actionContext: Context,
  prNumber: number
): Promise<void> {
  const changlelogFiles = await findFile(octokit, actionContext, prNumber)
  if (!changlelogFiles) {
    core.setFailed('Missing changelog file')
  }
}

async function checkChangelog(): Promise<void> {
  const actionContext = github.context
  const octokit = getOctokit()
  const prNumber = getCurrentPrNumber(actionContext)
  if (!prNumber) {
    core.info('Not a PR')
  } else {
    checkChangelogExist(octokit, actionContext, prNumber)
  }
}

async function run(): Promise<void> {
  try {
    await checkChangelog()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
