import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import http from 'node:http'
import type { AddressInfo } from 'node:net'
import { after, before, describe, it } from 'node:test'
import { generateRsaSignature } from './utils.ts'
import { GameMoney, type CreateCheckoutRequest } from './index.ts'

type Form = { [key: string]: string | Form }

type Reply = (form: Form) => {
	status?: number
	delay?: number
	headers?: Record<string, string>
	body: Record<string, unknown> | string
}

const gmKeys = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
const merchantKeys = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
const hmacKey = 'hmac-secret'
const requests: Array<{
	url: string | undefined
	headers: http.IncomingHttpHeaders
	body: string
}> = []

function parsePhpForm(body: string): Form {
	const form: Form = {}

	for (const [name, value] of new URLSearchParams(body)) {
		const path = name.replaceAll(']', '').split('[')
		let target = form

		for (const key of path.slice(0, -1)) {
			target = (target[key] ??= {}) as Form
		}

		target[path.at(-1)!] = value
	}

	return form
}

// GameMoney signs values sorted with PHP ksort: integer keys as numbers, the rest as strings
function phpArrayToString(form: Form): string {
	const isInteger = (key: string) => /^(?:0|-?[1-9]\d*)$/.test(key)

	return Object.keys(form)
		.sort((a, b) =>
			isInteger(a) && isInteger(b)
				? Number(a) - Number(b)
				: a < b
					? -1
					: Number(a > b),
		)
		.map((key) => {
			const value = form[key]!
			return `${key}:${typeof value === 'string' ? value : phpArrayToString(value)};`
		})
		.join('')
}

function hasValidSignature(url: string | undefined, form: Form) {
	const { signature, ...fields } = form

	if (typeof signature !== 'string') {
		return false
	}

	const text = phpArrayToString(fields)

	if (
		url !== undefined &&
		(url.endsWith('/checkout/insert') || url.endsWith('/checkout/check'))
	) {
		return crypto.verify(
			'sha256',
			Buffer.from(text),
			merchantKeys.publicKey,
			Buffer.from(signature, 'base64'),
		)
	}

	return (
		signature ===
		crypto.createHmac('sha256', hmacKey).update(text).digest('hex')
	)
}

function signed(payload: Record<string, any>) {
	return {
		...payload,
		signature: generateRsaSignature(payload, gmKeys.privateKey),
	}
}

const success: Reply = (form) => ({
	body: signed({ state: 'success', time: 1, rand: form.rand }),
})

let reply = success

const server = http.createServer((request, response) => {
	let body = ''
	request.setEncoding('utf8')
	request.on('data', (chunk: string) => {
		body += chunk
	})
	request.on('end', () => {
		requests.push({ url: request.url, headers: request.headers, body })
		const form = parsePhpForm(body)
		const {
			status = 200,
			delay = 0,
			headers = {},
			body: payload,
		} = hasValidSignature(request.url, form)
			? reply(form)
			: {
					body: signed({
						state: 'error',
						error: 'signature mismatch',
						time: 1,
						rand: form.rand,
					}),
				}
		setTimeout(() => {
			response.writeHead(status, {
				'content-type': 'application/json',
				...headers,
			})
			response.end(
				typeof payload === 'string' ? payload : JSON.stringify(payload),
			)
		}, delay)
	})
})

let apiUrl: string
let gm: GameMoney

function client(options: Partial<ConstructorParameters<typeof GameMoney>[0]>) {
	return new GameMoney({
		project: 42,
		hmacPrivateKey: hmacKey,
		rsaPrivateKey: merchantKeys.privateKey,
		apiUrl,
		gameMoneyPublicKey: gmKeys.publicKey,
		...options,
	})
}

function sentFields() {
	return requests.at(-1)!.body.split('&signature=')[0]
}

before(async () => {
	await new Promise<void>((resolve) => {
		server.listen(0, '127.0.0.1', resolve)
	})
	const { port } = server.address() as AddressInfo
	apiUrl = `http://127.0.0.1:${port}`
	gm = client({})
})

after(() => {
	server.closeAllConnections()
	server.close()
})

