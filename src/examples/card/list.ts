import gm from '../gm.js'

(async () => {
	const response = await gm.getCardList({
		user: '1',
	})

	console.log(response)
})()
