import { v4 as uuidv4 } from 'uuid'
import gm from '../gm.js'

const projectExchangeId = uuidv4()

const response = await gm.prepareExchange({
	externalId: projectExchangeId,
	minAmount: 1000.5,
	maxAmount: 2000.5,
	from: 'RUB',
	to: 'USD',
	livetime: 60,
})

console.log({ projectExchangeId, response })
