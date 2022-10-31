import * as core from '@actions/core'
import {ChangelogChecker} from './service/ChangelogChecker'

async function run(): Promise<void> {
  try {
    core.debug('Init ChangelogChecker')
    const service = new ChangelogChecker()
    await service.checkChangelog()
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('Unexpected error') // TODO print error
    }
  }
}

run()
