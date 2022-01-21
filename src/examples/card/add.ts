import gm from '../gm.js'

const response = await gm.addCard({
	user: '1',
	redirect: 'https://project/return',
})

console.log(response)
