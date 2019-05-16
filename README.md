# YoloSwap

## Available Scripts

### `npm run local`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `REACT_APP_ENV=local node server/server.js`
Run the API in the development mode, the server is served in port 3002 [http://localhost:3002](http://localhost:3002)

## Available APIs

### 1. /fetchMarketRates
(GET) Fetching data of all available tokens supported in YoloSwap with buyRate & sellRate by EOS and USD. Also, 24h change percentage is returned that is fetched by CoinGecko API.

#####Parameters: N/A

#####Success Response Example:
```javascript
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

#####Response Description:
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

## 1. /getRate
(GET) Get rate for a token pair by source token symbol, destination token symbol & source amount.

#####Parameters:

|Name | Type | Description | Example |
| ----------| ------|----------------------|-------|
|srcSymbol|String|Source token symbol| EOS |
|destSymbol|String|Destination token symbol| IQ |
|srcAmount|Number|Source amount| 1|

#####Success Response Example:
```javascript
{
    status: {
        code: 200,
        message: "success"
    },
    data: 1213.6497
}
```

#####Error Response Example:
```javascript
{
    status: {
        code: 400,
        message: "ETH is not supported by our API"
    }
}
```

#####Response Description:
|Name | Type | Description |
| ----------| ------|-----------------------------|
|status|Object|The object contains status of request response|
|code|Number|Response status code|
|message|String|Response message|
|data|Number|Rate of the requested token pair|
