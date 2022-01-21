/* eslint-disable @typescript-eslint/naming-convention */
import { v4 as uuidv4 } from 'uuid'
import gm from '../gm.js'

const projectCheckoutId = uuidv4()

const response = await gm.createCheckout({
	projectId: projectCheckoutId,
	user: '1',
	ip: '72.14.192.0',
	amount: 200.5,
	wallet: '89123456789',
	type: 'qiwi',
	description: 'Payout for user account 250115125',
	add_some_field: 'some value',
})

console.log({ projectCheckoutId, response })
