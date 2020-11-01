import {PR} from '../data.test'
import {GitHub} from '@actions/github/lib/utils'
import {Context} from '@actions/github/lib/context'
import { PrService } from "../../src/service/PrService";
import { createMock } from "ts-auto-mock";
import { Properties } from '../../src/domain/Properties';


describe('PrService', () => {

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
  let octokitMock= createMock<InstanceType<typeof GitHub>>()
  let propertiesMock= createMock<Properties>()

  const service = new PrService(octokitMock, propertiesMock, context)

  it('get current pr', async () => {

    const pr = service.getPr()
    expect(pr).toBe(context.payload.pull_request)
  })

  it('get current labels', async () => {

    const prNumber = await service.getCurrentPrLabels()
    expect(prNumber).toEqual(
      expect.arrayContaining(['good first issue', 'no changelog'])
    )
  })
})
