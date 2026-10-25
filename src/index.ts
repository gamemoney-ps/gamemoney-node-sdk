import {
	generateRsaSignature,
	generateHmacSignature,
	getRandomString,
	stringifyForm,
	verifyRsaSignature,
	type RsaKey,
	type RsaPublicKey,
	type HmacKey,
} from './utils.ts'

export {
	generateHmacSignature,
	generateRsaSignature,
	parametersToString,
	verifyRsaSignature,
} from './utils.ts'

export const SignType = {
	HMAC: 'HMAC',
	RSA: 'RSA',
} as const

export type SignType = (typeof SignType)[keyof typeof SignType]

export type GenericRequest = {
	[key: string]: any
	rand?: string
	project: number
	signature?: string
}

export type GenericResponse = {
	[key: string]: any
	state: 'success' | 'error'
	time: number
	error?: string
	rand?: string
	signature: string
}
export type Config = {
	rsaPrivateKey?: RsaKey
	hmacPrivateKey: HmacKey
	project: number
	apiUrl?: string
	gameMoneyPublicKey?: RsaPublicKey
	timeout?: number
}

export type CreateInvoiceRequest = {
	[key: string]: unknown
	type: string
	user: string
	ip: string
	amount: number
	comment?: string
	success_url?: string
	fail_url?: string
	wallet: string
	project_invoice?: string
	currency?: string
	user_currency?: string
	language?: string
	mode?: 'card_direct'
	return_mode?: 'skip'
	recurring?: 'yes'
	recurrent_token?: string
	payment_token?: string
	theme?: 'dark' | 'light'
}

export type CreateInvoiceResponse = {
	invoice: number
	type: 'message' | 'redirect' | 'cardrequest' | 'error'
	data: string
}

export type GetInvoiceStatusRequestWithProjectInvoiceId = {
	[key: string]: unknown
	invoice: number
}

export type GetInvoiceStatusRequestWithGamemoneyInvoiceId = {
	[key: string]: unknown
	project_invoice: string
}

export type GetInvoiceStatusRequest =
	| GetInvoiceStatusRequestWithProjectInvoiceId
	| GetInvoiceStatusRequestWithGamemoneyInvoiceId

export type GetInvoiceStatusResponse = {
	project: number
	invoice: number
	status: string
	amount: number
	net_amount: number
	recieved_amount: number
	user: string
	type: string
	wallet: string
	comment: string
	project_invoice: string
	currency_project: string
	currency_user: string
	date_create: string
	date_pay?: string
	rate?: number
	recurrent_token?: string
	reason?: string
	txid?: string
}

export type GetInvoiceListRequest = {
	[key: string]: unknown
	start: string
	finish: string
	status?: InvoiceStatus
}

export type GetInvoiceListResponse = {
	list: GetInvoiceStatusResponse[]
	is_limit_exceeded: 'yes' | 'no'
}

export type AddTokenInvoiceRequest = {
	[key: string]: unknown
	user: string
}

export type AddTokenInvoiceResponse = {
	token: string
}

export type GetCardSessionStatusRequest = Record<string, unknown> &
	({ invoice: string } | { project_invoice: string })

export type WaitOrDeclineCardSessionStatusResponse = {
	status: 'wait' | 'decline'
	data: string
}

export type FinishCardSessionStatusResponse = {
	status: 'finish'
	type: 'redirect'
	data: string
}

export type GetCardSessionStatusResponse =
	| WaitOrDeclineCardSessionStatusResponse
	| FinishCardSessionStatusResponse

export type CancelCheckoutRequest = {
	[key: string]: unknown
	projectId: string
}

export type GetCheckoutStatusRequest = {
	[key: string]: unknown
	projectId: string
}

export type Refund = {
	id: number
	amount: number
	net_amount: number
	paid_amount: number
	comment: string
}

export type GetCheckoutStatusResponse = {
	id: number
	project: number
	projectId: string
	amount: number
	net_amount: number
	paid_amount: number
	status: number
	user: string
	wallet: string
	description: string
	comment: string
	type: string
	currency_project: string
	currency_user: string
	date_create: string
	rate?: number
	txid?: string
}

export type GetCheckoutListRequest = {
	[key: string]: unknown
	start: string
	finish: string
}

