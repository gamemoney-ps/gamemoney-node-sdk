import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { describe, it } from 'node:test'
import {
	generateRsaSignature,
	parametersToString,
	stringifyForm,
	verifyRsaSignature,
} from './utils.ts'

const testData = {
	time: 1_541_624_157,
	rand: '95c1d52957a36e302963',
	project: 42,
	currency: 'rub',
	days_balance: [],
	state: 'success',
	signature:
		'Czotz0NBkyND2EJlixYtGJy37E0HXmHNYqAjieCGfMbUQkNdF/pZtIvSdHecMgyXX4lyopzkj3R/GtVgTepQisLWedpMkSAiN6rcBMGs0TTE0dm/avDyuSb4/HO6iChUoC3es2IYKq5HzQD48G6VkCPdt+HLOYRnme3/vI0tIl6iQ3aXWYzF50NRJCxz6/zBn/FvMafFdb1n7hzrlaFj7Iqh/hk9XcOCZivWrIXvtPcwSSpfAPfM14uQ9zofewOCNojNRnwK0oEJXavATWFQSS7jq7HQBcKdsqlPwFCdMDh0dJtoM41WkebsJUuSWP56VuO6J55n+DbvLO0y7xe2Mg==',
}

describe('parametersToString', () => {
	it('should convert object to params string', () => {
		const result = parametersToString(testData)
		const expectedResult =
			'currency:rub;days_balance:;project:42;rand:95c1d52957a36e302963;state:success;time:1541624157;'

		assert.equal(result, expectedResult)
	})
})

describe('RSA', () => {
	it('should verify request with RSA', () => {
		const result = verifyRsaSignature(testData)

		assert.equal(result, true)
	})

	it('should verify request with the given public key', () => {
		const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
			modulusLength: 2048,
		})
		const body = { project: 42, rand: 'abc', state: 'success', signature: '' }
		body.signature = generateRsaSignature(body, privateKey)

		assert.equal(verifyRsaSignature(body, publicKey), true)
		assert.equal(verifyRsaSignature(body), false)
	})
})

describe('stringifyForm', () => {
	it('should encode values the same way as gamemoney@3.1.0', () => {
		const result = stringifyForm({
			list: ['x', 'y'],
			object: { key: 1 },
			nullValue: null,
			undefinedValue: undefined,
			text: "!'()*~ +",
		})

		assert.equal(
			result,
			'list%5B0%5D=x&list%5B1%5D=y&object%5Bkey%5D=1&nullValue=&text=%21%27%28%29%2A~%20%2B',
		)
	})
})
