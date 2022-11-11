import gm from '../gm.js'

(async () => {
	const response = await gm.getPayTypesStatistics()

	console.log(response)
})()
