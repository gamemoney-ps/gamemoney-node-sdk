import { randomUUID } from 'node:crypto'
import gm from '../gm.ts'
import { GameMoneyError } from '../../index.ts'

const projectCheckoutId = randomUUID()

try {
	const response = await gm.createCheckout({
		projectId: projectCheckoutId,
		user: '1',
		ip: '72.14.192.0',
		amount: 200.5,
		wallet: '111111******2222',
		type: 'card',
		description: 'Payout for user account 250115125',
		add_some_field: 'some value',
	})

	console.log({ projectCheckoutId, response })
} catch (error: unknown) {
	if (error instanceof GameMoneyError) {
		console.log('Error from GameMoney API:', error.message)
	} else {
		console.log('another error:', error)
	}
}
