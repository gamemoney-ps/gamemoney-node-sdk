import gm from '../gm.js'

(async () => {
	const response = await gm.getCardFullList({
		user: '1',
	})

	console.log(response)
})()
