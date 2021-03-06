# YoloSwap

## I. Available Scripts

### `npm run local`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `REACT_APP_ENV=local node server/server.js`
Run the API in the development mode, the server is served in port 3002 [http://localhost:3002](http://localhost:3002)

## II. Available APIs

### II.1. /getRate
(GET) Get rate for a token pair by source token symbol, destination token symbol & source amount.

##### Parameters:

|Name | Type | Required | Description | Example|
| ----------| ------|----------------------|---|----|
|srcSymbol|String|True|Source token symbol|EOS|
|destSymbol|String|True|Destination token symbol|IQ|
|srcAmount|Number|True|Source amount|1|

##### Success Response Example:

```
{
    status: {
        code: 200,
        message: "success"
    },
    data: 1213.6497
}
```

##### Error Response Example:

```
{
    status: {
        code: 400,
        message: "ETH is not supported by our API"
    }
}
```

##### Response Description:

|Name | Type | Description |
| ----------| ------|-----------------------------|
|status|Object|The object contains status of request response|
|code|Number|Response status code|
|message|String|Response message|
|data|Number|Rate of the requested token pair|

### II.2. /fetchMarketRates
(GET) Fetching data of all available tokens supported in YoloSwap with buyRate & sellRate by EOS and USD. Also, 24h change percentage is returned that is fetched by CoinGecko API.

##### Success Response Example:

```
[
    {
        id: "everipedia",
        token: "IQ",
        sellRate: 0.0007356324881262499,
        buyRate: 0.0008239609195914479,
        sellRateUsd: 0.004963648581434881,
        buyRateUsd: 0.005559640874623752,
        usdChangePercentage: 15.04167,
        eosChangePercentage: 4.15766
    },
    {
        id: "infiniverse",
        token: "INF",
        sellRate: 0.0005288105514751468,
        buyRate: 0.0005922870393190274,
        sellRateUsd: 0.0035681264572248396,
        buyRateUsd: 0.003996431329462446,
        usdChangePercentage: 5.45594,
        eosChangePercentage: -4.38324
    }
]
```

##### Response Description:

|Name | Type | Description |
| ----------| ------|-----------------------------|
|id|String|CoinGecko token ID|
|token|String|Token symbol|
|sellRate|Number|Sell rate by EOS|
|buyRate|Number|Buy rate by EOS|
|sellRateUsd|Number|Sell rate by USD|
|buyRateUsd|Number|Buy rate by USD|
|usdChangePercentage|Number|24h change percentage by USD|
|eosChangePercentage|Number|24h change percentage by EOS|

### II.3. /get24hVolumes
(GET) Fetching token volumes from the last 24h and its latest price.

##### Success Response Example:

```
{
    tokenVolumes: [
        {
            token: "KARMA",
            lastPrice: 0.00004348,
            eosVolume: 191.10570000000007,
            tokenVolume: 4300028.114399999,
            contractName: "therealkarma"
        },
        {
            token: "EOSDT",
            lastPrice: 0.267,
            eosVolume: 15.063900000001013,
            tokenVolume: 55.911678821998066,
            contractName: "eosdtsttoken"
        }
    ],
    totalEosVolume: 1526.6500000000053
}
```

## III. YOLO Integration by Iframe

```
<iframe src="https://yoloswap.com/widget" scrolling="no"></iframe>
```

To communicate between iframe and embedded Yolo, we have to use [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) with some defined events.

Sample snippet to send data through `postMessage`:
```
HTMLIFrameElement.contentWindow.postMessage(JSON.stringify({
    action: "action",
    data: dataObject
}), "https://yoloswap.com");
```

Sample snippet to receive data from Yolo:
```
window.addEventListener('message', watchPostMessages, false);

watchPostMessages(event) {
    const eventData = JSON.parse(event.data);
    const action = eventData.action;

    if (action === 'setHeight') {
      ...
    } else if (action === 'transaction') {
     ...
    }
};
```

### III.1 Events fired by Yolo
#### setHeight
To prevent iframe from scrolling inside itself, Yolo will send the exact height of the current content to your app. You should watch this event and set your iframe height accordingly.

```
{
    action: "setHeight",
    data: { height: 1600 }
}
```

#### transaction
This is the transaction data that your user should sign to implement a trade.

```
{
    action: "transaction",
    origin: true,
    data: {
        actions: [{
            account: "eosio.token",
            authorization: {
                actor: "useraccount",
                permission: "active"
            },
            data: {
                from: "useraccount",
                to: "yolonetwork1",
                quantity: "0.0010 EOS",
                memo: "3 IQ,everipediaiq,1365.0828829752868"
            }
            name: "transfer"
        }]
    }
}
```

### III.2 Events fired by your App
#### getConfig
Some of the options to customize your app.

```
{
    action: "getConfig",
    data: {
        tokens: ['IQ', 'CUSD'], // default as [] to list all available tokens.
        title: true,            // default as `true` to show or hide Yolo header title
        background: true,       // default as `true` to display Yolo background
        market: true            // default as `true` to show token market.
    }
}
```
#### getAccount
Since user will import their account through some methods offered by your app, you should send imported account data to Yolo whenever user signed in for balance fetching and other tasks.

```
{
    action: "getAccount",
    data: {
        account: "kybermainnet",
        authority: "active",
        publicKey: "EOS6qp6PrHo2oWc...TMWdfg7GSRFDnnEU"
    }
}
```
#### transaction
After user signed the transaction data, `transaction` event have to be sent to Yolo for displaying transaction ID on success or error message on failure to the frontend.

On success:

```
{
    action: "transaction",
    data: {
        broadcast: true,
        transaction_id: "e6d776c5b5a74...92d1e9195bd",
        ...
    }
}
```

On failure:
```
{
    action: "transaction",
    data: {
        code: 500,
        error: {
            code: 3090004,
            details: [{
                message: 'Error message'
            }],
            name: 'error_message',
            what: 'Error message'
        },
        message: 'Error message'
    }
}
```
