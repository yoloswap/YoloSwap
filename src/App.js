import React, { Component } from 'react';
import {Tokens, TokensWithEOS} from './tokens/Tokens';
import {Rate} from "./Rate.js";
import {Balances} from "./Balances.js";
import {TradeDemo} from "./Trade.js";
import './App.css';

function TokenRateList(props) {
  const tokens = props.tokens;
  const rateList = tokens.map((token) =>
    <Rate key={token.account} token={token} />
  )
  return (
    <div>{rateList}</div>
  );
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Yolo Swap - Securely - Instant - Guaranteed
        </header>
        <p>Balance</p>
        <div className="balances">
          <Balances tokens={TokensWithEOS} />
        </div>
        <p>Rates</p>
        <div className="rate-table">
          <TokenRateList tokens={Tokens} />
        </div>
        <p>Trade demo</p>
        <div className="trade">
          <TradeDemo/>
        </div>
      </div>
    );
  }
}

export default App;
