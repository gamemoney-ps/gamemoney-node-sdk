import got from 'got'
import {
	generateRsaSignature,
	generateHmacSignature,
	getRandomString,
	verifyRsaSignature,
	type RsaKey,
	type HmacKey,
} from './utils.js'

export enum SignType {
	'HMAC' = 'HMAC',
	'RSA' = 'RSA',
}

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
}

export type CreateInvoiceRequest = {
	[key: string]: any
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
}

export type CreateInvoiceResponse = {
	invoice: number
	type: 'message' | 'redirect' | 'cardrequest' | 'error'
	data: string
}

export type GetInvoiceStatusRequestWithProjectInvoiceId = {
	[key: string]: any
	invoice: number
}

export type GetInvoiceStatusRequestWithGamemoneyInvoiceId = {
	[key: string]: any
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
	date_pay: string
	rate?: string
	recurrent_token?: string
	reason?: string
	txid?: string
}

export type GetInvoiceListRequest = {
	[key: string]: any
	start: string
	finish: string
	status?: InvoiceStatus
}

export type GetInvoiceListResponse = {
	list: GetInvoiceStatusResponse[]
	is_limit_exceeded: 'yes' | 'no'
}

export type CancelCheckoutRequest = {
	[key: string]: any
	projectId: string
}

export type GetCheckoutStatusRequest = {
	[key: string]: any
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
	rate?: string
	txid?: string
}

export type GetCheckoutListRequest = {
	[key: string]: any
	start: string
	finish: string
}

export type GetCheckoutListResponse = {
	list: GetCheckoutStatusResponse[]
	is_limit_exceeded: 'yes' | 'no'
}

export type CreateCheckoutRequest = {
	[key: string]: any
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

export type AddCardRequest = {
	[key: string]: any
	user: string
	redirect: string
}

export type AddCardResponse = {
	url: string
}

export type AddTokenCardRequest = {
	[key: string]: any
	user: string
}

export type AddTokenCardResponse = {
	token: string
}

export type GetCardListRequest = {
	[key: string]: any
	user: string
}

export type GetCardListResponse = {
	pans: string[]
}

export type GetCardFullListRequest = {
	[key: string]: any
	user: string
}

export type GetCardFullListResponse = {
	cards?: Array<{
		pan: string
		expire_month: string
		expire_year: string
		cardholder: string
	}>
}

export type DeleteCardRequest = {
	[key: string]: any
	user: string
	pan: string
}

export type PrepareExchangeRequest = {
	[key: string]: any
	externalId: string
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
	[key: string]: any
	id: number
	amount: number
}

export type FastConvertExchangeRequest = {
	[key: string]: any
	amount: number
	from: string
	to: string
}

export type FastConvertExchangeResponse = {
	id: number
	rate: number
}

export type GetExchangeInfoRequest = {
	[key: string]: any
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
	[key: string]: any
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
	[key: string]: any
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
	[key: string]: any
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
	[key: string]: any
	user: string
	ip: string
	amount?: number
	comment?: string
	success_url?: string
	fail_url?: string
	project_invoice?: string
	currency?: string
	use_user_select_currency?: 'yes' | 'no'
	language?: string
	terminal_allow_methods?: string[]
	terminal_disable_methods?: string[]
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
	project: number
	invoice: number
	status: InvoiceStatus
	amount: number
	net_amount: number
	recieved_amount: number
	rate?: number
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
export default class GameMoney {
	private readonly got = got.extend({
		prefixUrl: 'https://paygate.gamemoney.com',
		responseType: 'json',
	})

	constructor(private readonly config: Config) {
		this.config = config
	}

	public async request<T extends GenericResponse>(
		url: string,
		payload: Payload = {},
		signType: SignType = SignType.HMAC,
	): Promise<T> {
		const form: GenericRequest = {
			rand: getRandomString(20),
			project: this.config.project,
			...payload,
		}

		if (signType === SignType.RSA) {
			if (!this.config.rsaPrivateKey) {
				throw new Error(
					"To make requests with RSA sign type, 'rsaPrivateKey' must be provided",
				)
			}

			form.signature = generateRsaSignature(form, this.config.rsaPrivateKey)
		} else {
			form.signature = generateHmacSignature(form, this.config.hmacPrivateKey)
		}

		const response = await this.got.post<T>({
			url,
			form,
			resolveBodyOnly: true,
		})

		if (!verifyRsaSignature(response)) {
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

	public generateHmacSignature(body: any) {
		return generateHmacSignature(body, this.config.hmacPrivateKey)
	}

	public verifyRsaSignature(body: any) {
		return verifyRsaSignature(body)
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

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#checkout_insert) */
	public async createCheckout(body: CreateCheckoutRequest) {
		return this.request<GenericResponse>('checkout/insert', body, SignType.RSA)
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

	/** For more details and usage information see [docs](https://cp.gmpays.com/apidoc#card_list) */
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
