import * as core from '@actions/core'
import {ChangelogChecker} from './service/ChangelogChecker'

async function run(): Promise<void> {
  try {
    const service = new ChangelogChecker()
    await service.checkChangelog()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
