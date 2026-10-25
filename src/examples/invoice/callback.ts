import express from 'express'
import bodyParser from 'body-parser'
import gm from '../gm.ts'
import type { InvoiceNotification } from '../../index.ts'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/webhooks/handle_invoices', (request, response) => {
	const notification = request.body as InvoiceNotification
	console.log(notification)

	if (!gm.verifyRsaSignature(notification)) {
		response.send({ success: 'error', error: 'signature mismatch' })
		return
	}

	response.send({ success: 'true' })
})

app.listen(3000)
