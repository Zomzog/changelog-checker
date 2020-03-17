import { PR } from "./data";
import { getCurrentPrNumber, getCurrentPrLabels } from "../src/prService";
import {Context} from '@actions/github/lib/context'

test('get current pr number', async () => {
  const context = new Context() 
  context.payload = 
  {
    pull_request: {
      number: 7
    }
  }

  const prNumber = getCurrentPrNumber(context)
  expect(prNumber).toBe(7)
})

test('get current labels', async () => {
  const context = new Context() 
  context.payload = 
  {
    pull_request: PR
  }

  const prNumber = getCurrentPrLabels(context)
  //expect(prNumber).toBe(['label1', 'label_2'])
})