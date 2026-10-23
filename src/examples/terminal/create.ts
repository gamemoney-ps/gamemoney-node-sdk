import { randomUUID } from 'node:crypto'
import gm from '../gm.ts'

const projectInvoiceId = randomUUID()

const response = await gm.createTerminal({
	user: '1',
	amount: 200.5,
	project_invoice: projectInvoiceId,
	terminal_allow_methods: ['sbp', 'card'],
	add_some_field: 'some value',
})

console.log({ projectInvoiceId, response })