describe('request format', () => {
	it('should send the same form as gamemoney@3.1.0', async () => {
		reply = success
		await gm.createInvoice({
			user: '1',
			amount: 200.5,
			type: 'qiwi',
			wallet: '79123456789',
			project_invoice: 'inv-1',
			ip: '72.14.192.0',
			comment:
				"Тест «кириллица» & spaces + symbols !'()*~ = ; : / ? # [ ] @ $ , % emoji 😀",
			add_some_field: 'some value',
			rand: 'fixedrand00000000001',
		})

		const request = requests.at(-1)!
		assert.equal(request.url, '/invoice/')
		assert.equal(
			request.headers['content-type'],
			'application/x-www-form-urlencoded',
		)
		assert.equal(
			request.body,
			'user=1&amount=200.5&type=qiwi&wallet=79123456789&project_invoice=inv-1&ip=72.14.192.0&comment=%D0%A2%D0%B5%D1%81%D1%82%20%C2%AB%D0%BA%D0%B8%D1%80%D0%B8%D0%BB%D0%BB%D0%B8%D1%86%D0%B0%C2%BB%20%26%20spaces%20%2B%20symbols%20%21%27%28%29%2A~%20%3D%20%3B%20%3A%20%2F%20%3F%20%23%20%5B%20%5D%20%40%20%24%20%2C%20%25%20emoji%20%F0%9F%98%80&add_some_field=some%20value&rand=fixedrand00000000001&project=42&signature=11c0c78a2dd8e2033a1f2768f1f1e85ac71f2410eddb5c3b2d63cb4932076447',
		)
	})

	it('should encode arrays and nested objects the same way as gamemoney@3.1.0', async () => {
		reply = success
		await gm.request('invoice/', {
			user: '1',
			terminal_allow_methods: ['sbp', 'card'],
			nested: { b: 2, a: [1, { c: 'x y' }] },
			nul: null,
			bool: true,
			boolf: false,
			neg: -1.5,
			big: 1e21,
			zero: 0,
			empty: '',
			rand: 'fixedrand00000000008',
		})

		assert.equal(
			sentFields(),
			'user=1&terminal_allow_methods%5B0%5D=sbp&terminal_allow_methods%5B1%5D=card&nested%5Bb%5D=2&nested%5Ba%5D%5B0%5D=1&nested%5Ba%5D%5B1%5D%5Bc%5D=x%20y&nul=&bool=true&boolf=false&neg=-1.5&big=1e%2B21&zero=0&empty=&rand=fixedrand00000000008&project=42',
		)
	})

	it('should sign only the fields that are sent', async () => {
		reply = success
		await gm.request('invoice/', {
			user: '1',
			comment: undefined,
			terminal_disable_methods: [],
			meta: { empty: {}, none: undefined },
			list: [[], 'a'],
			rand: 'fixedrand00000000009',
		})

		assert.equal(
			sentFields(),
			'user=1&list%5B1%5D=a&rand=fixedrand00000000009&project=42',
		)
	})

	it('should sign integer keys in numeric order', async () => {
		reply = success
		const map = Object.fromEntries(
			Array.from({ length: 11 }, (_, index) => [String(index), `v${index}`]),
		)

		await gm.request('invoice/', { user: '1', add_map: map })
	})

	it('should send signed exchange/rate request', async () => {
		reply = success
		await gm.getExchangeRate({
			from: 'USD',
			to: 'RUB',
			rand: 'fixedrand00000000007',
		})

		const request = requests.at(-1)!
		assert.equal(request.url, '/exchange/rate')
		assert.equal(
			request.body,
			'from=USD&to=RUB&rand=fixedrand00000000007&project=42&signature=f91a5a92ca35c704a16ff4dc56a1ab79215b7cb30ba488c7daff6dfca4bd79a7',
		)
	})

	it('should sign payouts with RSA private key', async () => {
		reply = success
		const checkout: CreateCheckoutRequest = {
			projectId: 'co-1',
			user: '1',
			ip: '72.14.192.0',
			amount: 200.5,
			wallet: '111111******2222',
			type: 'card',
			description: 'Payout for user account 250115125',
		}

		await gm.createCheckout(checkout)
		assert.equal(requests.at(-1)!.url, '/checkout/insert')
		await gm.checkCheckout(checkout)
		assert.equal(requests.at(-1)!.url, '/checkout/check')
	})

	it('should sign card payment token and payout preparation with HMAC', async () => {
		reply = success
		await gm.addTokenInvoice({ user: '1' })
		assert.equal(requests.at(-1)!.url, '/invoice/addtoken')

		await gm.prepareCheckout({
			type: 'card',
			wallet: '111111******2222',
			amount: 10,
		})
		assert.equal(requests.at(-1)!.url, '/checkout/prepare')
	})

	it('should be rejected with a wrong key', async () => {
		reply = success

		await assert.rejects(
			client({ hmacPrivateKey: 'wrong' }).getBalanceStatistics({
				currency: 'RUB',
			}),
			{ name: 'GameMoneyError', message: 'signature mismatch' },
		)
	})

	it('should keep the path of apiUrl', async () => {
		reply = success
		const proxied = client({ apiUrl: `${apiUrl}/gm` })

		await proxied.getBalanceStatistics({ currency: 'RUB' })
		assert.equal(requests.at(-1)!.url, '/gm/statistics/balance')
		await proxied.request('/exchange/rate', { from: 'USD', to: 'RUB' })
		assert.equal(requests.at(-1)!.url, '/gm/exchange/rate')
	})
})

