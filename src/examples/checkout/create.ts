/* eslint-disable @typescript-eslint/naming-convention */
import { v4 as uuidv4 } from 'uuid'
import gm from '../gm.js'
import { GameMoneyError } from '../../index.js'

(async () => {
	const projectCheckoutId = uuidv4()
	try {
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
	} catch (error: unknown) {
		if (error instanceof GameMoneyError) {
			console.log('Error from GameMoney API:', error.message)
		} else {
			console.log('another error:', error)
		}
	}
})()
