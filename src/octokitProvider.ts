import * as github from '@actions/github'

function githubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token)
    throw ReferenceError(
      'Github token required, add "env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}"'
    )
  return token
}

export function getOctokit(): github.GitHub {
  return new github.GitHub(githubToken())
}
