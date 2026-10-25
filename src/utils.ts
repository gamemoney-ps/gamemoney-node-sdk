import crypto from 'node:crypto'
import { gameMoneyCertificate } from './certificate.ts'

export type RsaKey = Parameters<crypto.Sign['sign']>[0]
export type RsaPublicKey = Parameters<crypto.Verify['verify']>[0]
export type HmacKey = Parameters<typeof crypto.createHmac>[1]

type JsonPrimitive = number | number[] | string | string[] | undefined | null
type Json = { [key: string]: Json | JsonPrimitive }
type FormValue =
	| string
	| number
	| boolean
	| bigint
	| undefined
	| null
	| FormValue[]
	| { [key: string]: FormValue }

const integerKey = /^(?:0|-?[1-9]\d*)$/

// PHP ksort, used by GameMoney, compares integer keys as numbers and the rest as strings
function compareKeys(a: string, b: string): number {
	if (integerKey.test(a) && integerKey.test(b)) {
		return Number(a) - Number(b)
	}

	return a < b ? -1 : a > b ? 1 : 0
}

export function parametersToString(body: Json): string {
	let parametersString = ''

	for (const key of Object.keys(body).sort(compareKeys)) {
		let value = body[key]

		if (key === 'signature' || value === undefined) {
			continue
		}

		if (value === null) {
			value = ''
		}

		if (typeof value === 'object') {
			value = parametersToString(value as Json)
		}

		parametersString += `${key}:${value};`
	}

	return parametersString
}

// Wire format of gamemoney@3 (request + qs): RFC 3986 escaping, nested values as `key[index]=value`
function encodeFormComponent(value: string): string {
	return encodeURIComponent(value).replaceAll(
		/[!'()*]/g,
		(char) => `%${char.codePointAt(0)!.toString(16).toUpperCase()}`,
	)
}

function appendFormValue(pairs: string[], key: string, value: FormValue) {
	if (value === undefined) {
		return
	}

	if (typeof value === 'object' && value !== null) {
		for (const [nestedKey, nestedValue] of Object.entries(value)) {
			appendFormValue(pairs, `${key}[${nestedKey}]`, nestedValue)
		}

		return
	}

	pairs.push(
		`${encodeFormComponent(key)}=${encodeFormComponent(
			value === null ? '' : String(value),
		)}`,
	)
}

function compact(value: FormValue): FormValue {
	if (typeof value !== 'object' || value === null) {
		return value
	}

	const entries = Object.entries(value)
		.map(([key, nested]) => [key, compact(nested)] as const)
		.filter(([, nested]) => nested !== undefined)

	return entries.length === 0 ? undefined : Object.fromEntries(entries)
}

// A form cannot carry undefined values or empty arrays and objects, so they are not signed either
export function compactForm(
	form: Record<string, unknown>,
): Record<string, FormValue> {
	return (compact(form as FormValue) ?? {}) as Record<string, FormValue>
}

export function stringifyForm(form: Record<string, FormValue>): string {
	const pairs: string[] = []

	for (const [key, value] of Object.entries(form)) {
		appendFormValue(pairs, key, value)
	}

	return pairs.join('&')
}

export function verifyRsaSignature(
	body: unknown,
	publicKey: RsaPublicKey = gameMoneyCertificate,
): boolean {
	if (
		typeof body !== 'object' ||
		body === null ||
		!('signature' in body) ||
		typeof body.signature !== 'string' ||
		body.signature === ''
	) {
		return false
	}

	return crypto
		.createVerify('RSA-SHA256')
		.update(parametersToString(body as Json), 'utf8')
		.verify(publicKey, body.signature, 'base64')
}

export function generateRsaSignature(body: Json, key: RsaKey): string {
	return crypto
		.createSign('RSA-SHA256')
		.update(parametersToString(body), 'utf8')
		.sign(key, 'base64')
}

export function generateHmacSignature(body: Json, key: HmacKey): string {
	return crypto
		.createHmac('sha256', key)
		.update(parametersToString(body), 'utf8')
		.digest('hex')
}

export function getRandomString(length: number): string {
	return crypto
		.randomBytes(Math.ceil(length / 2))
		.toString('hex')
		.slice(0, length)
}
