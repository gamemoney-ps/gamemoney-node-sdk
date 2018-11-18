![GameMoney](https://auth.gamemoney.com/assets/img/logo_gamemoney_login.png)

[GameMoney](https://gamemoney.com) API wrapper for Node.js

Full API documentation [here](https://cp.gamemoney.com/apidoc.php)

## Installation 
```sh
$ npm install gamemoney
```

## Usage

### Initialization
```typescript
import fs from 'fs'
import { GameMoney } from 'gamemoney'

const gm = new GameMoney({
	// Optional. But for make checkouts must be specified
	privateKey: {
		key: fs.readFileSync('./private.pem').toString(),
		passphrase: '123' // Optional
	},

	// for create a request signature
	hmacKey: 'test',
	project: 42
})
```

### Invoicing using API
```typescript
const result = await gm.createInvoice({
	wallet: '79253642685',
	amount: 200.50,
	type: 'qiwi',
	comment: 'testing',
	user: 1,
	ip: '1.2.3.4',
	add_some_field: 'some value'
})

console.log(result)
```

### Invoicing using the Terminal
```typescript
const body = {
	project: 123,
	user: 1
}

const sign = gm.generateHmacSignature(body)
```
```html
<form method="post" action="https://pay.gamemoney.com/terminal/">
	<input type="hidden" name="project" value="123">
	<input type="hidden" name="user" value="1">
	<input type="hidden" name="signature" value="{{ sign }}">
	<input type="submit" value="Pay">
</form>
```

### Checkout
```typescript
const result = await gm.createCheckout({
	wallet: '79253642685',
	amount: 200.50,
	type: 'qiwi',
	description: 'testing',
	user: 1,
	ip: '1.2.3.4',
	projectId: 1235,
	currency: 'rur'
})

console.log(result)
```

### Handle notifications about invoice/checkout status changes
```typescript
import express from 'express'
import bodyParser from 'body-parser'
import { verifyRsaSignature } from 'gamemoney'

const app = express()

app.use(bodyParser.json())

app.post('/gamemoney/callback/url', (req, res) => {
	const { body } = req

	if (!verifyRsaSignature(body)) {
		return res.send({
			success: false,
			error: 'signature mismatch'
		})
	}

	console.log(body)
})

app.listen(3000)
```