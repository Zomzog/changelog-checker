import * as github from '@actions/github'
import { Octokit } from '@octokit/rest';
import {Config} from './config'

export function getOctokit(config: Config): github.GitHub {
  return new github.GitHub(config.githubToken)
}

export async function createStatus(octokit: github.GitHub, conclusion: Conclusion) {

  const { owner, repo } = github.context.repo;
  const { title, head } = github.context!.payload!.pull_request!;

  const status: Octokit.ChecksCreateParams = {
    owner,
    repo,
    conclusion,
    head_sha: head.sha,
    name: 'Changelog check',
  };

  octokit.checks.create()
}

export enum Conclusion {
            SUCCESS        =        "success"        ,
            FAILURE        =        "failure"       ,
            NEUTRAL        =        "neutral"       ,
            CANCELLED      =        "cancelled"     ,
            TIMED_OUT      =        "timed_out"     ,
            ACTION_REQUIRED=        "action_required"
}