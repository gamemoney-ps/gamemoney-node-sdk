import gm from '../gm.js'

(async () => {
	const response = await gm.getBalanceStatistics({
		currency: 'RUB',
	})

	console.log(response)
})()
