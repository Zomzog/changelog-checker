import type {PullsListFilesResponseData} from '@octokit/types'
import {RestEndpointMethodTypes} from '@octokit/plugin-rest-endpoint-methods'

export type PullsListFilesResponseDataElement = PullsListFilesResponseData[0]

export type ChecksCreateParams = RestEndpointMethodTypes['checks']['create']['parameters'] // prettier-ignore
export type ChecksCreateParamsOutput = RestEndpointMethodTypes['checks']['create']['parameters']['output'] // prettier-ignore
