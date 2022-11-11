import gm from '../gm.js'

(async () => {
	const response = await gm.convertExchange({
		id: 1_183_988,
		amount: 1000.5,
	})

	console.log(response)
})()
