import {PR} from './data.test'
import {getPr, getCurrentPrLabels} from '../src/prService'
import {Context} from '@actions/github/lib/context'

test('get current pr', async () => {
  const context = new Context()
  context.payload = {
    pull_request: {
      number: 7
    }
  }

  const pr = getPr(context)
  expect(pr).toBe(context.payload.pull_request)
})

test('get current labels', async () => {
  const context = new Context()
  context.payload = {
    pull_request: {
      number: 7,
      labels: [
        {
          name: 'good first issue'
        },
        {
          name: 'no changelog'
        }
      ]
    }
  }

  const prNumber = await getCurrentPrLabels(context)
  expect(prNumber).toEqual(
    expect.arrayContaining(['good first issue', 'no changelog'])
  )
})
