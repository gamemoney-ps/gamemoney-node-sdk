import gm from '../gm.ts'

const response = await gm.getBalanceStatistics({
	currency: 'RUB',
})

console.log(response)