export type GetCheckoutListResponse = {
	list: GetCheckoutStatusResponse[]
	is_limit_exceeded: 'yes' | 'no'
}

export type CreateCheckoutRequest = {
	[key: string]: unknown
	projectId: string
	user: string
	ip: string
	amount: number
	wallet: string
	description: string
	type: string
	currency?: string
	userCurrency?: string
	prepareToken?: string
}

export type PrepareCheckoutRequest = Record<string, unknown> & {
	type: string
	wallet?: string
	currency?: string
	userCurrency?: string
} & ({ amount: number } | { paid_amount: number })

export type PrepareCheckoutResponse = {
	amount: number
	net_amount: number
	paid_amount: number
	currency_project: string
	currency_user: string
	token?: string
	rate?: number
	expire?: number
}

export type AddCardRequest = {
	[key: string]: unknown
	user: string
	redirect: string
	language?: string
	theme?: 'dark' | 'light'
}

export type AddCardResponse = {
	url: string
}

export type AddTokenCardRequest = {
	[key: string]: unknown
	user: string
}

export type AddTokenCardResponse = {
	token: string
}

export type GetCardListRequest = {
	[key: string]: unknown
	user: string
}

export type GetCardListResponse = {
	pans: string[]
}

export type GetCardFullListRequest = {
	[key: string]: unknown
	user: string
}

export type GetCardFullListResponse = {
	cards?: Array<{
		pan: string
		expire_month: string
		expire_year: string
		cardholder: string
		country?: string
	}>
}

export type DeleteCardRequest = {
	[key: string]: unknown
	user: string
	pan: string
}

export type PrepareExchangeRequest = {
	[key: string]: unknown
	externalId?: string
	minAmount: number
	maxAmount: number
	from: string
	to: string
	livetime?: number
}

export type PrepareExchangeResponse = {
	id: number
	rate: number
	exchanged_amount_from: number
	exchanged_amount_to: number
}

export type ConvertExchangeRequest = {
	[key: string]: unknown
	id: number
	amount: number
}

export type FastConvertExchangeRequest = {
	[key: string]: unknown
	amount: number
	from: string
	to: string
}

export type FastConvertExchangeResponse = {
	id: number
	rate: number
}

export type GetExchangeRateRequest = {
	[key: string]: unknown
	from: string
	to: string
}

export type GetExchangeRateResponse = {
	buy: number
	sell: number
}

export type GetExchangeInfoRequest = {
	[key: string]: unknown
	minAmount: number
	maxAmount: number
	from: string
	to: string
	livetime?: number
	rateType?: 'exchange' | 'invoice' | 'checkout'
}

export type GetExchangeInfoResponse = {
	rate: number
	exchanged_amount_from: number
	exchanged_amount_to: number
}

export type GetExchangeStatusRequest = {
	[key: string]: unknown
	id?: number
	externalId?: string
}

export type GetExchangeStatusResponse = {
	id: number
	from: string
	to: string
	rate: number
	amount_from: number
	amount_to: number
	status: string
}

export type GetBalanceStatisticsRequest = {
	[key: string]: unknown
	currency: string
}

export type GetBalanceStatisticsResponse = {
	project: number
	currency: string
	project_income: number
	project_outcome: number
	project_balance: number
	contract_income: number
	contract_outcome: number
	contract_balance: number
}

export type GetDaysBalanceStatisticsRequest = {
	[key: string]: unknown
	currency: string
	start: string
	finish: string
}

export type DaysBalance = {
	date: string
	income: number
	outcome: number
}

export type GetDaysBalanceStatisticsResponse = {
	project: number
	currency: string
	days_balance: DaysBalance[]
}

export type PaySystem = {
	type: string
	fee: number
	fixed_fee: number
	currency: string
	image_url: string
	min_sum?: number
	max_sum?: number
	terminal?: 'enabled' | 'disabled'
}

export type GetPayTypesStatisticsResponse = {
	project: number
	invoice: PaySystem[]
	checkout: PaySystem[]
}

export type CreateTerminalRequest = {
	[key: string]: unknown
	user: string
	amount?: number
	comment?: string
	success_url?: string
	fail_url?: string
	project_invoice?: string
	currency?: string
	use_user_select_currency?: 'yes' | 'no'
	language?: string
	return_mode?: 'skip'
	recurring?: 'yes'
	terminal_allow_methods?: string[]
	terminal_disable_methods?: string[]
	terminal_livetime?: number
	terminal_country?: string
	terminal_theme?: 'dark' | 'light'
}

