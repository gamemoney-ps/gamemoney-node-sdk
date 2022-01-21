import gm from '../gm.js'

// Get exchange status with internal project exchange id
const response1 = await gm.getExchangeStatus({
	externalId: '497ea9ff-00da-4484-a5a0-3059a2565e51',
})

console.log(response1)

// Get exchange status with gamemoney exchange id
const response2 = await gm.getExchangeStatus({
	id: 1_183_988,
})

console.log(response2)
