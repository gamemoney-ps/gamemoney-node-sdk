import gm from '../gm.js'

(async () => {
	const response = await gm.addCard({
		user: '1',
		redirect: 'https://project/return',
	})

	console.log(response)
})()
