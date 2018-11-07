import Request, { TSignType } from './request'
import { IRsaPrivateKey } from './utils'

interface IConfig {
	privateKey: IRsaPrivateKey
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

interface IGetInvoiceStatusRequest {
	invoice: number
	[index: string]: any
}

interface ICancelCheckoutRequest {
	projectId: number | string
	[index: string]: any
}

interface IGetCheckoutStatusRequest {
	projectId: number | string
	[index: string]: any
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

interface IGetCardListRequest {
	user: number
	[index: string]: any
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

interface IGetExchangeInfoRequest {
	id: number
	[index: string]: any
}

interface IGetExchangeStatusRequest {
	minAmount: number
	maxAmount: number
	from: string
	to: string
	livetime?: number
	[index: string]: any
}

interface IGetBalanceStatisticsRequest {
	currency: string
	[index: string]: any
}

interface IGetDaysBalanceStatisticsRequest {
	currency: string
	start: string
	finish: string
	[index: string]: any
}

export class GameMoney {
	public request: any
	private config: IConfig

	constructor(config: IConfig) {
		this.config = config

		const { hmacKey, privateKey } = config

		this.request = new Request(hmacKey, privateKey)
	}

	public send(url: string, body: any = {}, signType: TSignType = 'hmac') {
		body.project = this.config.project

		return this.request.send(url, body, signType)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#invoice_insert_api)
	public createInvoice(body: ICreateInvoiceRequest) {
		return this.send('/invoice/', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#invoice_status)
	public getInvoiceStatus(body: IGetInvoiceStatusRequest) {
		return this.send('/invoice/status', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#checkout_insert)
	public createCheckout(body: ICreateCheckoutRequest) {
		return this.send('/checkout/insert', body, 'rsa')
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#checkout_cancel)
	public cancelCheckout(body: ICancelCheckoutRequest) {
		return this.send('/checkout/cancel', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#checkout_status)
	public getCheckoutStatus(body: IGetCheckoutStatusRequest) {
		return this.send('/checkout/status/', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#card_add)
	public addCard(body: IAddCardRequest) {
		return this.send('/card/add', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#card_list)
	public getCardList(body: IGetCardListRequest) {
		return this.send('/card/list', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#card_list)
	public deleteCard(body: IDeleteCardRequest) {
		return this.send('/card/delete', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#exchange_prepare)
	public prepareExchange(body: IPrepareExchangeRequest) {
		return this.send('/exchange/prepare', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#exchange_convert)
	public convertExchange(body: IConvertExchangeRequest) {
		return this.send('/exchange/convert', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#exchange_fastconvert)
	public fastConvertExchange(body: IFastConvertExchangeRequest) {
		return this.send('/exchange/fastconvert', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#exchange_info)
	public getExchangeInfo(body: IGetExchangeInfoRequest) {
		return this.send('/exchange/status', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#exchange_status)
	public getExchangeStatus(body: IGetExchangeStatusRequest) {
		return this.send('/exchange/info', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#stat_balance)
	public getBalanceStatistics(body: IGetBalanceStatisticsRequest) {
		return this.send('/statistics/balance', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#stat_days_balance)
	public getDaysBalanceStatistics(body: IGetDaysBalanceStatisticsRequest) {
		return this.send('/statistics/days_balance_project', body)
	}

	// For more details and usage information see [docs](http://cp.gamemoney.com/apidoc.php#stat_paytypes)
	public getPayTypesStatistics() {
		return this.send('/statistics/paytypes')
	}
}

export { verifyRsaSignature } from './utils'
