import gm from '../gm.ts'

const response = await gm.deleteCard({
	user: '1',
	pan: '111111******2222',
})

console.log(response)
