import {getOctokit as pony} from '@actions/github'
import {Properties} from '../domain/Properties'
import {GitHub} from '@actions/github/lib/utils'

export function getOctokit(
  properties: Properties
): InstanceType<typeof GitHub> {
  return pony(properties.githubToken)
}
