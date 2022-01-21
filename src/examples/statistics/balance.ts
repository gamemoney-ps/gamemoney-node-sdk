import gm from '../gm.js'

const response = await gm.getBalanceStatistics({
	currency: 'RUB',
})

console.log(response)
