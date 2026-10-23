import gm from '../gm.ts'

const response = await gm.prepareCheckout({
	type: 'card',
	wallet: '111111******2222',
	amount: 200.5,
	currency: 'RUB',
	userCurrency: 'USD',
})

console.log(response)