describe('response handling', () => {
	it('should return verified response', async () => {
		reply = (form) => ({
			body: signed({
				state: 'success',
				time: 1,
				rand: form.rand,
				buy: 90.1,
				sell: 95.2,
			}),
		})
		const response = await gm.getExchangeRate({ from: 'USD', to: 'RUB' })

		assert.equal(response.buy, 90.1)
		assert.equal(response.sell, 95.2)
	})

	it('should throw GameMoneyError for error state', async () => {
		reply = (form) => ({
			body: signed({
				state: 'error',
				time: 1,
				rand: form.rand,
				error: 'Wrong signature',
			}),
		})

		await assert.rejects(gm.getBalanceStatistics({ currency: 'RUB' }), {
			name: 'GameMoneyError',
			message: 'Wrong signature',
		})
	})

	it('should reject response with wrong signature', async () => {
		reply = (form) => ({
			body: {
				...signed({ state: 'success', time: 1, rand: form.rand }),
				time: 2,
			},
		})

		await assert.rejects(gm.getBalanceStatistics({ currency: 'RUB' }), {
			message: 'Response signature mismatch',
		})
	})

	it('should reject response with another rand', async () => {
		reply = () => ({
			body: signed({ state: 'success', time: 1, rand: 'another' }),
		})

		await assert.rejects(gm.getBalanceStatistics({ currency: 'RUB' }), {
			message: 'Wrong rand parameter: another',
		})
	})

	it('should reject non-2xx response', async () => {
		reply = (form) => ({
			status: 500,
			body: signed({
				state: 'error',
				time: 1,
				rand: form.rand,
				error: 'Internal',
			}),
		})

		await assert.rejects(gm.getBalanceStatistics({ currency: 'RUB' }), {
			name: 'GameMoneyHttpError',
			status: 500,
			message: 'Response code 500 (Internal Server Error)',
		})
	})

	it('should not follow redirects', async () => {
		const location = `${apiUrl.replace('127.0.0.1', 'localhost')}/redirected`

		for (const status of [301, 302, 303, 307, 308]) {
			reply = () => ({ status, headers: { location }, body: {} })
			const sent = requests.length

			await assert.rejects(
				gm.createCheckout({
					projectId: 'co-2',
					user: '1',
					ip: '72.14.192.0',
					amount: 10,
					wallet: '79123456789',
					type: 'sbp',
					description: 'Payout',
				}),
				{ name: 'GameMoneyHttpError', status },
			)
			assert.equal(requests.length, sent + 1)
		}
	})

	it('should reject response that is not JSON', async () => {
		reply = () => ({ body: '<html>maintenance</html>' })

		await assert.rejects(gm.getBalanceStatistics({ currency: 'RUB' }), {
			name: 'SyntaxError',
		})
	})

	it('should reject request on network error', async () => {
		const closed = http.createServer()
		await new Promise<void>((resolve) => {
			closed.listen(0, '127.0.0.1', resolve)
		})
		const { port } = closed.address() as AddressInfo
		await new Promise((resolve) => closed.close(resolve))

		await assert.rejects(
			client({ apiUrl: `http://127.0.0.1:${port}` }).getBalanceStatistics({
				currency: 'RUB',
			}),
			{ name: 'TypeError', message: 'fetch failed' },
		)
	})

	it('should abort request after configured timeout', async () => {
		reply = (form) => ({
			delay: 1000,
			body: signed({ state: 'success', time: 1, rand: form.rand }),
		})

		await assert.rejects(
			client({ timeout: 50 }).getBalanceStatistics({ currency: 'RUB' }),
			{ name: 'TimeoutError' },
		)
	})

	it('should verify notifications with configured public key', () => {
		const notification = signed({ invoice: '1', status: 'Paid' })

		assert.equal(gm.verifyRsaSignature(notification), true)
		assert.equal(
			new GameMoney({ project: 42, hmacPrivateKey: '' }).verifyRsaSignature(
				notification,
			),
			false,
		)
	})

	it('should not verify notifications without signature', () => {
		assert.equal(gm.verifyRsaSignature({ invoice: '1' }), false)
		assert.equal(gm.verifyRsaSignature({ invoice: '1', signature: '' }), false)
		assert.equal(
			gm.verifyRsaSignature({ invoice: '1', signature: ['a', 'b'] }),
			false,
		)
	})

	it('should not verify values that are not objects', () => {
		for (const value of [undefined, null, 'signature', 42, []]) {
			assert.equal(gm.verifyRsaSignature(value), false)
		}
	})
})
