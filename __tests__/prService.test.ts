import {PR} from './data.test'
import {getCurrentPrNumber, getCurrentPrLabels} from '../src/prService'
import {Context} from '@actions/github/lib/context'

test('get current pr number', async () => {
  const context = new Context()
  context.payload = {
    pull_request: {
      number: 7
    }
  }

  const prNumber = getCurrentPrNumber(context)
  expect(prNumber).toBe(7)
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
