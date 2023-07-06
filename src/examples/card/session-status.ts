import gm from '../gm.js'

const response = await gm.getCardSessionStatus({
	invoice: '1',
})

console.log(response)