export type CreateTerminalResponse = {
	url: string
}

export type InvoiceStatus =
	| 'New'
	| 'Processing'
	| 'Paid'
	| 'Chargeback'
	| 'Refund'
	| 'Chargeback_cancel'
	| 'Refused'

export type InvoiceNotification = {
	project: string
	invoice: string
	status: InvoiceStatus
	amount: string
	net_amount: string
	recieved_amount: string
	rate?: string
	user: string
	type: string
	wallet: string
	comment: string
	time: string
	project_invoice?: string
	currency_project: string
	currency_user: string
	date_create: string
	date_pay?: string
	recurrent_token?: string
	reason?: string
	txid?: string
	signature: string
}

export type CheckoutNotification = {
	id: number
	project: number
	projectId: string
	amount: number
	net_amount: number
	paid_amount: number
	rate?: number
	status: string
	user: string
	wallet: string
	description: string
	comment: string
	type: string
	currency_project: string
	currency_user: string
	date_create: string
	txid?: string
	time: string
	signature: string
}

export type TransferNotification = {
	amount: number
	currency: string
	user: string
	type: string
	project: number
	ip: string
	time: number
	comment: string
	signature: string
}

type Payload = Record<string, unknown>

export class GameMoneyError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'GameMoneyError'
	}
}

export class GameMoneyHttpError extends Error {
	readonly status: number

	constructor(status: number, statusText: string) {
		super(`Response code ${status} (${statusText})`)
		this.name = 'GameMoneyHttpError'
		this.status = status
	}
}

export class GameMoney {
	private readonly config: Config

	constructor(config: Config) {
		this.config = config
	}

	public async request<T extends GenericResponse>(
		url: string,
		payload: Payload = {},
		signType: SignType = SignType.HMAC,
	): Promise<T> {
		const form: GenericRequest = {
			...payload,
			project: (payload.project as number | undefined) ?? this.config.project,
			rand: (payload.rand as string | undefined) ?? getRandomString(20),
		}

		if (signType === SignType.RSA) {
			if (this.config.rsaPrivateKey === undefined) {
				throw new Error(
					"To make requests with RSA sign type, 'rsaPrivateKey' must be provided",
				)
			}

			form.signature = generateRsaSignature(form, this.config.rsaPrivateKey)
		} else {
			form.signature = generateHmacSignature(form, this.config.hmacPrivateKey)
		}

		const httpResponse = await fetch(
			new URL(url, this.config.apiUrl ?? 'https://paygate.gamemoney.com'),
			{
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/x-www-form-urlencoded',
				},
				body: stringifyForm(form),
				redirect: 'manual',
				signal:
					this.config.timeout === undefined
						? null
						: AbortSignal.timeout(this.config.timeout),
			},
		)

		if (!httpResponse.ok) {
			throw new GameMoneyHttpError(httpResponse.status, httpResponse.statusText)
		}

		const response = (await httpResponse.json()) as T

		if (!verifyRsaSignature(response, this.config.gameMoneyPublicKey)) {
			throw new Error('Response signature mismatch')
		}

		if (form.rand !== response.rand) {
			throw new Error(`Wrong rand parameter: ${response.rand}`)
		}

		if (response.state === 'error') {
			throw new GameMoneyError(response.error!)
		}

