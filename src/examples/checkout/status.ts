import gm from '../gm.js'

const response = await gm.getCheckoutStatus({
	projectId: '7369a323-c090-492d-a700-a75bf7323f72',
})

console.log(response)
