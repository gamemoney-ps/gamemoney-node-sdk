import express from 'express'
import bodyParser from 'body-parser'
import gm from '../gm.ts'
import type { TransferNotification } from '../../index.ts'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/webhooks/handle_transfers', async (request, response) => {
	const notification = request.body as TransferNotification
	console.log(notification)

	if (!gm.verifyRsaSignature(notification)) {
		const error = { state: 'error', error: 'signature mismatch' }
		response.send({ ...error, signature: gm.generateHmacSignature(error) })
		return
	}

	const { invoice } = await gm.createInvoice({
		type: notification.type,
		amount: notification.amount,
		currency: notification.currency,
		user: notification.user,
		ip: notification.ip,
		wallet: '',
		comment: notification.comment,
	})

	const success = { state: 'success', invoice }
	response.send({ ...success, signature: gm.generateHmacSignature(success) })
})

app.listen(3000)
