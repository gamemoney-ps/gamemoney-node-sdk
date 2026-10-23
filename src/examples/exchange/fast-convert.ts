import { randomUUID } from 'node:crypto'
import gm from '../gm.ts'

const projectExchangeId = randomUUID()

const response = await gm.fastConvertExchange({
	externalId: projectExchangeId,
	amount: 1000,
	from: 'RUB',
	to: 'USD',
})

console.log({ projectExchangeId, response })
