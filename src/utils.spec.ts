/* tslint:disable max-line-length */

import 'mocha'
import { expect } from 'chai'
import { paramsToString, verifyRsaSignature } from './utils'

const testData = {
	time: 1541624157,
	rand: '95c1d52957a36e302963',
	project: 42,
	currency: 'rub',
	days_balance: [],
	state: 'success',
	signature: 'Czotz0NBkyND2EJlixYtGJy37E0HXmHNYqAjieCGfMbUQkNdF/pZtIvSdHecMgyXX4lyopzkj3R/GtVgTepQisLWedpMkSAiN6rcBMGs0TTE0dm/avDyuSb4/HO6iChUoC3es2IYKq5HzQD48G6VkCPdt+HLOYRnme3/vI0tIl6iQ3aXWYzF50NRJCxz6/zBn/FvMafFdb1n7hzrlaFj7Iqh/hk9XcOCZivWrIXvtPcwSSpfAPfM14uQ9zofewOCNojNRnwK0oEJXavATWFQSS7jq7HQBcKdsqlPwFCdMDh0dJtoM41WkebsJUuSWP56VuO6J55n+DbvLO0y7xe2Mg=='
}

describe('paramsToString', () => {
	it('should convert object to params string', () => {
		const result = paramsToString(testData)
		const expectedResult = 'currency:rub;days_balance:;project:42;rand:95c1d52957a36e302963;state:success;time:1541624157;'

		expect(result).to.equal(expectedResult)
	})
})

describe('RSA', () => {
	it('should verify request with RSA', () => {
		const result = verifyRsaSignature(testData)

		expect(result).to.equal(true)
	})
})
