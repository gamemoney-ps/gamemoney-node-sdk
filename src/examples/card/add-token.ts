import gm from '../gm.js'

(async () => {
	const response = await gm.addTokenCard({
		user: '1',
	})

	console.log(response)
})()
