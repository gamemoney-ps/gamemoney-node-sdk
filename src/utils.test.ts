import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { describe, it } from 'node:test'
import {
	compactForm,
	generateHmacSignature,
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

	it('should skip undefined values', () => {
		assert.equal(
			parametersToString({ a: 1, b: undefined, c: { d: undefined, e: 'f' } }),
			'a:1;c:e:f;;',
		)
	})

	it('should sort integer keys as numbers', () => {
		assert.equal(
			parametersToString({ map: { 10: 'k', 2: 'c', a: 'x', 1: 'b' } }),
			'map:1:b;2:c;10:k;a:x;;',
		)
	})
})

describe('generateHmacSignature', () => {
	it('should produce the signatures of the official PHP SDK', () => {
		const vectors = [
			[
				{ data: '' },
				'3ca52b7c42a68551dc423d7777b5a906b96c3e2b4c1210c68c2de115b26e7164',
			],
			[
				{ c: { test: 1 }, a: { b: 2, a: 1 } },
				'1be1385d9c48c54a7fe4dfb390bd2aecdb4a46bf50dc79cd47d7bba5231aacf1',
			],
			[
				{ data: { test: 1 } },
				'f85babd083b7436d63540ca7229ad7257518c148cae52d3d7143d86c215d1b60',
			],
			[{}, '47799e9c47c18c6172f56309844d010cf204484b4a9a4e62e35384cad504b1e4'],
		] as const

		for (const [data, signature] of vectors) {
			assert.equal(generateHmacSignature(data, 'hmac_key'), signature)
		}
	})
})

describe('compactForm', () => {
	it('should drop undefined values and empty arrays and objects', () => {
		assert.deepEqual(
			compactForm({
				a: undefined,
				b: [],
				c: {},
				d: { e: [], f: undefined },
				g: [[], 'x'],
				h: null,
				i: 0,
				j: '',
				k: false,
			}),
			{ g: { 1: 'x' }, h: null, i: 0, j: '', k: false },
		)
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
