![GameMoney](https://cp.gmpays.com/assets/img/gm_logo.png)

[GameMoney](https://gmpays.com/) API wrapper for Node.js

Full API documentation [here](https://cp.gmpays.com/apidoc)

## Installation

```sh
$ npm install gamemoney
```

The package is ESM-only (there is no CommonJS build) and has no runtime dependencies. It requires Node.js `>=22.12.0`, where ES modules can also be loaded with `require()`.

## Usage

### Initialization

```typescript
import fs from 'node:fs'
import { GameMoney } from 'gamemoney'

const gm = new GameMoney({
	project: 42,
	hmacPrivateKey: 'test',

	// Optional. But to make checkouts must be specified
	rsaPrivateKey: {
		key: fs.readFileSync('./private.pem').toString(),
		passphrase: '123', // Optional
	},

	// OR:
	// rsaPrivateKey: Buffer.from(
	// 	process.env.GM_RSA_PRIVATE_KEY ?? '',
	// 	'base64',
	// )

	// Optional. API host from the project settings. Default: https://paygate.gamemoney.com
	apiUrl: 'https://paygate.gamemoney.com',

	// Optional. GameMoney certificate or public key from the project settings,
	// used to verify signatures of responses and notifications.
	// Default: the certificate bundled with the package
	gameMoneyPublicKey: fs.readFileSync('./gm.crt'),

	// Optional. Request timeout in milliseconds. Default: no timeout
	timeout: 30_000,
})
```

From CommonJS code, via Node's built-in [`require(esm)`](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require):

```javascript
const { GameMoney, verifyRsaSignature } = require('gamemoney')
```

### Errors

- `GameMoneyError`: GameMoney responded with `"state": "error"`, the error text is in `message`.
- `GameMoneyHttpError`: GameMoney responded with a non-2xx HTTP status, available in `status`. Redirects are not followed, so a 3xx response throws it too.
- `TimeoutError`: the request did not complete within `timeout`.
- `TypeError` with `fetch failed`: a network error, the reason is in `cause`.
- `SyntaxError`: the response is not JSON.
- `Error` with `Response signature mismatch` or `Wrong rand parameter`: the response failed verification and must not be trusted.

Only `GameMoneyError` means that GameMoney rejected the request. After any other error the request may still have been processed, so check the operation status (for example, with `getCheckoutStatus`) before retrying. A repeated `createCheckout` with the same `projectId` and the same parameters does not create a second payout.

`createInvoice` resolves with `type: 'error'` when the payment system declines the payment, the reason is in `data`.

### Dates

Dates are in Moscow time (UTC+3) without an offset: `date_create` and `date_pay` in responses and notifications, and `start` and `finish` in list requests.

### Notifications

GameMoney sends notifications as a form (`application/x-www-form-urlencoded`), so parse them with `express.urlencoded()` or a similar parser. All values are strings. Payment and payout notifications are resent for 24 hours until the project responds with HTTP 200 and `{"success": "true"}`.

A payout created through the API is processed only after the project acknowledges its notification, so answer every payout notification, including the first one with status `0`. Set the final webhook URL in the project settings: a redirect (for example, from http to https) can break the delivery.

```typescript
if (!gm.verifyRsaSignature(notification)) {
	response.send({ success: 'error', error: 'signature mismatch' })
	return
}

response.send({ success: 'true' })
```

Transfer notifications are answered with the created invoice signed with HMAC, see [the example](https://github.com/gamemoney-ps/gamemoney-node-sdk/tree/master/src/examples/transfer/callback.ts).

### Signatures

`parametersToString`, `generateHmacSignature`, `generateRsaSignature` and `verifyRsaSignature` implement the [GameMoney signature algorithm](https://cp.gmpays.com/apidoc#sign_general) and are exported for custom integrations and tests, for example to sign responses of a GameMoney mock.

### Other API methods

Any API method can be called with a signed request:

```typescript
const response = await gm.request('exchange/rate', { from: 'USD', to: 'RUB' })
```

### Examples

See examples in [src/examples](https://github.com/gamemoney-ps/gamemoney-node-sdk/tree/master/src/examples) directory. They read the credentials from `GAMEMONEY_PROJECT_ID`, `GAMEMONEY_HMAC_PRIVATE_KEY` and `GAMEMONEY_RSA_PRIVATE_KEY` (base64) and can be run directly:

```sh
$ node --env-file=.env src/examples/statistics/balance.ts
```
