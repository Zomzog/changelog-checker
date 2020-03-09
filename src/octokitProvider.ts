import * as github from '@actions/github'
import {Config} from './config'

export function getOctokit(config: Config): github.GitHub {
  return new github.GitHub(config.githubToken)
}
