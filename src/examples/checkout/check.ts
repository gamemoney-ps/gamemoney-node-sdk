import { randomUUID } from 'node:crypto'
import gm from '../gm.ts'

const response = await gm.checkCheckout({
	projectId: randomUUID(),
	user: '1',
	ip: '72.14.192.0',
	amount: 200.5,
	wallet: '111111******2222',
	type: 'card',
	description: 'Payout for user account 250115125',
})

console.log(response)
