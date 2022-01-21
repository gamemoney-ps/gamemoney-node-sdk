![GameMoney](https://auth.gamemoney.com/assets/img/logo_gamemoney_login.png)

[GameMoney](https://gmpays.com/) API wrapper for Node.js

Full API documentation [here](https://cp.gmpays.com/apidoc)

## Installation 
```sh
$ npm install gamemoney
```

## Usage

### Initialization
```typescript
import fs from 'fs'
import GameMoney from 'gamemoney'

const gm = new GameMoney({
	project: 42,
	hmacPrivateKey: 'test',

	// Optional. But to make checkouts must be specified
	rsaPrivateKey: {
		key: fs.readFileSync('./private.pem').toString(),
		passphrase: '123' // Optional
	},

	// OR:
	// rsaPrivateKey: Buffer.from(
	// 	process.env.GM_RSA_PRIVATE_KEY ?? '',
	// 	'base64',
	// )
})
```

### Examples
See examples in [src/examples](https://github.com/gamemoney-ps/gamemoney-node-sdk/tree/master/src/examples) directory