import gm from '../gm.ts'

const response = await gm.getCardSessionStatus({
	invoice: '1',
})

console.log(response)
