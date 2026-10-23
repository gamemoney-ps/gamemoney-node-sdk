import gm from '../gm.ts'

const response = await gm.getCardList({
	user: '1',
})

console.log(response)
