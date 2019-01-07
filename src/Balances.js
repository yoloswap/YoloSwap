import React from 'react';
import {getBalances} from './services/network_service';
import {account} from './account.js'

class Balances extends React.Component {

    constructor(props){
        super(props);
        let tokens = props.tokens;
        this.state = {
          tokenSymbols: tokens.map((token) => token.name),
          tokenAccounts: tokens.map((token) => token.account),
          balances: []
        }
    }

    componentDidMount(){
      getBalances(
        {
          eos: account.eos,
          account: account.account,
          tokenSymbols: this.state.tokenSymbols,
          tokenContracts: this.state.tokenAccounts,
        }
      ).then((balances) => {
          this.setState({
              balances: balances
          });
      })
    }

    render(){
      if (this.state.balances.len === 0) {
        return (
          <p>Loading balances...</p>
        )
      } else {
        const balanceList = this.state.tokenSymbols.map((sym, i) =>
          <p key={i}>{sym}: {this.state.balances[i]}</p>
        )
        return (
          <div>
            {balanceList}
          </div>
        );
      }
    }
}

export { Balances };
