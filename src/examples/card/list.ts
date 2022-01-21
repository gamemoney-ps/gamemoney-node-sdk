import gm from '../gm.js'

const response = await gm.getCardList({
	user: '1',
})

console.log(response)
