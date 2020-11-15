import {getOctokit as pony, context} from '@actions/github'
import {Properties} from '../domain/Properties'
import {GitHub} from '@actions/github/lib/utils'
import {Context} from '@actions/github/lib/context'

export function getOctokit(
  properties: Properties
): InstanceType<typeof GitHub> {
  return pony(properties.githubToken)
}

export function getContext(): Context {
  return context
}