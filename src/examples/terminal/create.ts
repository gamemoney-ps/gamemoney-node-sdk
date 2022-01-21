/* eslint-disable @typescript-eslint/naming-convention */
import { v4 as uuidv4 } from 'uuid'
import gm from '../gm.js'

const projectInvoiceId = uuidv4()

const response = await gm.createTerminal({
	user: '1',
	amount: 200.5,
	type: 'qiwi',
	wallet: '79123456789',
	project_invoice: projectInvoiceId,
	ip: '72.14.192.0',
	add_some_field: 'some value',
})

console.log({ projectInvoiceId, response })
