import { Buffer } from 'node:buffer'
import process from 'node:process'
import GameMoney from '../index.js'

export default new GameMoney({
	// Optional. But to make checkouts must be specified
	rsaPrivateKey: Buffer.from(
		process.env.GAMEMONEY_RSA_PRIVATE_KEY ?? '',
		'base64',
	),

	// To create a request signature
	hmacPrivateKey: process.env.GAMEMONEY_HMAC_PRIVATE_KEY ?? '',
	project: Number(process.env.GAMEMONEY_PROJECT_ID),
})
