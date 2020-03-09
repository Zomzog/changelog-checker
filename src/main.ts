import * as core from '@actions/core'
import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'
import {WebhookPayload} from '@actions/github/lib/interfaces'

function githubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token)
    throw ReferenceError('No token defined in the environment variables')
  return token
}

function getPr(actionContext: Context): WebhookPayload {
  const pr = actionContext.payload.pull_request
  if (!pr) throw ReferenceError('Not a PR')
  return pr
}

async function checkChangelogExist(
  octokit: github.GitHub,
  actionContext: Context,
  prNumber: number
): Promise<void> {
  const regex = new RegExp('CHANGELOG.adoc')
  const files = await octokit.pulls.listFiles({
    ...actionContext.repo,
    pull_number: prNumber // eslint-disable-line @typescript-eslint/camelcase
  })
  const changlelogFiles = files.data.filter(value => regex.test(value.filename))
  if (changlelogFiles.length === 0) {
    core.setFailed('Missing changelog file')
  }
}

async function checkChangelog(): Promise<void> {
  const actionContext = github.context
  const octokit = new github.GitHub(githubToken())
  const pr = getPr(actionContext)
  checkChangelogExist(octokit, actionContext, pr.number)
}

async function run(): Promise<void> {
  try {
    await checkChangelog()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
