import { randomUUID } from 'node:crypto'
import gm from '../gm.ts'

const projectExchangeId = randomUUID()

const response = await gm.prepareExchange({
	externalId: projectExchangeId,
	minAmount: 1000.5,
	maxAmount: 2000.5,
	from: 'RUB',
	to: 'USD',
	livetime: 60,
})

console.log({ projectExchangeId, response })
