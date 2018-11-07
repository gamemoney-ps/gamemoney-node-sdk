![GameMoney](https://auth.gamemoney.com/assets/img/logo_gamemoney_login.png)

[GameMoney](gamemoney.com) API wrapper for Node.js

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
	privateKey: {
		// for create a invoice create request signature
		key: fs.readFileSync('./private.pem').toString(),

		// passphrase for private key
		passphrase: '123' 
	},

	// for create a request signature
	hmacKey: 'test',
	project: 42
})
```

### Create an invoice
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