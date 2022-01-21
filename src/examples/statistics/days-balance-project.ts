import gm from '../gm.js'

const response = await gm.getDaysBalanceStatistics({
	currency: 'RUB',
	start: '2010-01-01',
	finish: '2022-02-01',
})

console.log(response)
