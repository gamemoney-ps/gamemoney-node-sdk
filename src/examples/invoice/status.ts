/* eslint-disable @typescript-eslint/naming-convention */
import gm from '../gm.js'

// Get invoice status with internal project invoice id
const response1 = await gm.getInvoiceStatus({
	project_invoice: '4c9946d4-161b-4b6b-90c0-9bab0b9d4326',
})

console.log(response1)

// Get invoice status with gamemoney invoice id
const response2 = await gm.getInvoiceStatus({
	invoice: 187_074_133,
})

console.log(response2)
