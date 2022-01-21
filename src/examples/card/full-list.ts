import gm from '../gm.js'

const response = await gm.getCardFullList({
	user: '1',
})

console.log(response)
