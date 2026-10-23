import { randomUUID } from 'node:crypto'
import gm from '../gm.ts'

const projectInvoiceId = randomUUID()

const response = await gm.createInvoice({
	user: '1',
	amount: 200.5,
	type: 'sbp',
	wallet: '',
	project_invoice: projectInvoiceId,
	ip: '72.14.192.0',
	add_some_field: 'some value',
})

console.log({ projectInvoiceId, response })
