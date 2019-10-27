import Request, { TSignType, IResponse } from './request'
import { SignPrivateKeyInput } from 'crypto'
import { generateHmacSignature } from './utils'

interface IConfig {
	privateKey?: SignPrivateKeyInput
	hmacKey: string
	project: number
}

interface ICreateInvoiceRequest {
	type: string
	user: number
	ip: string
	amount: number
	comment: string
	success_url?: string
	fail_url?: string
	wallet: string
	project_invoice?: number | string
	currency?: string
	user_currency?: string
	language?: string
	[index: string]: any
}

interface ICreateInvoiceResponse extends IResponse {
	invoice: number,
	type: 'message' | 'redirect' | 'error'
	data: string
}

interface IGetInvoiceStatusRequest {
	invoice: number
	[index: string]: any
}

interface IGetInvoiceStatusResponse extends IResponse {
	project: string
	invoice: string
	status: string
	paid: number
	amount: string
	net_amount: string
	recieved_amount: string
	user: string
	type: string
	wallet: string
	project_invoice: string
	currency_project: string
	currency_user: string
	date_create: string
	date_pay: string
}

interface IGetInvoiceListRequest {
	start: string
	finish: string
	[index: string]: any
}

interface IGetInvoiceListResponse extends IResponse {
	list: IGetInvoiceStatusResponse[]
}

interface ICancelCheckoutRequest {
	projectId: number | string
	[index: string]: any
}

interface IGetCheckoutStatusRequest {
	projectId: number | string
	[index: string]: any
}

interface IRefund {
	id: string
	amount: string
	net_amount: string
	paid_amount: string
	comment: string
}

interface IGetCheckoutStatusResponse extends IResponse {
	id: string
	project: string
	projectId: string
	amount: number
	net_amount: number
	paid_amount: number
	status: string
	user: string
	wallet: string
	description: string
	comment: string
	redirect_url: string
	type: string
	currency_project: string
	currency_user: string
	date_create: string
	refunds: IRefund[]
}

interface IGetCheckoutListRequest {
	start: string
	finish: string
	[index: string]: any
}

interface IGetCheckoutListResponse extends IResponse {
	list: IGetCheckoutStatusResponse[]
}

interface ICreateCheckoutRequest {
	projectId: number | string
	user: number
	ip: string
	amount: number | string
	wallet: string
	description: string
	type: string
	currency?: string
	userCurrency?: string
	[index: string]: any
}

interface IAddCardRequest {
	user: number
	redirect: string
	[index: string]: any
}

interface IAddCardResponse extends IResponse {
	url: string
}

interface IGetCardListRequest {
	user: number
	[index: string]: any
}

interface IGetCardListResponse extends IResponse {
	pans: string[]
}

interface IDeleteCardRequest {
	user: number
	pan: string
	[index: string]: any
}

interface IPrepareExchangeRequest {
	minAmount: number
	maxAmount: number
	from: string
	to: string
	livetime?: number
	[index: string]: any
}

interface IPrepareExchangeResponse extends IResponse {
	id: string
	rate: string
}

interface IConvertExchangeRequest {
	id: number
	amount: number
	[index: string]: any
}

interface IFastConvertExchangeRequest {
	amount: number
	from: string
	to: string
	[index: string]: any
}

interface IFastConvertExchangeResponse extends IResponse {
	id: string
	rate: string
}

interface IGetExchangeInfoRequest {
	minAmount: number
	maxAmount: number
	from: string
	to: string
	livetime?: number
}

interface IGetExchangeInfoResponse extends IResponse {
	rate: string
}

interface IGetExchangeStatusRequest {
	id?: number
	externalId?: string
}

interface IGetExchangeStatusResponse extends IResponse {
	id: string
	from: string
	to: string
	rate: string
	amount_from: string
	amount_to: string
	status: string
}

interface IGetBalanceStatisticsRequest {
	currency: string
	[index: string]: any
}

interface IGetBalanceStatisticsResponse extends IResponse {
	project: string
	currency: string
	project_income: string
	project_outcome: string
	project_balance: string
	contract_income: string
	contract_outcome: string
	contract_balance: string
}

interface IGetDaysBalanceStatisticsRequest {
	currency: string
	start: string
	finish: string
	[index: string]: any
}

interface IDaysBalance {
	date: string
	income: string
	outcome: string
}

