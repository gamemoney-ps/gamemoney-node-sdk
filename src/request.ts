import request from 'request-promise-native'
import {
	generateHmacSignature,
	generateRsaSignature,
	verifyRsaSignature,
	IRsaPrivateKey,
	getRandomString
} from './utils'

export type TSignType = 'hmac' | 'rsa'

export default class GameMoneyRequest {
	private static readonly uri: string = 'https://paygate.gamemoney.com'
	private request: any
	private hmacKey: string
	private privateKey: IRsaPrivateKey

	constructor(hmacKey: string, privateKey: IRsaPrivateKey) {
		this.hmacKey = hmacKey
		this.privateKey = privateKey

		this.request = request.defaults({
			baseUrl: GameMoneyRequest.uri,
			json: true
		})
	}

	public async send(url: string, body: any, signType: TSignType = 'hmac') {
		if (!body.rand) {
			body.rand = getRandomString(20)
		}

		const signature = signType === 'hmac'
			? generateHmacSignature(body, this.hmacKey)
			: generateRsaSignature(body, this.privateKey)

		const response = await this.request.post({
			url,
			form: {
				...body,
				signature
			}
		})

		// if (!verifyRsaSignature(response)) {
		// 	throw new Error('Response signature mismatch')
		// }

		if (body.rand && body.rand !== response.rand) {
			throw new Error(`Wrong rand parameter: ${response.rand}`)
		}

		if (response.success === false || response.state === 'error') {
			throw new Error(response.error)
		}

		return response
	}
}