		return response
	}

	public generateHmacSignature(body: Record<string, unknown>) {
		return generateHmacSignature(
			body as Parameters<typeof generateHmacSignature>[0],
			this.config.hmacPrivateKey,
		)
	}

	public verifyRsaSignature(body: unknown) {
		return verifyRsaSignature(body, this.config.gameMoneyPublicKey)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#invoice_insert_api) */
	public async createInvoice(body: CreateInvoiceRequest) {
		return this.request<CreateInvoiceResponse & GenericResponse>(
			'invoice/',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#invoice_status) */
	public async getInvoiceStatus(body: GetInvoiceStatusRequest) {
		return this.request<GetInvoiceStatusResponse & GenericResponse>(
			'invoice/status',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#invoice_list) */
	public async getInvoiceList(body: GetInvoiceListRequest) {
		return this.request<GetInvoiceListResponse & GenericResponse>(
			'invoice/list',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#invoice_add_token) */
	public async addTokenInvoice(body: AddTokenInvoiceRequest) {
		return this.request<AddTokenInvoiceResponse & GenericResponse>(
			'invoice/addtoken',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#card_session_status) */
	public async getCardSessionStatus(body: GetCardSessionStatusRequest) {
		return this.request<GetCardSessionStatusResponse & GenericResponse>(
			'invoice/cardsession/status',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#checkout_insert) */
	public async createCheckout(body: CreateCheckoutRequest) {
		return this.request<GenericResponse>('checkout/insert', body, SignType.RSA)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#checkout_prepare) */
	public async prepareCheckout(body: PrepareCheckoutRequest) {
		return this.request<PrepareCheckoutResponse & GenericResponse>(
			'checkout/prepare',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#checkout_check) */
	public async checkCheckout(body: CreateCheckoutRequest) {
		return this.request<GenericResponse>('checkout/check', body, SignType.RSA)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#checkout_cancel) */
	public async cancelCheckout(body: CancelCheckoutRequest) {
		return this.request<GenericResponse>('checkout/cancel', body)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#checkout_status) */
	public async getCheckoutStatus(body: GetCheckoutStatusRequest) {
		return this.request<GetCheckoutStatusResponse & GenericResponse>(
			'checkout/status',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#checkout_list) */
	public async getCheckoutList(body: GetCheckoutListRequest) {
		return this.request<GetCheckoutListResponse & GenericResponse>(
			'checkout/list',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#card_add) */
	public async addCard(body: AddCardRequest) {
		return this.request<AddCardResponse & GenericResponse>('card/add', body)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#card_add_token) */
	public async addTokenCard(body: AddTokenCardRequest) {
		return this.request<AddTokenCardResponse & GenericResponse>(
			'card/addtoken',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#card_list) */
	public async getCardList(body: GetCardListRequest) {
		return this.request<GetCardListResponse & GenericResponse>(
			'card/list',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#card_fulllist) */
	public async getCardFullList(body: GetCardFullListRequest) {
		return this.request<GetCardFullListResponse & GenericResponse>(
			'card/fulllist',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#card_delete) */
	public async deleteCard(body: DeleteCardRequest) {
		return this.request<GenericResponse>('card/delete', body)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#exchange_prepare) */
	public async prepareExchange(body: PrepareExchangeRequest) {
		return this.request<PrepareExchangeResponse & GenericResponse>(
			'exchange/prepare',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#exchange_convert) */
	public async convertExchange(body: ConvertExchangeRequest) {
		return this.request<GenericResponse>('exchange/convert', body)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#exchange_fastconvert) */
	public async fastConvertExchange(body: FastConvertExchangeRequest) {
		return this.request<FastConvertExchangeResponse & GenericResponse>(
			'exchange/fastconvert',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#exchange_rate) */
	public async getExchangeRate(body: GetExchangeRateRequest) {
		return this.request<GetExchangeRateResponse & GenericResponse>(
			'exchange/rate',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#exchange_info) */
	public async getExchangeInfo(body: GetExchangeInfoRequest) {
		return this.request<GetExchangeInfoResponse & GenericResponse>(
			'exchange/info',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#exchange_status) */
	public async getExchangeStatus(body: GetExchangeStatusRequest) {
		return this.request<GetExchangeStatusResponse & GenericResponse>(
			'exchange/status',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#stat_balance) */
	public async getBalanceStatistics(body: GetBalanceStatisticsRequest) {
		return this.request<GetBalanceStatisticsResponse & GenericResponse>(
			'statistics/balance',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#stat_days_balance) */
	public async getDaysBalanceStatistics(body: GetDaysBalanceStatisticsRequest) {
		return this.request<GetDaysBalanceStatisticsResponse & GenericResponse>(
			'statistics/days_balance_project',
			body,
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#stat_paytypes) */
	public async getPayTypesStatistics() {
		return this.request<GetPayTypesStatisticsResponse & GenericResponse>(
			'statistics/paytypes',
		)
	}

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#invoice_api_terminal) */
	public async createTerminal(body: CreateTerminalRequest) {
		return this.request<CreateTerminalResponse & GenericResponse>(
			'terminal/create',
			body,
		)
	}
}

export default GameMoney