interface IGetDaysBalanceStatisticsResponse extends IResponse {
	project: string
	currency: string
	days_balance: IDaysBalance[]
}

interface IPaySystem {
	type: string
	fee: string
	fixed_fee: string
	currency: string
}

interface IGetPayTypesStatisticsResponse extends IResponse {
	project: string
	invoice: IPaySystem[]
	checkout: IPaySystem[]
}

export class GameMoney {
	public request: any
	private config: IConfig

	constructor(config: IConfig) {
		this.config = config

		const { hmacKey, privateKey } = config

		this.request = new Request(hmacKey, privateKey)
	}

	public send(url: string, body: any = {}, signType: TSignType = 'hmac'): Promise<any> {
		body.project = this.config.project

		if (signType === 'rsa' && !this.config.privateKey) {
			throw new Error('To make requests with signType: \'rsa\', privateKey must be specified')
		}

		return this.request.send(url, body, signType)
	}

	public generateHmacSignature(body: any) {
		return generateHmacSignature(body, this.config.hmacKey)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#invoice_insert_api)
	public createInvoice(body: ICreateInvoiceRequest): Promise<ICreateInvoiceResponse> {
		return this.send('/invoice/', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#invoice_status)
	public getInvoiceStatus(body: IGetInvoiceStatusRequest): Promise<IGetInvoiceStatusResponse> {
		return this.send('/invoice/status', body)
	}

	// For more details and usage information see [docs](https://cp.gamemoney.com/apidoc#invoice_list)
	public getInvoiceList(body: IGetInvoiceListRequest): Promise<IGetInvoiceListResponse> {
		return this.send('/invoice/list', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#checkout_insert)
	public createCheckout(body: ICreateCheckoutRequest): Promise<IResponse> {
		return this.send('/checkout/insert', body, 'rsa')
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#checkout_cancel)
	public cancelCheckout(body: ICancelCheckoutRequest): Promise<IResponse> {
		return this.send('/checkout/cancel', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#checkout_status)
	public getCheckoutStatus(body: IGetCheckoutStatusRequest): Promise<IGetCheckoutStatusResponse> {
		return this.send('/checkout/status', body)
	}

	// For more details and usage information see [docs](https://cp.gamemoney.com/apidoc#checkout_list)
	public getCheckoutList(body: IGetCheckoutListRequest): Promise<IGetCheckoutListResponse> {
		return this.send('/checkout/list', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#card_add)
	public addCard(body: IAddCardRequest): Promise<IAddCardResponse> {
		return this.send('/card/add', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#card_list)
	public getCardList(body: IGetCardListRequest): Promise<IGetCardListResponse> {
		return this.send('/card/list', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#card_list)
	public deleteCard(body: IDeleteCardRequest): Promise<IResponse> {
		return this.send('/card/delete', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#exchange_prepare)
	public prepareExchange(body: IPrepareExchangeRequest): Promise<IPrepareExchangeResponse> {
		return this.send('/exchange/prepare', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#exchange_convert)
	public convertExchange(body: IConvertExchangeRequest): Promise<IResponse> {
		return this.send('/exchange/convert', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#exchange_fastconvert)
	public fastConvertExchange(body: IFastConvertExchangeRequest): Promise<IFastConvertExchangeResponse> {
		return this.send('/exchange/fastconvert', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#exchange_info)
	public getExchangeInfo(body: IGetExchangeInfoRequest): Promise<IGetExchangeInfoResponse> {
		return this.send('/exchange/info', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#exchange_status)
	public getExchangeStatus(body: IGetExchangeStatusRequest): Promise<IGetExchangeStatusResponse> {
		return this.send('/exchange/status', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#stat_balance)
	public getBalanceStatistics(body: IGetBalanceStatisticsRequest): Promise<IGetBalanceStatisticsResponse> {
		return this.send('/statistics/balance', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#stat_days_balance)
	public getDaysBalanceStatistics(body: IGetDaysBalanceStatisticsRequest): Promise<IGetDaysBalanceStatisticsResponse> {
		return this.send('/statistics/days_balance_project', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc#stat_paytypes)
	public getPayTypesStatistics(): Promise<IGetPayTypesStatisticsResponse> {
		return this.send('/statistics/paytypes')
	}
}

export { verifyRsaSignature } from './utils'
