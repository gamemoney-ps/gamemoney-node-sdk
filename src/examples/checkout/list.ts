import gm from '../gm.js'

const response = await gm.getCheckoutList({
	start: '2022-01-01 00:00:00',
	finish: '2022-02-01 00:00:00',
})

console.log(response)
