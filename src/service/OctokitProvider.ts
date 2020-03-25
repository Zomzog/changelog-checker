import * as github from '@actions/github'
import {Properties} from '../domain/Properties'

export function getOctokit(properties: Properties): github.GitHub {
  return new github.GitHub(properties.githubToken)
}
