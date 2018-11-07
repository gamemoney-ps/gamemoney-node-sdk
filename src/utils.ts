import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const publicCert = fs.readFileSync(path.join(__dirname, '../certs/gm.crt')).toString()

interface IBody {
	signature: string
}

export interface IRsaPrivateKey {
	key: string,
	passphrase: string
}

export function paramsToString(body: IBody): string {
	let paramsString = ''

	Object.keys(body).sort().forEach((key) => {
		let value = body[key]

		if (key === 'signature') {
			return
		}

		if (value == null) {
			value = ''
		}

		if (typeof value === 'object') {
			value = paramsToString(value)
		}

		paramsString += `${key}:${value};`
	})

	return paramsString
}

export function verifyRsaSignature(body: IBody): boolean {
	const paramsString = paramsToString(body)
	const signature = body.signature

	return crypto
		.createVerify('RSA-SHA256')
		.update(paramsString, 'utf8')
		.verify(publicCert, signature, 'base64')
}

export function generateRsaSignature(body: IBody, privateKey: IRsaPrivateKey): string {
	const paramsString = paramsToString(body)

	return crypto
		.createSign('RSA-SHA256')
		.update(paramsString, 'utf8')
		.sign(privateKey, 'base64')
}

export function generateHmacSignature(body: IBody, key: string): string {
	const paramsString = paramsToString(body)

	return crypto
		.createHmac('sha256', key)
		.update(paramsString, 'utf8')
		.digest('hex')
}

export function getRandomString(length: number): string {
	return crypto
		.randomBytes(Math.ceil(length / 2))
		.toString('hex')
		.slice(0, length)
}
