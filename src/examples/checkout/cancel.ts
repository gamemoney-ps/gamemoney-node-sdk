import gm from '../gm.js'

(async () => {
	const response = await gm.cancelCheckout({
		projectId: '7369a323-c090-492d-a700-a75bf7323f72',
	})

	console.log(response)
})()
